const mongoose = require("mongoose");

const SyllabusSchema = new mongoose.Schema({
  syllabus: {
    type: String,
  },
  attachment: {
    type: String,
  },
  year: {
    type: String,
  },
});

module.exports = mongoose.model("Syllabus", SyllabusSchema);
