// One-off: reset qscmpmeast password to `mpme` using raw mongo + bcrypt.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config", ".env") });
if (!process.env.MONGO_URI) require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { MongoClient } = require("mongoose/node_modules/mongodb");
const bcrypt = require("bcryptjs");

(async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const users = client.db().collection("users");
  const target = await users.findOne({ email: /qscmpmeast/i });
  console.log("found:", target && { _id: target._id, email: target.email, blocked: target.blocked, districts: target.districts });
  if (target) {
    const hash = await bcrypt.hash("mpme", 10);
    await users.updateOne({ _id: target._id }, { $set: { password: hash, blocked: false } });
    const fresh = await users.findOne({ _id: target._id });
    const ok = await bcrypt.compare("mpme", fresh.password);
    console.log("match after reset:", ok, "blocked:", fresh.blocked);
  }
  const w = await users.findOne({ email: /qscmpmwest/i });
  console.log("west admin:", w && { email: w.email, districts: w.districts, blocked: w.blocked });
  await client.close();
})();
