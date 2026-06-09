const router = require("express").Router();
// Controllers
const { createCertificateManagement, getCertificateManagement, updateCertificateManagement, deleteCertificateManagement, select, upsertField, deleteField } = require("../controllers/certificateManagement");

const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

// Phase 3 — added P/R-split state/district certificate fields.
const CERT_FIELDS = [
  "hallTicket",
  "examCertificate",
  "stateExamCertificate",
  "districtExamCertificate",
  "stateExamCertificateRegular",
  "stateExamCertificatePrivate",
  "districtExamCertificateRegular",
  "districtExamCertificatePrivate",
  "affiliationCertificate",
];

router
  .route("/")
  .post(getUploadMiddleware("uploads/certificate-management", CERT_FIELDS), getS3Middleware(CERT_FIELDS), createCertificateManagement)
  .get(reqFilter, getCertificateManagement)
  .delete(deleteCertificateManagement);

router
  .route("/:id")
  .put(getUploadMiddleware("uploads/certificate-management", CERT_FIELDS), getS3Middleware(CERT_FIELDS), updateCertificateManagement)
  .delete(deleteCertificateManagement);

router.get("/select", reqFilter, select);

router.put("/upsert-field", getUploadMiddleware("uploads/certificate-management", CERT_FIELDS), getS3Middleware(CERT_FIELDS), upsertField);
router.put("/delete-field", deleteField);

module.exports = router;
