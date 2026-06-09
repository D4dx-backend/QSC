const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subMenuType: {
      type: String,
      enum: ["itemmenu", "sub-menu", "information-page", "label", "custom-page"],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      set: removeEmptyStringItems,
    },
    element: {
      type: String,
    },
    path: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
function removeEmptyStringItems(val) {
  if (val === "") {
    return null; // Returning undefined means validation passes, and the value will not be saved
  }
  return val;
}
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
