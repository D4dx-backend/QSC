// Seed the Online Exam module menu entries + role mappings.
// Creates 6 menu items:
//   Admin:  Online Exam, Question Pool, Online Exam Results
//   User:   Take Exam, Practice Exam, Exam History
//
// Idempotent — safe to re-run.
//
// Usage:
//   cd qsc-automation-api
//   node scripts/seed-online-exam-menu.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Menu = require("../models/menu");
const MenuRole = require("../models/menuRole");
const UserType = require("../models/userTypes");

const ADMIN_MENUS = [
  {
    label: "Online Exam",
    sequence: 500,
    icon: "file-text",
    path: "/online-exam",
    element: "online-exam",
    menuGroup: "Online Exam",
  },
  {
    label: "Question Pool",
    sequence: 501,
    icon: "list",
    path: "/question-pool",
    element: "question-pool",
    menuGroup: "Online Exam",
  },
  {
    label: "Exam Results",
    sequence: 502,
    icon: "bar-chart",
    path: "/online-exam-results",
    element: "online-exam-results",
    menuGroup: "Online Exam",
  },
];

const USER_MENUS = [
  {
    label: "Take Exam",
    sequence: 510,
    icon: "edit",
    path: "/take-exam",
    element: "take-exam",
    menuGroup: "Online Exam",
  },
  {
    label: "Practice Exam",
    sequence: 511,
    icon: "book",
    path: "/practice-exam",
    element: "practice-exam",
    menuGroup: "Online Exam",
  },
  {
    label: "Exam History",
    sequence: 512,
    icon: "clock",
    path: "/exam-history",
    element: "exam-history",
    menuGroup: "Online Exam",
  },
];

const MENU_DEFAULTS = {
  status: true,
  isLink: false,
  hideMenu: false,
  hideHeader: false,
  showInMenu: true,
};

async function upsertMenu(def) {
  let menu = await Menu.findOne({ element: def.element });
  if (menu) {
    console.log(`  Menu exists: ${menu.label} (${menu._id})`);
  } else {
    menu = await Menu.create({ ...MENU_DEFAULTS, ...def });
    console.log(`  Menu created: ${menu.label} (${menu._id})`);
  }
  return menu;
}

async function grantRole(menu, userType, perms = {}) {
  const existing = await MenuRole.findOne({ menu: menu._id, userType: userType._id });
  if (existing) {
    console.log(`    • ${userType.role}: already granted`);
    return;
  }
  await MenuRole.create({
    menu: menu._id,
    userType: userType._id,
    status: true,
    add: perms.add ?? true,
    update: perms.update ?? true,
    delete: perms.delete ?? true,
    export: perms.export ?? true,
  });
  console.log(`    • ${userType.role}: granted`);
}

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo.");

  // Find role types
  const adminRoles = await UserType.find({ role: { $regex: /admin/i } });
  const allRoles = await UserType.find({});

  console.log(`\nAdmin roles: ${adminRoles.map((r) => r.role).join(", ")}`);
  console.log(`All roles: ${allRoles.map((r) => r.role).join(", ")}\n`);

  // 1. Admin menus — grant to admin roles
  console.log("--- Admin menus ---");
  for (const def of ADMIN_MENUS) {
    const menu = await upsertMenu(def);
    for (const role of adminRoles) {
      await grantRole(menu, role);
    }
  }

  // 2. User menus — grant to ALL roles (both admins and regular users)
  console.log("\n--- User menus ---");
  for (const def of USER_MENUS) {
    const menu = await upsertMenu(def);
    for (const role of allRoles) {
      await grantRole(menu, role, { add: false, update: false, delete: false, export: false });
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
})().catch(async (err) => {
  console.error("Seed failed:", err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
