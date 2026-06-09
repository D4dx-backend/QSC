#!/usr/bin/env node
/**
 * Backfill `centerCode` on every CenterRegistration document.
 *
 * Scheme:  <DIST-PREFIX><3-digit-seq within that district>
 *   e.g. MPE001, MPW001, KZK001, ...
 *
 * - Prefixes are derived from district name using `DISTRICT_PREFIXES` below.
 *   Unknown districts fall back to the first 3 uppercase letters of the name.
 * - Within a district, centres are sorted by nameOfCenter (case-insensitive, asc)
 *   then assigned sequential codes.
 * - Already-set `centerCode` values are preserved; only the gap is filled.
 * - `--apply` actually writes; otherwise dry-run.
 *
 * Usage:
 *   node scripts/backfill-center-codes.js            # dry-run
 *   node scripts/backfill-center-codes.js --apply    # commit changes
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const envCandidates = [path.join(__dirname, "..", "config", ".env"), path.join(__dirname, "..", ".env")];
for (const p of envCandidates) if (fs.existsSync(p)) dotenv.config({ path: p });

const mongoose = require("mongoose");
const CenterRegistration = require("../models/centerRegistration");
const District = require("../models/district");

// Hand-tuned prefixes — covers all 18 current districts (incl. split Malappuram).
// Keys are matched case-insensitively against the trimmed district name.
const DISTRICT_PREFIXES = {
  "THIRUVANANTHAPURAM": "TVM",
  "KOLLAM": "KLM",
  "PATHANAMTHITTA": "PTA",
  "ALAPPUZHA": "ALP",
  "KOTTAYAM": "KTM",
  "IDUKKI": "IDK",
  "ERNAKULAM": "EKM",
  "THRISSUR": "TSR",
  "PALAKKAD": "PKD",
  "MALAPPURAM EAST": "MPE",
  "MALAPPURAM WEST": "MPW",
  "KOZHIKODE": "KKD",
  "WAYANAD": "WYD",
  "KANNUR": "KNR",
  "KASARAGOD": "KSD",
  "LAKSHADWEEP": "LSD",
  "MAHE": "MHE",
};

function prefixFor(districtName) {
  if (!districtName) return "XXX";
  const key = districtName.trim().toUpperCase();
  if (DISTRICT_PREFIXES[key]) return DISTRICT_PREFIXES[key];
  // fallback: first three alpha chars
  const alpha = key.replace(/[^A-Z]/g, "");
  return (alpha.slice(0, 3) || "XXX").padEnd(3, "X");
}

async function run() {
  const apply = process.argv.includes("--apply");
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");

  await mongoose.connect(uri);
  console.log(`connected. mode=${apply ? "APPLY" : "DRY-RUN"}`);

  const districts = await District.find().lean();
  const distById = new Map(districts.map((d) => [String(d._id), d]));

  const centers = await CenterRegistration.find()
    .sort({ nameOfCenter: 1 })
    .lean();
  console.log(`centres: ${centers.length}`);

  // Group centres by district and collect already-used codes per prefix.
  const byDistrict = new Map(); // districtId -> centers[]
  const usedCodes = new Set();
  for (const c of centers) {
    if (c.centerCode) usedCodes.add(String(c.centerCode).toUpperCase());
    const key = c.district ? String(c.district) : "__NODISTRICT__";
    if (!byDistrict.has(key)) byDistrict.set(key, []);
    byDistrict.get(key).push(c);
  }

  const ops = [];
  const summary = {};

  for (const [districtId, list] of byDistrict.entries()) {
    const dist = distById.get(districtId);
    const distName = dist?.district || "(no-district)";
    const prefix = prefixFor(distName);

    // find next seq for this prefix that isn't already used
    let seq = 1;
    const takenForPrefix = [...usedCodes]
      .filter((code) => code.startsWith(prefix))
      .map((code) => parseInt(code.slice(prefix.length), 10))
      .filter((n) => !isNaN(n));
    if (takenForPrefix.length) seq = Math.max(...takenForPrefix) + 1;

    let assigned = 0;
    for (const c of list) {
      if (c.centerCode) continue;
      const code = `${prefix}${String(seq).padStart(3, "0")}`;
      seq += 1;
      usedCodes.add(code);
      assigned += 1;
      ops.push({
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { centerCode: code } },
        },
      });
    }
    summary[distName] = { prefix, total: list.length, assigned };
  }

  console.log("\nSummary by district:");
  console.table(summary);
  console.log(`\nTotal writes queued: ${ops.length}`);

  if (apply && ops.length) {
    const res = await CenterRegistration.bulkWrite(ops, { ordered: false });
    console.log("bulkWrite:", { matched: res.matchedCount, modified: res.modifiedCount });
  } else if (!apply) {
    console.log("(dry-run; re-run with --apply to commit)");
  }

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
