const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const mongoose = require("mongoose");
const Menu = require("../models/menu");
const SubMenu = require("../models/subMenu");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const landingMenu = await Menu.findOneAndUpdate(
    { element: "floating-menu-settings" },
    {
      $set: {
        label: "Landing Page Settings",
        status: true,
        hideMenu: false,
        showInMenu: true,
      },
    },
    { new: true }
  );

  const aboutMenuResult = await Menu.updateMany(
    { element: "about-us" },
    {
      $set: {
        status: false,
        hideMenu: true,
        showInMenu: false,
      },
    }
  );

  const aboutSubmenuResult = await SubMenu.updateMany(
    { element: "about-us" },
    {
      $set: {
        status: false,
      },
    }
  );

  console.log(
    JSON.stringify(
      {
        landingMenu: landingMenu
          ? {
              label: landingMenu.label,
              element: landingMenu.element,
              path: landingMenu.path,
              showInMenu: landingMenu.showInMenu,
              hideMenu: landingMenu.hideMenu,
            }
          : null,
        aboutMenusUpdated: aboutMenuResult.modifiedCount,
        aboutSubmenusUpdated: aboutSubmenuResult.modifiedCount,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
})().catch(async (error) => {
  console.error("Landing menu migration failed:", error);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});