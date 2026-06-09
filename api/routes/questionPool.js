const router = require("express").Router();
const multer = require("multer");
const {
  addQuestion,
  addBulkQuestions,
  bulkUploadQuestions,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionCount,
  reorderQuestions,
} = require("../controllers/questionPool");
const { protect } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

const memoryUpload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .post(protect, addQuestion)
  .get(reqFilter, protect, getQuestions)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router.post("/bulk", protect, addBulkQuestions);
router.post("/bulk-upload", protect, memoryUpload.single("file"), bulkUploadQuestions);
router.get("/count", protect, getQuestionCount);
router.put("/reorder", protect, reorderQuestions);

module.exports = router;
