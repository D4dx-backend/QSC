const mongoose = require("mongoose");
const { type } = require("os");

const AreaSchema = new mongoose.Schema({
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  area: {
    type: String,
  },
});

module.exports = mongoose.model("Area", AreaSchema);
