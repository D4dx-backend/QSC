const mongoose = require("mongoose");

const HallTicketSchema = new mongoose.Schema(
  {
    nameOfApplicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamRegistration",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HallTicket", HallTicketSchema);
