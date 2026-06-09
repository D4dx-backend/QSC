// Seed "Student" UserType and fix Online Exam menu role assignments.
//
// What this does:
//   1. Creates a "Student" UserType if it doesn't already exist
//   2. Ensures admin-only menus (Online Exam, Question Pool, Exam Results)
//      are granted ONLY to admin roles (not students)
//   3. Ensures student-only menus (Take Exam, Practice Exam, Exam History)
//      are granted ONLY to the Student role (not admin roles)
//   4. Updates menu icons to valid project icon names
//
// Idempotent — safe to re-run.
//
// Usage:
//   cd qsc-automation-api
//   node scripts/seed-student-and-fix-menu-roles.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Menu = require("../models/menu");
const MenuRole = require("../models/menuRole");
const UserType = require("../models/userTypes");

// Element names that correspond to admin-only pages
const ADMIN_ELEMENTS = ["online-exam", "question-pool", "online-exam-results"];

// Element names that correspond to student-only pages
const STUDENT_ELEMENTS = ["take-exam", "practice-exam", "exam-history"];

// Correct icon mapping
const ICON_MAP = {
  "online-exam": "exam-type",
  "question-pool": "question-packing",
  "online-exam-results": "mark-entry",
  "take-exam": "open-book",
  "practice-exam": "syllabus",
  "exam-history": "attendance",
};

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo.\n");

  // --- 1. Create Student UserType ---
  let studentType = await UserType.findOne({ role: "Student" });
  if (studentType) {
    console.log(`Student UserType already exists (${studentType._id})`);
  } else {
    studentType = await UserType.create({
      role: "Student",
      roleDisplayName: "Student",
      idleMinutes: 60,
      loginTokenDuration: "1d",
      refreshTokenDuration: "30d",
    });
    console.log(`Student UserType created (${studentType._id})`);
  }

  // --- 2. Collect admin roles and student role ---
  const allRoles = await UserType.find({});
  const adminRoles = allRoles.filter((r) => /admin/i.test(r.role));
  const studentRole = allRoles.find((r) => r.role === "Student");

  console.log(`\nAdmin roles: ${adminRoles.map((r) => r.role).join(", ") || "(none)"}`);
  console.log(`Student role: ${studentRole?.role || "(not found)"}\n`);

  // --- 3. Fix admin menus ---
  console.log("--- Admin menus (admin roles only) ---");
  for (const element of ADMIN_ELEMENTS) {
    const menu = await Menu.findOne({ element });
    if (!menu) {
      console.log(`  ⚠ Menu not found: ${element} (run seed-online-exam-menu.js first)`);
      continue;
    }

    // Fix icon
    if (ICON_MAP[element] && menu.icon !== ICON_MAP[element]) {
      await Menu.updateOne({ _id: menu._id }, { $set: { icon: ICON_MAP[element] } });
      console.log(`  Icon updated: ${element} → ${ICON_MAP[element]}`);
    }

    // Remove any non-admin role assignments
    const removed = await MenuRole.deleteMany({
      menu: menu._id,
      userType: { $nin: adminRoles.map((r) => r._id) },
    });
    if (removed.deletedCount > 0) {
      console.log(`  Removed ${removed.deletedCount} non-admin role(s) from ${menu.label}`);
    }

    // Ensure admin roles are granted
    for (const role of adminRoles) {
      const exists = await MenuRole.findOne({ menu: menu._id, userType: role._id });
      if (!exists) {
        await MenuRole.create({
          menu: menu._id,
          userType: role._id,
          status: true,
          add: true,
          update: true,
          delete: true,
          export: true,
        });
        console.log(`  Granted ${role.role} → ${menu.label}`);
      } else {
        console.log(`  ${role.role} → ${menu.label} (already granted)`);
      }
    }
  }

  // --- 4. Fix student menus ---
  console.log("\n--- Student menus (Student role only) ---");
  for (const element of STUDENT_ELEMENTS) {
    const menu = await Menu.findOne({ element });
    if (!menu) {
      console.log(`  ⚠ Menu not found: ${element} (run seed-online-exam-menu.js first)`);
      continue;
    }

    // Fix icon
    if (ICON_MAP[element] && menu.icon !== ICON_MAP[element]) {
      await Menu.updateOne({ _id: menu._id }, { $set: { icon: ICON_MAP[element] } });
      console.log(`  Icon updated: ${element} → ${ICON_MAP[element]}`);
    }

    // Remove any non-student role assignments
    const removed = await MenuRole.deleteMany({
      menu: menu._id,
      userType: { $ne: studentRole._id },
    });
    if (removed.deletedCount > 0) {
      console.log(`  Removed ${removed.deletedCount} non-student role(s) from ${menu.label}`);
    }

    // Ensure student role is granted (read-only — no add/update/delete)
    const exists = await MenuRole.findOne({ menu: menu._id, userType: studentRole._id });
    if (!exists) {
      await MenuRole.create({
        menu: menu._id,
        userType: studentRole._id,
        status: true,
        add: false,
        update: false,
        delete: false,
        export: false,
      });
      console.log(`  Granted Student → ${menu.label} (read-only)`);
    } else {
      console.log(`  Student → ${menu.label} (already granted)`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
})().catch(async (err) => {
  console.error("Seed failed:", err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
