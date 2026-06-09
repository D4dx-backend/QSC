const express = require("express");
const router = express.Router();
//controllers
const { createFranchise, getFranchise, updateFranchise, deleteFranchise, select, getFranchiseMobile } = require("../controllers/franchise");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(protect, getUploadMiddleware("uploads/franchise", ["logo"]), getS3Middleware(["logo"]), createFranchise)
  .get(protect, reqFilter, getFranchise)
  .put(protect, getUploadMiddleware("uploads/franchise", ["logo"]), getS3Middleware(["logo"]), updateFranchise)
  .delete(protect, deleteFranchise);
router.get("/select", reqFilter, select);
router.get("/getFranchise", reqFilter, getFranchiseMobile);
module.exports = router;
