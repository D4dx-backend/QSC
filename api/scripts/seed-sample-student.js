// Seed a sample Student user for testing the student portal.
//
// Creates a User document with:
//   email:    student@qsc.test
//   password: Student@123
//   role:     Student
//
// Idempotent — skips if user already exists.
//
// Usage:
//   cd qsc-automation-api
//   node scripts/seed-sample-student.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const User = require("../models/user");
const UserType = require("../models/userTypes");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo.\n");

  // Find Student UserType
  const studentType = await UserType.findOne({ role: "Student" });
  if (!studentType) {
    console.error("Student UserType not found. Run seed-student-and-fix-menu-roles.js first.");
    process.exit(1);
  }

  // Check if sample student already exists
  const existing = await User.findOne({ email: "student@qsc.test" }).lean();
  if (existing) {
    console.log("Sample student already exists:");
    console.log(`  ID:    ${existing._id}`);
    console.log(`  Email: ${existing.email}`);
    console.log(`  Name:  ${existing.name}`);
    console.log("\nLogin with: mobile 9876543210 / PIN 3210");

    // Ensure PIN is set (in case this user was created before PIN support)
    const u = await User.findById(existing._id).select("+pin");
    if (!u.pin) {
      u.pin = "3210"; // last 4 digits of 9876543210
      await u.save({ validateModifiedOnly: true });
      console.log("  → PIN was missing, now set to 3210");
    }

    await mongoose.disconnect();
    return;
  }

  // Create user — password & pin are hashed automatically by the User model pre-save hook
  const user = new User({
    name: "Test Student",
    email: "student@qsc.test",
    mobile: "9876543210",
    password: "Student@123",
    pin: "3210", // last 4 digits of mobile
    userType: studentType._id,
    registrationType: 0,
  });

  // Bypass the unique email validator issue with save
  await user.save();

  console.log("Sample Student user created:");
  console.log(`  ID:       ${user._id}`);
  console.log(`  Mobile:   9876543210`);
  console.log(`  PIN:      3210 (last 4 digits of mobile)`);
  console.log(`  Email:    student@qsc.test`);
  console.log(`  Password: Student@123`);
  console.log(`  Name:     Test Student`);
  console.log(`  UserType: Student (${studentType._id})`);

  await mongoose.disconnect();
  console.log("\nDone.");
})().catch(async (err) => {
  console.error("Seed failed:", err.message || err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
