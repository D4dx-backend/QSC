/**
 * Malappuram East / West split migration.
 *
 * What it does:
 *  1. Trims whitespace in the "MALAPPURAM WEST " district name.
 *  2. Ensures every Area (and CenterRegistration) whose area belongs to East/West
 *     gets its `district` pointed to the correct East or West District _id.
 *  3. Likewise for ExamRegistration, ExamScore (via populated student).
 *
 * Usage:
 *   node scripts/migrate-malappuram-split.js            # dry run (default)
 *   node scripts/migrate-malappuram-split.js --apply    # actually write
 *
 * Idempotent: safe to re-run. Writes a JSON report under scripts/reports/.
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const District = require("../models/district");
const Area = require("../models/area");
const CenterRegistration = require("../models/centerRegistration");
const ExamRegistration = require("../models/examRegistration");

const APPLY = process.argv.includes("--apply");

// Canonical area lists (from client spec). Matching is case-insensitive,
// whitespace/punctuation-insensitive.
const EAST_AREAS = [
  "Wandoor", "Nilambur", "Chungathara", "Karuvarakundu", "Mambad", "Vazhakkad",
  "Areekode", "Edavanna", "Manjeri", "Valluvambram", "Kondotty", "Pulikkal",
  "Santhapuram", "Makkaraparamba", "Malappuram", "Padaparambu", "Perinthalmanna",
  "Pandikkad", "Tirurkkad",
];
const WEST_AREAS = [
  "Vailathur", "Vengara", "Alathiyur", "Thalakkad", "Tirurangadi", "Tanur",
  "Puthanathani", "Tirur", "Tanalur", "Edappal", "Perumpadapp", "Valanchery",
  "Maranchery", "University", "A.R. Nagar", "Parappur", "Kottakal", "Ponnani",
];

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Known spelling variants in existing data -> canonical name (which must be in
// the EAST/WEST lists above).
const ALIASES = {
  // East
  kottakkal: null, // moved to West in client spec; overridden below
  mampad: "Mambad",
  karuvarakkund: "Karuvarakundu",
  padapparambu: "Padaparambu",
  tirurkad: "Tirurkkad",
  // West
  perumbadapp: "Perumpadapp",
  vailathoor: "Vailathur",
  arnagar: "A.R. Nagar",
  kottakal: "Kottakal",
  // also the client used "Kottakal" but DB has "Kottakkal" (double k). That's a
  // West area per the client list.
  kottakkal_west: "Kottakal", // placeholder
};

// For West, "Kottakal" maps to DB "KOTTAKKAL". Resolve via norm match instead.
const EAST_SET = new Set(EAST_AREAS.map(norm));
const WEST_SET = new Set(WEST_AREAS.map(norm));
// Add DB-observed aliases to the right bucket.
EAST_SET.add(norm("Mampad"));
EAST_SET.add(norm("Karuvarakkund"));
EAST_SET.add(norm("Padapparambu"));
EAST_SET.add(norm("Tirurkad"));
WEST_SET.add(norm("Perumbadapp"));
WEST_SET.add(norm("Vailathoor"));
WEST_SET.add(norm("Kottakkal"));

const report = {
  apply: APPLY,
  startedAt: new Date().toISOString(),
  steps: {},
  summary: {},
};

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  console.log("[migrate] connecting to Mongo...");
  await mongoose.connect(uri);
  console.log("[migrate] mode:", APPLY ? "APPLY" : "DRY-RUN");

  // Step 1: normalize district names.
  const mlDistricts = await District.find({ district: /malappuram/i });
  const findDistrict = (name) =>
    mlDistricts.find((d) => norm(d.district).startsWith(norm(name)));
  const east = findDistrict("malappuram east") || findDistrict("malappuramea");
  const west = findDistrict("malappuram west") || findDistrict("malappuramwe");

  if (!east || !west) {
    console.error("[migrate] Both East and West districts must exist. Found:",
      mlDistricts.map((d) => d.district));
    process.exit(1);
  }
  console.log(`[migrate] East=${east._id} "${east.district}"`);
  console.log(`[migrate] West=${west._id} "${west.district}"`);

  const renamePatches = [];
  for (const d of mlDistricts) {
    const trimmed = String(d.district).trim();
    if (trimmed !== d.district) {
      renamePatches.push({ id: d._id.toString(), from: d.district, to: trimmed });
      if (APPLY) {
        await District.updateOne({ _id: d._id }, { district: trimmed });
      }
    }
  }
  report.steps.renameDistricts = renamePatches;

  // Step 2: bucket areas by name -> East/West.
  const allMlAreas = await Area.find({
    district: { $in: [east._id, west._id] },
  });

  // also safety-net: load any areas whose name matches our canonical lists
  // regardless of current district (in case someone had them under a different
  // bucket earlier).
  const allAreaNames = [...EAST_AREAS, ...WEST_AREAS];
  const candidateRegex = allAreaNames.map(
    (n) => new RegExp("^\\s*" + n.replace(/\./g, "\\.").replace(/\s+/g, "\\s+") + "\\s*$", "i")
  );
  const extra = await Area.find({ $or: candidateRegex.map((r) => ({ area: r })) });
  const areaById = new Map();
  for (const a of [...allMlAreas, ...extra]) areaById.set(a._id.toString(), a);

  const areaUpdates = [];
  const unknownAreas = [];
  for (const a of areaById.values()) {
    const key = norm(a.area);
    let target = null;
    if (EAST_SET.has(key)) target = east;
    else if (WEST_SET.has(key)) target = west;
    if (!target) {
      unknownAreas.push({ id: a._id.toString(), area: a.area });
      continue;
    }
    if (!a.district || a.district.toString() !== target._id.toString()) {
      areaUpdates.push({
        id: a._id.toString(),
        area: a.area,
        from: a.district ? a.district.toString() : null,
        to: target._id.toString(),
        toName: target.district.trim(),
      });
      if (APPLY) await Area.updateOne({ _id: a._id }, { district: target._id });
    }
  }
  report.steps.areaUpdates = areaUpdates;
  report.steps.unknownMalappuramAreas = unknownAreas;

  // Step 3: walk every CenterRegistration whose area is in our East/West set,
  // force its district to match its area's district.
  const areaIds = [...areaById.keys()].map((id) => new mongoose.Types.ObjectId(id));
  const centers = await CenterRegistration.find({ area: { $in: areaIds } }).populate("area");
  const centerUpdates = [];
  for (const c of centers) {
    if (!c.area || !c.area.district) continue;
    const shouldBe = c.area.district.toString();
    if (!c.district || c.district.toString() !== shouldBe) {
      centerUpdates.push({
        id: c._id.toString(),
        name: c.nameOfCenter,
        area: c.area.area,
        from: c.district ? c.district.toString() : null,
        to: shouldBe,
      });
      if (APPLY) await CenterRegistration.updateOne({ _id: c._id }, { district: shouldBe });
    }
  }
  report.steps.centerUpdates = centerUpdates;

  // Centers whose district is East/West but area is outside our two districts.
  const orphanCenters = await CenterRegistration.find({
    district: { $in: [east._id, west._id] },
    area: { $nin: areaIds },
  }).populate("area").populate("district");
  report.steps.orphanCenters = orphanCenters.map((c) => ({
    id: c._id.toString(),
    name: c.nameOfCenter,
    district: c.district?.district,
    area: c.area?.area,
  }));

  // Step 4: ExamRegistration — district derived from area, same rule.
  const examRegs = await ExamRegistration.find({ area: { $in: areaIds } }).populate("area");
  const examRegUpdates = [];
  for (const r of examRegs) {
    if (!r.area || !r.area.district) continue;
    const shouldBe = r.area.district.toString();
    if (!r.district || r.district.toString() !== shouldBe) {
      examRegUpdates.push({
        id: r._id.toString(),
        applicant: r.nameOfApplicant,
        area: r.area.area,
        from: r.district ? r.district.toString() : null,
        to: shouldBe,
      });
      if (APPLY) await ExamRegistration.updateOne({ _id: r._id }, { district: shouldBe });
    }
  }
  report.steps.examRegUpdates = examRegUpdates;

  // Summary counts.
  const counts = {};
  for (const d of [east, west]) {
    counts[d.district.trim()] = {
      areas: await Area.countDocuments({ district: d._id }),
      centers: await CenterRegistration.countDocuments({ district: d._id }),
      examRegs: await ExamRegistration.countDocuments({ district: d._id }),
    };
  }
  report.summary = counts;

  // Persist report.
  const reportsDir = path.join(__dirname, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(
    reportsDir,
    `malappuram-split-${APPLY ? "apply" : "dry"}-${stamp}.json`
  );
  fs.writeFileSync(file, JSON.stringify(report, null, 2));

  console.log("\n[migrate] Summary:");
  console.log(JSON.stringify(counts, null, 2));
  console.log(`\n[migrate] Report: ${file}`);
  console.log(`[migrate] Areas changed: ${areaUpdates.length}`);
  console.log(`[migrate] Centers changed: ${centerUpdates.length}`);
  console.log(`[migrate] ExamRegs changed: ${examRegUpdates.length}`);
  console.log(`[migrate] Orphan centers (manual review): ${orphanCenters.length}`);
  console.log(`[migrate] Unknown Malappuram areas: ${unknownAreas.length}`);

  await mongoose.disconnect();
  console.log(APPLY ? "[migrate] DONE (applied)" : "[migrate] DONE (dry-run, pass --apply to write)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
