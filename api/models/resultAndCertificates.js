const mongoose = require("mongoose");
const { type } = require("os");

const ResultAndCertificatesSchema = new mongoose.Schema({
  hallTicket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HallTicket",
  },
  score: {
    type: Number,
  },
  grade: {
    type: String,
  },
});

module.exports = mongoose.model("ResultAndCertificates", ResultAndCertificatesSchema);
