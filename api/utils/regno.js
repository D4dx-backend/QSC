const Counter = require("../models/counter");
const CenterRegistration = require("../models/centerRegistration");
const District = require("../models/district");
const Area = require("../models/area");

// Derive 2-digit year from a Date (defaults to now)
function currentYY(date = new Date()) {
  return String(date.getFullYear()).slice(-2);
}

/**
 * Atomically generate the next registration number for a given center and year.
 * Format: `{YY}{CenterCode}{Seq4}`  e.g. `26MPE0010001`
 *
 * - `centerRegistrationId`: ObjectId (string or ObjectId)
 * - `year`: optional explicit YY (string "26") or 4-digit year (number/string); defaults to current
 *
 * Throws if the center has no `centerCode` set — callers must backfill first.
 */
async function nextRegNo(centerRegistrationId, year) {
  if (!centerRegistrationId) throw new Error("centerRegistrationId required");

  const center = await CenterRegistration.findById(centerRegistrationId)
    .select("centerCode nameOfCenter")
    .lean();
  if (!center) throw new Error("CenterRegistration not found");
  if (!center.centerCode) {
    throw new Error(
      `Center ${center.nameOfCenter || centerRegistrationId} has no centerCode. Run scripts/backfill-center-codes.js --apply first.`
    );
  }

  let yy;
  if (year == null) yy = currentYY();
  else {
    const s = String(year);
    yy = s.length === 2 ? s : s.slice(-2);
  }

  const key = `${yy}-${String(centerRegistrationId)}`;
  const seq = await Counter.nextSeq(key);
  const seqStr = String(seq).padStart(4, "0");
  return `${yy}${center.centerCode}${seqStr}`;
}

module.exports = { nextRegNo, currentYY, nextRegNoByDistrictArea };

/**
 * Generate registration number based on district and area.
 * Format: `QSC{DIST4}{AREA4}{Seq4}`  e.g. `QSCTHRIALPP0001`
 *
 * - `districtId`: ObjectId of the District
 * - `areaId`: ObjectId of the Area
 *
 * The 4-digit sequence is per district+area combination (0001–9999+).
 */
async function nextRegNoByDistrictArea(districtId, areaId) {
  if (!districtId) throw new Error("districtId required");
  if (!areaId) throw new Error("areaId required");

  const [district, area] = await Promise.all([
    District.findById(districtId).select("district").lean(),
    Area.findById(areaId).select("area").lean(),
  ]);

  if (!district) throw new Error("District not found");
  if (!area) throw new Error("Area not found");

  const distCode = district.district
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const areaCode = area.area
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, 4)
    .padEnd(4, "X");

  const key = `dist-${String(districtId)}-area-${String(areaId)}`;
  const seq = await Counter.nextSeq(key);
  const seqStr = String(seq).padStart(4, "0");

  return `QSC${distCode}${areaCode}${seqStr}`;
}
