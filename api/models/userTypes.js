const mongoose = require("mongoose");

const UserTypeSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      unique: true,
      // enum: ["customer", "vendor", "admin"],
    },
    roleDisplayName: {
      type: String,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    idleMinutes: {
      type: Number,
      default: 30,
    },
    loginTokenDuration: {
      type: String,
      default: "1d",
    },
    refreshTokenDuration: {
      type: String,
      default: "30d",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("UserType", UserTypeSchema);
