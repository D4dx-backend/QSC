const mongoose = require("mongoose");

const ExamResponseSchema = new mongoose.Schema(
  {
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamAttempt",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionPool",
      required: true,
    },
    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D", null],
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    timeTaken: {
      type: Number,
      default: 0,
    }, // seconds spent on this question
    score: {
      type: Number,
      default: 0,
    }, // marks awarded for this response
  },
  { timestamps: true }
);

ExamResponseSchema.index({ attempt: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("ExamResponse", ExamResponseSchema);
