const express = require("express");
const router = express.Router();
// controllers
const {
  addUser,
  updateUser,
  deleteUser,
  getUser,
  select,
  addFranchiseAdmin,
  getFranchiseAdmin,
  addEventAdmin,
  getEventAdmin,
  getDistrictAdmin,
  addDistrictAdmin,
} = require("../controllers/user");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(addUser)
  .get(reqFilter, protect, getUser)
  .put(updateUser)
  .delete(deleteUser);

router
  .route("/franchiseAdmin")
  .post(
    getUploadMiddleware("uploads/franchiseAdmin", ["image"]),
    getS3Middleware(["image"]),
    addFranchiseAdmin
  )
  .get(reqFilter, getFranchiseAdmin)
  .put(
    getUploadMiddleware("uploads/franchiseAdmin", ["image"]),
    getS3Middleware(["image"]),
    updateUser
  )
  .delete(deleteUser);

router
  .route("/eventAdmin")
  .post(
    protect,
    getUploadMiddleware("uploads/eventAdmin", ["image"]),
    getS3Middleware(["image"]),
    addEventAdmin
  )
  .get(protect, reqFilter, getEventAdmin)
  .put(
    protect,
    getUploadMiddleware("uploads/eventAdmin", ["image"]),
    getS3Middleware(["image"]),
    updateUser
  )
  .delete(deleteUser);

router
  .route("/districtAdmin")
  .post(addDistrictAdmin)
  .get(reqFilter, getDistrictAdmin)
  .put(updateUser)
  .delete(protect, deleteUser);

router.get("/select", reqFilter, select);
module.exports = router;
