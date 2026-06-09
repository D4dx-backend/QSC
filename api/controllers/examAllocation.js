const mongoose = require("mongoose");
const ExamRegistration = require("../models/examRegistration");
const CenterRegistration = require("../models/centerRegistration");
const Area = require("../models/area");
const ExamSettings = require("../models/examSettings");

/**
 * Phase 2.2 — Automatic exam-centre allocation with ≥N clubbing rule.
 *
 * Input:  all registrations for one (district, examType) bucket.
 * Output: per-study-centre counts; centres below threshold are merged into the
 *         "nearest" centre in the same district that has ≥threshold members,
 *         where "nearest" == earliest-in-area-order within the district
 *         (stand-in for real geography; see plan 2.2).
 *
 * Writes `assignedExamCenter` and `assignedByClubbing` on each registration.
 * Idempotent: safe to run repeatedly. Respects `allocationLocked` in settings.
 */

// Resolve an ordering for centres in one district:
//   - group by Area (ordered by `area` string alpha),
//   - within an area, order by nameOfCenter alpha.
// This gives each centre a stable "index" we use as a proxy for distance.
async function orderedCentresForDistrict(districtId) {
  const areas = await Area.find({ district: districtId }).sort({ area: 1 }).lean();
  const centres = await CenterRegistration.find({ district: districtId })
    .sort({ nameOfCenter: 1 })
    .lean();
  const areaIndex = new Map(areas.map((a, i) => [String(a._id), i]));
  centres.sort((a, b) => {
    const ai = areaIndex.get(String(a.area)) ?? 1e9;
    const bi = areaIndex.get(String(b.area)) ?? 1e9;
    if (ai !== bi) return ai - bi;
    return String(a.nameOfCenter || "").localeCompare(String(b.nameOfCenter || ""));
  });
  return centres;
}

// Recompute allocation for one (district, examType) group.
async function recomputeGroup({ districtId, examTypeId, minCount }) {
  const query = {
    district: districtId,
    nameOfExamAppearingNow: examTypeId,
  };

  const regs = await ExamRegistration.find(query)
    .select("_id centerRegistration assignedExamCenter assignedByClubbing")
    .lean();

  if (!regs.length) {
    return { district: String(districtId), examType: String(examTypeId), moved: 0, survivors: 0, absorbed: 0 };
  }

  // Count per home study centre.
  const byHomeCentre = new Map();
  for (const r of regs) {
    const key = r.centerRegistration ? String(r.centerRegistration) : "__NONE__";
    if (!byHomeCentre.has(key)) byHomeCentre.set(key, []);
    byHomeCentre.get(key).push(r);
  }

  const centres = await orderedCentresForDistrict(districtId);
  const centreOrder = centres.map((c) => String(c._id));

  // Survivors = centres with count >= minCount.
  const survivors = new Set();
  for (const [cid, list] of byHomeCentre.entries()) {
    if (cid === "__NONE__") continue;
    if (list.length >= minCount) survivors.add(cid);
  }

  // Merge plan: sub-threshold centre -> nearest survivor by centreOrder index.
  const mergePlan = new Map(); // homeCentreId -> target survivor id
  for (const [cid, list] of byHomeCentre.entries()) {
    if (cid === "__NONE__") continue;
    if (survivors.has(cid)) {
      mergePlan.set(cid, cid); // unchanged
      continue;
    }
    // find nearest survivor in the same district by order-index distance
    const idx = centreOrder.indexOf(cid);
    let best = null;
    let bestDist = Infinity;
    for (const sid of survivors) {
      const d = Math.abs(centreOrder.indexOf(sid) - idx);
      if (d < bestDist) {
        bestDist = d;
        best = sid;
      }
    }
    // If there are no survivors in the district at all, everyone stays where they are
    // (edge case: district with <minCount total — we can't merge anywhere).
    mergePlan.set(cid, best || cid);
  }

  // Build bulk updates.
  const ops = [];
  let movedCount = 0;
  for (const r of regs) {
    const home = r.centerRegistration ? String(r.centerRegistration) : null;
    if (!home) continue; // no home centre → skip (Private with no pick)
    const target = mergePlan.get(home) || home;
    const byClubbing = target !== home;
    const curAssigned = r.assignedExamCenter ? String(r.assignedExamCenter) : null;
    if (curAssigned === target && !!r.assignedByClubbing === byClubbing) continue;
    ops.push({
      updateOne: {
        filter: { _id: r._id },
        update: {
          $set: {
            assignedExamCenter: new mongoose.Types.ObjectId(target),
            assignedByClubbing: byClubbing,
          },
        },
      },
    });
    movedCount += 1;
  }

  if (ops.length) {
    await ExamRegistration.bulkWrite(ops, { ordered: false });
  }

  const absorbed = [...mergePlan.entries()].filter(([k, v]) => k !== v).length;

  return {
    district: String(districtId),
    examType: String(examTypeId),
    survivors: survivors.size,
    absorbed,
    moved: movedCount,
    total: regs.length,
  };
}

