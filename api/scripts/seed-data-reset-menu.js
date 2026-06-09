// Seed the Data Reset menu entry + role mapping for every Admin user type.
// Idempotent — re-running is safe. Skip -Drop target DB? No; we only upsert.
//
// Usage:
//   cd qsc-automation-api
//   node scripts/seed-data-reset-menu.js
//
// Env: expects MONGO_URI in config/.env (same as the API).

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");

const Menu = require("../models/menu");
const MenuRole = require("../models/menuRole");
const UserType = require("../models/userTypes");

const MENU_DEF = {
  label: "Data Reset",
  sequence: 999, // shoved to the bottom; tweak manually from the Menu admin if desired
  icon: "settings",
  status: true,
  isLink: false,
  path: "/data-reset",
  element: "data-reset",
  hideMenu: false,
  hideHeader: false,
  showInMenu: true,
  menuGroup: "Settings",
};

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo.");

  // 1. Upsert the menu.
  let menu = await Menu.findOne({ element: MENU_DEF.element });
  if (menu) {
    console.log(`Menu already exists: ${menu._id} (${menu.label})`);
  } else {
    menu = await Menu.create(MENU_DEF);
    console.log(`Menu created: ${menu._id} (${menu.label})`);
  }

  // 2. Find all user types that look like admin roles.
  const admins = await UserType.find({ role: { $regex: /admin/i } });
  if (!admins.length) {
    console.warn("No admin-like user types found. Menu is created but no role grants were made.");
  }

  // 3. Grant each admin full privileges (idempotent upsert).
  for (const ut of admins) {
    const existing = await MenuRole.findOne({ menu: menu._id, userType: ut._id });
    if (existing) {
      console.log(`  • ${ut.role}: role grant already present (${existing._id})`);
      continue;
    }
    const granted = await MenuRole.create({
      menu: menu._id,
      userType: ut._id,
      status: true,
      add: true,
      update: true,
      delete: true,
      export: true,
    });
    console.log(`  • ${ut.role}: granted (${granted._id})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
})().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
