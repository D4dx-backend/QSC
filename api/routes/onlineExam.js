const router = require("express").Router();
const {
  addOnlineExam,
  getOnlineExams,
  updateOnlineExam,
  deleteOnlineExam,
  selectOnlineExam,
  publishResults,
  getExamResults,
  getAttemptDetail,
  getAvailableExams,
  startExam,
  submitAnswer,
  submitExam,
  getAttemptResult,
  getExamHistory,
  getPracticeQuestions,
} = require("../controllers/onlineExam");
const { protect } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

// Admin CRUD
router
  .route("/")
  .post(protect, addOnlineExam)
  .get(reqFilter, protect, getOnlineExams)
  .put(protect, updateOnlineExam)
  .delete(protect, deleteOnlineExam);

router.get("/select", reqFilter, selectOnlineExam);

// Admin — results & analytics
router.get("/results", protect, getExamResults);
router.get("/results/detail/:attemptId", protect, getAttemptDetail);
router.patch("/publish/:id", protect, publishResults);

// User — exam list, start, submit
router.get("/available", protect, getAvailableExams);
router.get("/practice", protect, getPracticeQuestions);
router.post("/start", protect, startExam);
router.post("/submit-answer", protect, submitAnswer);
router.post("/submit", protect, submitExam);
router.get("/result/:attemptId", protect, getAttemptResult);
router.get("/history", protect, getExamHistory);

module.exports = router;
