// Phase 2.6 — Rank list + per-student rank lookup.
// Computes rank for published scores within a configurable scope:
//   state | district | area | centerRegistration
//
// A single, read-only endpoint keeps the data consistent regardless of
// how the UI slices it (public result page, CMS rank list, or PDF export).

const mongoose = require("mongoose");
const ExamScore = require("../models/examScore");
const ExamRegistration = require("../models/examRegistration");

const VALID_SCOPES = ["state", "district", "area", "centerRegistration"];

/**
 * Build the { $match } stage that restricts the candidate pool to a given scope.
 * Returns null when scope is unrecognised.
 */
function scopeMatch(scope, scopeId) {
  switch (scope) {
    case "state":
      return {};
    case "district":
      return scopeId ? { "studentDoc.district": new mongoose.Types.ObjectId(String(scopeId)) } : null;
    case "area":
      return scopeId ? { "studentDoc.area": new mongoose.Types.ObjectId(String(scopeId)) } : null;
    case "centerRegistration":
      return scopeId
        ? { "studentDoc.centerRegistration": new mongoose.Types.ObjectId(String(scopeId)) }
        : null;
    default:
      return null;
  }
}

/**
 * Core helper — returns a sorted ranked list of rows (descending score)
 * for the given scope + exam. Ties share the dense rank of the higher score.
 * Optional `status` ("Private"|"Regular") narrows the candidate pool.
 */
async function buildRankList({ scope, scopeId, examType, status }) {
  if (!VALID_SCOPES.includes(scope)) throw new Error("Invalid scope.");
  if (!examType) throw new Error("examType is required.");

  const match = scopeMatch(scope, scopeId);
  if (match === null) throw new Error("scopeId is required for this scope.");

  // Phase 3 — optionally restrict to Regular-only or Private-only candidates.
  if (status === "Private" || status === "Regular") {
    match["studentDoc.status"] = status;
  }

  // Join ExamScore → ExamRegistration, keep only scores in the requested scope.
  const pipeline = [
    { $match: { exam: new mongoose.Types.ObjectId(String(examType)) } },
    {
      $lookup: {
        from: "examregistrations",
        localField: "student",
        foreignField: "_id",
        as: "studentDoc",
      },
    },
    { $unwind: "$studentDoc" },
    { $match: match },
    {
      $lookup: {
        from: "districts",
        localField: "studentDoc.district",
        foreignField: "_id",
        as: "districtDoc",
      },
    },
    {
      $lookup: {
        from: "areas",
        localField: "studentDoc.area",
        foreignField: "_id",
        as: "areaDoc",
      },
    },
    {
      $lookup: {
        from: "centerregistrations",
        localField: "studentDoc.centerRegistration",
        foreignField: "_id",
        as: "centreDoc",
      },
    },
    {
      $project: {
        _id: 1,
        score: 1,
        grade: 1,
        studentId: "$studentDoc._id",
        name: "$studentDoc.nameOfApplicant",
        regno: "$studentDoc.regno",
        status: "$studentDoc.status",
        gender: "$studentDoc.gender",
        district: { $arrayElemAt: ["$districtDoc.district", 0] },
        area: { $arrayElemAt: ["$areaDoc.area", 0] },
        centre: { $arrayElemAt: ["$centreDoc.nameOfCenter", 0] },
        centerCode: { $arrayElemAt: ["$centreDoc.centerCode", 0] },
      },
    },
    { $sort: { score: -1, name: 1 } },
  ];

  const rows = await ExamScore.aggregate(pipeline);

  // Dense ranking (1,1,2,3…): same rank for ties, no gaps.
  let lastScore = null;
  let lastRank = 0;
  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].score !== lastScore) {
      lastRank += 1;
      lastScore = rows[i].score;
    }
    rows[i].rank = lastRank;
  }

  return rows;
}

// @desc      Get rank list for a (scope, examType) combination.
// @route     GET /api/v1/exam-score/ranklist
// @access    public  (safe — only names, regnos and marks are returned)
exports.getRankList = async (req, res) => {
  try {
    const { scope = "state", scopeId, examType, status } = req.query;
    const rows = await buildRankList({ scope, scopeId, examType, status });
    return res.status(200).json({
      success: true,
      scope,
      scopeId: scopeId || null,
      status: status || null,
      count: rows.length,
      response: rows,
    });
  } catch (err) {
    console.error("ranklist error:", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Rank of a single student within a scope (used by public result page).
//            Falls back through state → district → area → centre so the public
//            page can always surface *some* rank once marks are published.
// @route     internal helper — called from examRegistration.getExamResult
exports.computeStudentRank = async ({ student, examType }) => {
  if (!student || !examType) return null;

  // Derive the student's own district / area / centre to compute their
  // district- and centre-level ranks in one go.
  const reg = await ExamRegistration.findById(student).select(
    "district area centerRegistration"
  );
  if (!reg) return null;

  const districtRows = reg.district
    ? await buildRankList({ scope: "district", scopeId: reg.district, examType })
    : [];
  const stateRows = await buildRankList({ scope: "state", scopeId: null, examType });

  const find = (rows) => rows.find((r) => String(r.studentId) === String(student));
  const districtRow = find(districtRows);
  const stateRow = find(stateRows);

  // Prefer district rank (more meaningful to student); include both.
  return {
    district: districtRow
      ? { rank: districtRow.rank, totalCandidates: districtRows.length }
      : null,
    state: stateRow
      ? { rank: stateRow.rank, totalCandidates: stateRows.length }
      : null,
  };
};

exports.buildRankList = buildRankList;
