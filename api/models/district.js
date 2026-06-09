const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema({
  district: {
    type: String,
  },
  code: {
    type: String,
  },
});

module.exports = mongoose.model("District", DistrictSchema);
