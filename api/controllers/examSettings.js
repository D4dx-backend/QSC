const ExamSettings = require("../models/examSettings");

// GET /api/v1/exam-settings
exports.getCurrent = async (req, res) => {
  try {
    const doc = await ExamSettings.getCurrent();
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("examSettings.get:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/exam-settings
// body: partial — only whitelisted fields accepted
exports.update = async (req, res) => {
  try {
    const doc = await ExamSettings.getCurrent();
    const allowed = ["minCountForExamCentre", "allocationLocked", "autoRecomputeOnSubmit", "year", "isCurrent"];
    for (const k of allowed) {
      if (req.body[k] !== undefined) doc[k] = req.body[k];
    }
    if (req.body.allocationLocked === true) doc.allocationLockedAt = new Date();
    if (req.body.allocationLocked === false) doc.allocationLockedAt = null;
    await doc.save();
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("examSettings.update:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
