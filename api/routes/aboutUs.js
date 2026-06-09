const router = require("express").Router();
const { createAboutUs, getAboutUs, updateAboutUs, deleteAboutUs, select } = require("../controllers/aboutUs");

// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(protect, getUploadMiddleware("uploads/about", ["image", "landingMainbanner"]), getS3Middleware(["image", "landingMainbanner"]), createAboutUs)
  .get(reqFilter, getAboutUs)
  .put(protect, getUploadMiddleware("uploads/about", ["image", "landingMainbanner"]), getS3Middleware(["image", "landingMainbanner"]), updateAboutUs)
  .delete(protect, deleteAboutUs);

router.get("/select", reqFilter, protect, select);

module.exports = router;