// Public: recompute for one or all districts / exam types.
// Options: { district?: ObjectId, examType?: ObjectId, force?: boolean }
async function recomputeAllocation(opts = {}) {
  const settings = await ExamSettings.getCurrent();
  if (settings.allocationLocked && !opts.force) {
    return { skipped: true, reason: "allocation-locked" };
  }
  const minCount = settings.minCountForExamCentre || 5;

  const distMatch = opts.district ? { _id: new mongoose.Types.ObjectId(opts.district) } : {};
  const districts = await mongoose.model("District").find(distMatch).select("_id district").lean();

  const examTypeMatch = opts.examType ? { _id: new mongoose.Types.ObjectId(opts.examType) } : {};
  const examTypes = await mongoose.model("ExamType").find(examTypeMatch).select("_id examType").lean();

  const results = [];
  for (const d of districts) {
    for (const t of examTypes) {
      const r = await recomputeGroup({ districtId: d._id, examTypeId: t._id, minCount });
      if (r.total) results.push({ districtName: d.district, examTypeName: t.examType, ...r });
    }
  }
  return { skipped: false, minCount, results };
}

// ---------- HTTP handlers ----------

// POST /api/v1/exam-allocation/recompute
// body: { district?, examType?, force? }
exports.recompute = async (req, res) => {
  try {
    const out = await recomputeAllocation(req.body || {});
    res.status(200).json({ success: true, ...out });
  } catch (err) {
    console.error("recompute error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/v1/exam-allocation/summary?district=&examType=
// Returns per-centre counts + whether each centre is a survivor or absorbed.
exports.summary = async (req, res) => {
  try {
    const { district, examType } = req.query;
    const settings = await ExamSettings.getCurrent();
    const minCount = settings.minCountForExamCentre || 5;

    const match = {};
    if (district) match.district = new mongoose.Types.ObjectId(district);
    else if (req.user?.districts) match.district = new mongoose.Types.ObjectId(req.user.districts);
    if (examType) match.nameOfExamAppearingNow = new mongoose.Types.ObjectId(examType);

    const byHome = await ExamRegistration.aggregate([
      { $match: match },
      {
        $group: {
          _id: { home: "$centerRegistration", assigned: "$assignedExamCenter", clubbed: "$assignedByClubbing" },
          count: { $sum: 1 },
        },
      },
    ]);

    const byAssigned = await ExamRegistration.aggregate([
      { $match: match },
      { $group: { _id: "$assignedExamCenter", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      minCount,
      locked: settings.allocationLocked,
      byHome,
      byAssigned,
    });
  } catch (err) {
    console.error("summary error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/exam-allocation/override
// body: { registrationId, assignedExamCenter }  // manual override
exports.override = async (req, res) => {
  try {
    const { registrationId, assignedExamCenter } = req.body || {};
    if (!mongoose.isValidObjectId(registrationId) || !mongoose.isValidObjectId(assignedExamCenter)) {
      return res.status(400).json({ success: false, message: "invalid ids" });
    }
    const updated = await ExamRegistration.findByIdAndUpdate(
      registrationId,
      { $set: { assignedExamCenter, assignedByClubbing: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("override error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Exported for use from addExamRegistration (fire-and-forget).
exports.recomputeAllocation = recomputeAllocation;
exports._internal = { recomputeGroup, orderedCentresForDistrict };
