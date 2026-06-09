const router = require("express").Router();
const { createExamCenterRegistration, getExamCenterRegistration, updateExamCenterRegistration, deleteExamCenterRegistration, select, getCenterByDistrict } = require("../controllers/examCenterRegistration");

// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(protect, createExamCenterRegistration).get(reqFilter, protect, getExamCenterRegistration).put(protect, updateExamCenterRegistration).delete(protect, deleteExamCenterRegistration);

router.get("/select", select);
router.get("/center-by-district", getCenterByDistrict);

module.exports = router;
