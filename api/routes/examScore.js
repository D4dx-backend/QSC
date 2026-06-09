const router = require("express").Router();
// controllers
const { addExamScore, updateExamScore, deleteExamScore, getExamScore, select, updateGradesForExamScores, getAreasByDistrict } = require("../controllers/examScore");
const { getRankList } = require("../controllers/rankList");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(protect, addExamScore).get(reqFilter, protect, getExamScore).put(protect, updateExamScore).delete(protect, deleteExamScore);

router.route("/select").get(reqFilter, select);
router.route("/areas-by-district").get(protect, getAreasByDistrict);
router.put("/update", updateGradesForExamScores);

// Phase 2.6 — rank list (public read-only).
router.get("/ranklist", getRankList);

module.exports = router;
