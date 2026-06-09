const mongoose = require("mongoose");

const SubMenuSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    menu: {
      type: mongoose.Schema.ObjectId,
      ref: "Menu",
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
    element: {
      type: String,
      required: true,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    itemOpenInSlug: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuGroup: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubMenu", SubMenuSchema);
