const mongoose = require("mongoose");
const { type } = require("os");

const ExamCenterRegistrationSchema = new mongoose.Schema(
  {
    centerName: {
      type: String,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamCenterRegistration", ExamCenterRegistrationSchema);
