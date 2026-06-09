const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    landingTitle: {
      type: String,
    },
    landingDescription: {
      type: String,
    },
    landingMainbanner: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    footerText: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);
