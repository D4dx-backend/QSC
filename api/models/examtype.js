const mongoose = require("mongoose");

const ExamTypeSchema = new mongoose.Schema(
  {
    examType: {
      type: String,
    },
    examShortName: {
      type: String,
    },
    // Phase 3 — classify exam so certificate / rank list logic doesn't have to
    // guess from exam name strings. "State" = centralised (e.g. Preliminary VI,
    // Secondary III); "District" = conducted within each district.
    examLevel: {
      type: String,
      enum: ["State", "District"],
      default: "District",
    },
    // Phase 3 — same exam is offered in two flavours: one paper for Regular
    // students (those enrolled in affiliated study centres) and a separate
    // paper for Private students. Drives which exam a candidate is mapped to
    // based on their `status`, and which certificate template prints.
    examCategory: {
      type: String,
      enum: ["Regular", "Private"],
      default: "Regular",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("ExamType", ExamTypeSchema);
