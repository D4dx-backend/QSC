const router = require("express").Router();
// controllers
const { addResultAndCertificates, select, updateResultAndCertificates, deleteResultAndCertificates, getResultAndCertificates } = require("../controllers/resultAndCertificates");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addResultAndCertificates).get(reqFilter, getResultAndCertificates).put(updateResultAndCertificates).delete(deleteResultAndCertificates);

router.route("/select").get(reqFilter, select);

module.exports = router;
