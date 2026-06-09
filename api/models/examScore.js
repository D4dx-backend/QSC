const mongoose = require("mongoose");
const { type } = require("os");

const ExamScoreSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamRegistration",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamType",
  },
  score: {
    type: Number,
  },
  grade: {
    // type: String,
    type: String,
  },
});

module.exports = mongoose.model("ExamScore", ExamScoreSchema);
