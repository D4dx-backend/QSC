const mongoose = require("mongoose");

const OnlineExamSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    examType: {
      type: String,
      enum: ["Trial", "Main"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    }, // minutes
    marksPerQuestion: {
      type: Number,
      default: 1,
      min: 0,
    },
    negativeMarking: {
      type: Number,
      default: 0,
      min: 0,
    },
    passingPercentage: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
    examDate: {
      type: Date,
    },
    examEndDate: {
      type: Date,
    },
    resultVisibility: {
      type: String,
      enum: ["detailed", "score_only", "pass_fail"],
      default: "score_only",
    },
    publishResult: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    practiceQuestionCount: {
      type: Number,
      default: 10,
      min: 1,
    },
    shuffleQuestions: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineExam", OnlineExamSchema);
