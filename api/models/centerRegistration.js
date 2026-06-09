const mongoose = require("mongoose");

const CenterRegistrationSchema = new mongoose.Schema(
  {
    nameOfCenter: {
      type: String,
    },
    centerType: {
      type: String,
      enum: ["Male", "Female", "Mixed"],
    },
    studentsCountMale: {
      type: String,
      default: "0",
    },
    studentsCountFemale: {
      type: String,
      default: "0",
    },
    studentsCountTotal: {
      type: String,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    halqaName: {
      type: String,
    },
    AreaQscCoOrdinatorName: {
      type: String,
    },
    mobNumberOfAreaQscCoOrdinator: {
      type: String,
    },
    affiliationNo: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    slNo: {
      type: String,
    },
    centerCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
      // sparse unique — many legacy docs have no code yet
    },
  },

  { timestamps: true }
);

// Pre-save hook to calculate studentsCountTotal
CenterRegistrationSchema.pre("save", function (next) {
  const studentsCountMale = parseInt(this.studentsCountMale) || 0;
  const studentsCountFemale = parseInt(this.studentsCountFemale) || 0;
  this.studentsCountTotal = (studentsCountMale + studentsCountFemale).toString();
  next();
});

// Auto-assign a centerCode on creation when not provided.
// Scheme: <DIST-PREFIX><3-digit seq within district>. Must stay in sync with
// scripts/backfill-center-codes.js.
const DISTRICT_PREFIXES = {
  "THIRUVANANTHAPURAM": "TVM",
  "KOLLAM": "KLM",
  "PATHANAMTHITTA": "PTA",
  "ALAPPUZHA": "ALP",
  "KOTTAYAM": "KTM",
  "IDUKKI": "IDK",
  "ERNAKULAM": "EKM",
  "THRISSUR": "TSR",
  "PALAKKAD": "PKD",
  "MALAPPURAM EAST": "MPE",
  "MALAPPURAM WEST": "MPW",
  "KOZHIKODE": "KKD",
  "WAYANAD": "WYD",
  "KANNUR": "KNR",
  "KASARAGOD": "KSD",
  "LAKSHADWEEP": "LSD",
  "MAHE": "MHE",
};

CenterRegistrationSchema.pre("save", async function (next) {
  if (this.centerCode || !this.district) return next();
  try {
    const District = mongoose.model("District");
    const dist = await District.findById(this.district).lean();
    const name = dist?.district?.trim().toUpperCase() || "";
    let prefix = DISTRICT_PREFIXES[name];
    if (!prefix) {
      const alpha = name.replace(/[^A-Z]/g, "");
      prefix = (alpha.slice(0, 3) || "XXX").padEnd(3, "X");
    }
    const Model = mongoose.model("CenterRegistration");
    const taken = await Model.find({ centerCode: new RegExp(`^${prefix}\\d{3}$`) })
      .select("centerCode")
      .lean();
    let max = 0;
    for (const c of taken) {
      const n = parseInt(String(c.centerCode).slice(prefix.length), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    this.centerCode = `${prefix}${String(max + 1).padStart(3, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("CenterRegistration", CenterRegistrationSchema);
