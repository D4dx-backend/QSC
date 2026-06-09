const router = require("express").Router();
// controllers
const { addExamRegistration, select, updateExamRegistration, deleteExamRegistration, getExamRegistration, getExamResult, downloadCertificate, getOutsideExamCenterByDistrict, getAttendanceSheet, getExamRegistrationList, getOutsideExamAttendanceSheet, getDistrictsExcludingOwn, getRegisteredStudentsList } = require("../controllers/examRegistration");
const { selectAndExport, deduplicate } = require("../controllers/formexport");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addExamRegistration).get(reqFilter, protect, getExamRegistration).put(updateExamRegistration).delete(deleteExamRegistration);

router.route("/select").get(reqFilter, select);
router.get("/export", reqFilter, protect, selectAndExport);
router.get("/deduplicate", deduplicate);
router.get("/result", getExamResult);
router.get("/download-state-certificate", downloadCertificate);
router.route("/district-center").get(reqFilter, getOutsideExamCenterByDistrict);
router.get("/attendance-sheet", reqFilter, protect, getAttendanceSheet);
router.get("/registered-list", reqFilter, protect, getRegisteredStudentsList);
router.get("/list", getExamRegistrationList);
router.get("/outside-center-list", reqFilter, getOutsideExamAttendanceSheet);
router.get("/districts-excluding-own", getDistrictsExcludingOwn);

module.exports = router;
