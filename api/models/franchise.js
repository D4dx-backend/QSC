const mongoose = require("mongoose");
const { type } = require("os");

const FranchiseSchema = new mongoose.Schema(
  {
    franchiseCode: {
      type: Number,
    },
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    contactName: {
      type: String,
    },
    subscriptionDate: {
      type: Date,
    },
    franchisePackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FranchisePackage",
    },
    primaryColor: {
      type: String,
    },
    secondaryColor: {
      type: String,
    },
    textPrimaryColor: {
      type: String,
    },
    textSecondaryColor: {
      type: String,
    },
    textTertiaryColor: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", FranchiseSchema);
