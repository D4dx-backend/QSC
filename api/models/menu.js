const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    isLink: {
      type: Boolean,
      required: true,
      default: false,
    },
    path: {
      type: String,
      required: true,
    },
    hideMenu: {
      type: Boolean,
      required: true,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      required: true,
      default: false,
    },
    showInMenu: {
      type: Boolean,
      required: true,
      default: true,
    },
    element: {
      type: String,
      required: true,
    },
    itemOpenInSlug: {
      type: Boolean,
      required: false,
      default: false,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    menuGroup: {
      type: String,
      required: true,
      default: "",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
