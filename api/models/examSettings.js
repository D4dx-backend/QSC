const mongoose = require("mongoose");

// Singleton-ish settings for exam allocation / clubbing rules.
// One document per exam year. The "current" year is the one with `isCurrent: true`.
const ExamSettingsSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true }, // e.g. 2026
    // Minimum number of registrations a study centre must have to be retained
    // as its own exam centre. Centres below this get merged into the nearest
    // centre in the same district (within-district only).
    minCountForExamCentre: { type: Number, default: 5, min: 1 },
    // When true, allocation is locked — `recompute` becomes a no-op.
    // Set this after hall tickets are distributed.
    allocationLocked: { type: Boolean, default: false },
    allocationLockedAt: { type: Date, default: null },
    // When true (default), every new exam-registration triggers an async
    // per-district recompute. Turn off if volumes get very large.
    autoRecomputeOnSubmit: { type: Boolean, default: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helper: fetch current settings (create default if missing).
ExamSettingsSchema.statics.getCurrent = async function () {
  let doc = await this.findOne({ isCurrent: true });
  if (!doc) {
    // Fall back to the highest-year document, else create a default for this year.
    doc = await this.findOne().sort({ year: -1 });
    if (!doc) {
      const year = new Date().getFullYear();
      doc = await this.create({ year, isCurrent: true });
    }
  }
  return doc;
};

module.exports = mongoose.model("ExamSettings", ExamSettingsSchema);
