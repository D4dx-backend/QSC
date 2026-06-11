const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const mongoose = require("mongoose");
const FloatingMenuSettings = require("../models/floatingMenuSettings");

const NEW_TITLE = "QSC പരീക്ഷാ ഫീസ് അടക്കാനുള്ള QR കോഡ്";

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const result = await FloatingMenuSettings.updateMany(
    { "copy.heroStoryTitle": { $ne: NEW_TITLE } },
    { $set: { "copy.heroStoryTitle": NEW_TITLE } }
  );

  console.log(JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, null, 2));

  await mongoose.disconnect();
  process.exit(0);
})();
