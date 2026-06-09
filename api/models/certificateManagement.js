const mongoose = require("mongoose");

const certificateManagementSchema = new mongoose.Schema(
  {
    hallTicket: {
      type: String,
    },
    examCertificate: {
      type: String,
    },
    // Legacy (kept for backward-compat + fallback for pre-2026 data)
    stateExamCertificate: {
      type: String,
    },
    districtExamCertificate: {
      type: String,
    },
    // Phase 3 — split by student status (Regular vs Private) for State/District.
    stateExamCertificateRegular: {
      type: String,
    },
    stateExamCertificatePrivate: {
      type: String,
    },
    districtExamCertificateRegular: {
      type: String,
    },
    districtExamCertificatePrivate: {
      type: String,
    },
    affiliationCertificate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CertificateManagement", certificateManagementSchema);
