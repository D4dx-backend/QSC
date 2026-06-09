const mongoose = require("mongoose");

const heroStatSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "",
      trim: true,
    },
    value: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const snapshotCardSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "",
      trim: true,
    },
    value: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const defaultHeroStats = () => [
  { label: "Districts", value: "18" },
  { label: "Areas", value: "181" },
  { label: "Study Centres", value: "785" },
  { label: "Students", value: "15,979" },
];

const defaultSnapshotCards = () => [
  {
    label: "District coverage",
    value: "18",
    description: "Total districts currently managed under the state-level network.",
  },
  {
    label: "Operational areas",
    value: "181",
    description: "Configured area structure across the state.",
  },
  {
    label: "Study centres",
    value: "785",
    description: "Approved centres presently reflected in the system.",
  },
  {
    label: "Students reached",
    value: "15,979",
    description: "Current public-facing total for connected students.",
  },
];

const FloatingSettingsSchema = new mongoose.Schema(
  {
    centerRegistration: {
      type: Boolean,
      default: false,
    },
    hallTicket: {
      type: Boolean,
      default: false,
    },
    examRegistration: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Boolean,
      default: true,
    },
    about: {
      type: Boolean,
      default: false,
    },
    result: {
      type: Boolean,
      default: false,
    },
    examInstruction: {
      type: Boolean,
      default: false,
    },
    showPublicSnapshot: {
      type: Boolean,
      default: true,
    },
    copy: {
      heroEyebrow: {
        type: String,
        default: "QSC Kerala public portal",
        trim: true,
      },
      heroStoryBadge: {
        type: String,
        default: "Simple by design",
        trim: true,
      },
      heroStoryTitle: {
        type: String,
        default: "Students use the public side. Admins keep it current.",
        trim: true,
      },
      heroStoryDescription: {
        type: String,
        default:
          "The public page stays clean while all public-facing numbers and messaging remain editable from the admin side.",
        trim: true,
      },
      quickAccessKicker: {
        type: String,
        default: "Quick access",
        trim: true,
      },
      quickAccessTitle: {
        type: String,
        default: "Public actions without clutter",
        trim: true,
      },
      quickAccessDescription: {
        type: String,
        default:
          "Only the important public entry points stay visible. Admins can turn each action on or off from Landing Page Settings.",
        trim: true,
      },
      snapshotKicker: {
        type: String,
        default: "State snapshot",
        trim: true,
      },
      snapshotTitle: {
        type: String,
        default: "Editable public snapshot",
        trim: true,
      },
      snapshotDescription: {
        type: String,
        default:
          "Only admin-approved state-level totals appear here. No district-wise breakdown is exposed on the public page.",
        trim: true,
      },
      adminNote: {
        type: String,
        default:
          "Landing headline and footer copy come from About Us. Quick actions and public snapshot values come from Landing Page Settings.",
        trim: true,
      },
      copyrightText: {
        type: String,
        default:
          "Copyright {year} Quran Study Centre Kerala. All rights reserved.",
        trim: true,
      },
      poweredByText: {
        type: String,
        default: "D4DX.co",
        trim: true,
      },
      poweredByUrl: {
        type: String,
        default: "https://d4dx.co/",
        trim: true,
      },
      footerLinksLabel: {
        type: String,
        default: "Public links",
        trim: true,
      },
      footerContactLabel: {
        type: String,
        default: "Contact",
        trim: true,
      },
    },
    heroStats: {
      type: [heroStatSchema],
      default: defaultHeroStats,
    },
    snapshotCards: {
      type: [snapshotCardSchema],
      default: defaultSnapshotCards,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FloatingSettings", FloatingSettingsSchema);
