require("dotenv").config({ path: "config/.env" });
const m = require("mongoose");

(async () => {
  await m.connect(process.env.MONGO_URI);
  const db = m.connection.db;

  // --- Year-wise breakdown ---
  const pipe = [
    {
      $project: {
        y: { $year: "$createdAt" },
        status: 1,
        centerRegistration: 1,
        assignedExamCenter: 1,
        regno: 1,
      },
    },
    {
      $group: {
        _id: "$y",
        total: { $sum: 1 },
        withCenter: { $sum: { $cond: [{ $ne: ["$centerRegistration", null] }, 1, 0] } },
        withAssigned: { $sum: { $cond: [{ $ne: ["$assignedExamCenter", null] }, 1, 0] } },
        withRegno: {
          $sum: {
            $cond: [
              { $and: [{ $ne: ["$regno", null] }, { $ne: ["$regno", ""] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ];
  const yearBreak = await db.collection("examregistrations").aggregate(pipe).toArray();
  console.log("=== Exam regs by year ===");
  for (const o of yearBreak) {
    console.log(
      `  ${o._id}: total=${o.total} withCenter=${o.withCenter} withAssigned=${o.withAssigned} withRegno=${o.withRegno}`
    );
  }

  // --- Recent 2026 regs ---
  console.log("\n=== Recent registrations (created after 2026-01-01) ===");
  const r2026 = await db
    .collection("examregistrations")
    .find({ createdAt: { $gte: new Date("2026-01-01") } })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();
  for (const r of r2026) {
    console.log(
      `  regno=${r.regno || "(none)"} status=${r.status} hasCenter=${!!r.centerRegistration} hasAssigned=${!!r.assignedExamCenter} clubbed=${!!r.assignedByClubbing}`
    );
  }

  // --- Regno format check ---
  console.log("\n=== Regno format sample ===");
  const regnoSample = await db
    .collection("examregistrations")
    .find({ regno: { $regex: /^26/ } })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
  for (const r of regnoSample) console.log(`  ${r.regno}`);

  // --- Counter docs ---
  const counters = await db.collection("counters").find({}).toArray();
  console.log(`\n=== Counter docs (${counters.length}) ===`);
  for (const c of counters.slice(0, 10)) console.log(`  ${c._id}: ${c.seq}`);

  // --- CenterCode uniqueness ---
  console.log("\n=== CenterCode uniqueness ===");
  const dupCodes = await db
    .collection("centerregistrations")
    .aggregate([
      { $match: { centerCode: { $exists: true, $ne: null, $ne: "" } } },
      { $group: { _id: "$centerCode", c: { $sum: 1 } } },
      { $match: { c: { $gt: 1 } } },
    ])
    .toArray();
  console.log(`  Duplicates: ${dupCodes.length}`);

  // --- ExamSettings ---
  const settings = await db.collection("examsettings").findOne({});
  console.log("\n=== ExamSettings ===");
  console.log(" ", JSON.stringify(settings));

  // --- Malappuram split check ---
  console.log("\n=== Malappuram centres ===");
  const dists = await db
    .collection("districts")
    .find({ district: { $regex: /MALAPPURAM/i } })
    .toArray();
  for (const d of dists) {
    const cnt = await db.collection("centerregistrations").countDocuments({ district: d._id });
    const exam = await db.collection("examregistrations").countDocuments({ district: d._id });
    console.log(`  ${d.district} (${d._id}): ${cnt} centres, ${exam} exam regs`);
  }

  // --- District-scoped admin users audit ---
  console.log("\n=== District admin users ===");
  const userSample = await db
    .collection("users")
    .find({ districts: { $exists: true, $ne: null, $not: { $size: 0 } } })
    .limit(5)
    .toArray();
  for (const u of userSample) {
    console.log(
      `  ${u.email || u.userName || u._id}: districts=${JSON.stringify(u.districts)}`
    );
  }

  await m.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
