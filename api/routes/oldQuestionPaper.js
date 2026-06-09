const router = require("express").Router();
// controllers
const { addOldQuestionPaper, select, updateOldQuestionPaper, deleteOldQuestionPaper, getOldQuestionPaper } = require("../controllers/oldQuestionPapers");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(getUploadMiddleware("uploads/oldQuestions", ["attachment"]), getS3Middleware(["attachment"]), addOldQuestionPaper)
  .get(reqFilter, getOldQuestionPaper)
  .put(getUploadMiddleware("uploads/oldQuestions", ["attachment"]), getS3Middleware(["attachment"]), updateOldQuestionPaper)
  .delete(deleteOldQuestionPaper);

router.route("/select").get(reqFilter, select);

router.get("/get-old-question-paper", getOldQuestionPaper);

module.exports = router;
