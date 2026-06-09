const router = require("express").Router();
// controllers
const { addSyllabus, updateSyllabus, deleteSyllabus, getSyllabus, select } = require("../controllers/syllabus");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(getUploadMiddleware("uploads/syllabus", ["attachment"]), getS3Middleware(["attachment"]), addSyllabus)
  .get(reqFilter, getSyllabus)
  .put(getUploadMiddleware("uploads/syllabus", ["attachment"]), getS3Middleware(["attachment"]), updateSyllabus)
  .delete(deleteSyllabus);

router.route("/select").get(reqFilter, select);

module.exports = router;
