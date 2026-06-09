const mongoose = require("mongoose");

const OldQuestionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    attachment: {
      type: String,
    },
    year: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("oldQuestionPaper", OldQuestionPaperSchema);
