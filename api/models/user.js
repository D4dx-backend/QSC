const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      match: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, "Please add a valid email"],
      required: true,
    },
    mobile: {
      type: String,
      // required: true,
    },
    
    district: {
      type: String,
      // required: true,
    },
    uid: {
      type: String,
      // required: true,
    },
    registrationType: {
      type: Number,
      default: 0,
    },
    pushNotificationToken: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    image: {
      type: String,
    },
    franchise: {
      type: mongoose.Schema.ObjectId,
      ref: "Franchise",
      // required: true,
    },
    userType: {
      type: mongoose.Schema.ObjectId,
      ref: "UserType",
      // required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    districts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    deletedDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    pin: {
      type: String,
      select: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt

UserSchema.path("email").validate(async function (value) {
  // Check if the email already exists in the database
  const user = await mongoose.model("User").findOne({ email: value });
  return !user;
}, "Email already exists");

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("pin") && this.pin) {
    this.pin = await bcrypt.hash(this.pin, salt);
  }
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (idleMinutes, loginTokenDuration) {
  return jwt.sign({ id: this._id, idleMinutes, loginTokenDuration }, process.env.JWT_SECRET, {
    expiresIn: loginTokenDuration,
  });
};
UserSchema.methods.getRefreshToken = function (refreshTokenDuration) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: refreshTokenDuration,
  });
};
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match 4-digit PIN
UserSchema.methods.matchPin = async function (enteredPin) {
  if (!this.pin) return false;
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model("User", UserSchema);
