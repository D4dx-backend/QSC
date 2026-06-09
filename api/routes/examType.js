const router = require("express").Router();
// controllers
const { addExamType, select, updateExamType, deleteExamType, getExamType } = require("../controllers/examType");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addExamType).get(reqFilter, getExamType).put(updateExamType).delete(deleteExamType);

router.route("/select").get(reqFilter, select);

module.exports = router;
