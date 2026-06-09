const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Menu = require("../models/menu");
const SubMenu = require("../models/subMenu");

const MENU_GROUPS_BY_PATH = {
  "/about-us": "Website & Content",
  "/syllabus": "Website & Content",
  "/old-question-papers": "Website & Content",
  "/floating-menu-settings": "Website & Content",
  "landing": "Website & Content",
  "/exam-registration": "Student & Exam",
  "/mark-entry": "Student & Exam",
  "/hall-ticket": "Student & Exam",
  "/certificate-management": "Student & Exam",
  "/exam-type": "Student & Exam",
  "/exam-score": "Student & Exam",
  "/result-publish": "Student & Exam",
  "/center-registration": "District & Centres",
  "/exam-center-registration": "District & Centres",
  "/district": "District & Centres",
  "/area": "District & Centres",
  "/district-admin": "District & Centres",
  "/franchise": "District & Centres",
  "/master-data": "Administration",
  "/settings": "Settings",
  "/data-reset": "Settings",
};

const SUBMENU_GROUPS_BY_PATH = {
  "/exam-registration": "Registration",
  "/outside-center-list": "Registration",
  "/attendance": "Attendance & Reports",
  "/rank-list": "Attendance & Reports",
  "/question-packing": "Exam Processing",
  "/exam-allocation": "Exam Processing",
  "/exam-settings": "Configuration",
  menu: "Access Control",
};

const updateGroups = async (Model, groupsByPath, entityName) => {
  let matchedCount = 0;
  let modifiedCount = 0;

  for (const [pathKey, groupTitle] of Object.entries(groupsByPath)) {
    const result = await Model.updateMany({ path: pathKey, menuGroup: { $ne: groupTitle } }, { $set: { menuGroup: groupTitle } });
    matchedCount += result.matchedCount ?? 0;
    modifiedCount += result.modifiedCount ?? 0;
  }

  console.log(`${entityName}: matched ${matchedCount}, updated ${modifiedCount}`);
};

const printCoverage = async (Model, entityName) => {
  const groupedItems = await Model.find({ menuGroup: { $exists: true, $nin: ["", null] } }, "label path menuGroup").sort({ menuGroup: 1, sequence: 1 }).lean();
  const uncategorizedCount = await Model.countDocuments({
    $or: [{ menuGroup: { $exists: false } }, { menuGroup: "" }, { menuGroup: null }],
  });

  console.log(`${entityName} coverage:`);
  groupedItems.forEach((item) => {
    console.log(`- ${item.menuGroup}: ${item.label} (${item.path})`);
  });
  console.log(`${entityName} uncategorized: ${uncategorizedCount}`);
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  try {
    await updateGroups(Menu, MENU_GROUPS_BY_PATH, "menu");
    await updateGroups(SubMenu, SUBMENU_GROUPS_BY_PATH, "submenu");
    await printCoverage(Menu, "Menu");
    await printCoverage(SubMenu, "Submenu");
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});