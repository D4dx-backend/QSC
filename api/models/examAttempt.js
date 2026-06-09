const mongoose = require("mongoose");

const ExamAttemptSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnlineExam",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamRegistration",
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    totalTimeTaken: {
      type: Number,
      default: 0,
    }, // seconds
    totalScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalWrong: {
      type: Number,
      default: 0,
    },
    totalSkipped: {
      type: Number,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    attemptType: {
      type: String,
      enum: ["exam", "practice"],
      default: "exam",
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    // Snapshot of question order for this attempt (question _id list)
    questionOrder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionPool",
      },
    ],
  },
  { timestamps: true }
);

ExamAttemptSchema.index({ exam: 1, user: 1 });
ExamAttemptSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("ExamAttempt", ExamAttemptSchema);
