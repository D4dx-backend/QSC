const mongoose = require("mongoose");

const QuestionPoolSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    optionA: {
      type: String,
      required: true,
      trim: true,
    },
    optionB: {
      type: String,
      required: true,
      trim: true,
    },
    optionC: {
      type: String,
      required: true,
      trim: true,
    },
    optionD: {
      type: String,
      required: true,
      trim: true,
    },
    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
    score: {
      type: Number,
      default: 1,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    sequence: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

QuestionPoolSchema.index({ exam: 1, sequence: 1 });

module.exports = mongoose.model("QuestionPool", QuestionPoolSchema);
