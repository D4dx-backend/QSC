// Phase 3 — Admin-only bulk reset of user-input collections.
// Deliberately excludes master data (districts, areas, exam types, menus,
// users, syllabus, about-us, floating menu settings, exam settings) so that
// coordinators can wipe a previous year's operational data without touching
// the structural setup.
//
// Contract:
//   GET  /api/v1/data-reset/stats            → counts per dataset
//   POST /api/v1/data-reset                  body: { datasets: [...], confirmation: "RESET" }
//
// Every reset is logged to the server console with the acting admin's id
// so the destructive action is traceable.

const ExamRegistration = require("../models/examRegistration");
const ExamScore = require("../models/examScore");
const HallTicket = require("../models/hallTicket");
const CenterRegistration = require("../models/centerRegistration");
const ExamCenterRegistration = require("../models/examCenterRegistration");
const CertificateManagement = require("../models/certificateManagement");
const Franchise = require("../models/franchise");
const Appointment = require("../models/appointment");
const OldQuestionPapers = require("../models/oldQuestionPapers");
const ErrorLog = require("../models/errorLog");
const ResultAndCertificates = require("../models/resultAndCertificates");
const Counter = require("../models/counter");

// key → { label, description, model }. The key is what the UI sends back.
// `isDestructive` is informational; every entry in this map is destructive.
const DATASETS = {
  examRegistration: {
    label: "Exam Registrations",
    description: "All student exam registrations (includes assigned centres, reg numbers).",
    model: ExamRegistration,
  },
  examScore: {
    label: "Exam Scores / Marks",
    description: "All mark entries for every student.",
    model: ExamScore,
  },
  hallTicket: {
    label: "Hall Tickets",
    description: "Generated hall ticket records.",
    model: HallTicket,
  },
  centerRegistration: {
    label: "Study Centre Registrations",
    description: "Centres submitted by coordinators (not the district/area master).",
    model: CenterRegistration,
  },
  examCenterRegistration: {
    label: "Exam Centres",
    description: "Registered exam centres.",
    model: ExamCenterRegistration,
  },
  certificateManagement: {
    label: "Certificate Templates",
    description: "Uploaded certificate template files (hall ticket, state/district, affiliation).",
    model: CertificateManagement,
  },
  franchise: {
    label: "Franchises",
    description: "Franchise records.",
    model: Franchise,
  },
  appointment: {
    label: "Appointments",
    description: "Appointment entries.",
    model: Appointment,
  },
  oldQuestionPapers: {
    label: "Old Question Papers",
    description: "Uploaded question paper archive.",
    model: OldQuestionPapers,
  },
  errorLog: {
    label: "Error Logs",
    description: "Server-side captured error logs.",
    model: ErrorLog,
  },
  resultAndCertificates: {
    label: "Result & Certificate Requests",
    description: "Public result/certificate retrieval logs.",
    model: ResultAndCertificates,
  },
  counter: {
    label: "Sequence Counters",
    description: "Reg number / auto-increment counters. Reset with registrations to start fresh from 0001.",
    model: Counter,
  },
};

// Only allow admin-type users to invoke reset.
function isAdmin(user) {
  const role = user?.userType?.role || "";
  return /admin/i.test(role);
}

// @desc    Counts per resettable dataset (for the UI to preview impact).
// @route   GET /api/v1/data-reset/stats
exports.getStats = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }
    const stats = {};
    await Promise.all(
      Object.entries(DATASETS).map(async ([key, cfg]) => {
        try {
          stats[key] = {
            label: cfg.label,
            description: cfg.description,
            count: await cfg.model.estimatedDocumentCount(),
          };
        } catch (e) {
          stats[key] = { label: cfg.label, description: cfg.description, count: null, error: e.message };
        }
      })
    );
    return res.status(200).json({ success: true, response: stats });
  } catch (err) {
    console.error("data-reset stats:", err);
    return res.status(500).json({ success: false, message: err.toString() });
  }
};

// @desc    Delete everything in the selected collections.
// @route   POST /api/v1/data-reset
// @body    { datasets: string[], confirmation: "RESET" }
exports.runReset = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }
    const { datasets, confirmation } = req.body || {};
    if (confirmation !== "RESET") {
      return res.status(400).json({
        success: false,
        message: 'Type "RESET" in the confirmation field to proceed.',
      });
    }
    if (!Array.isArray(datasets) || datasets.length === 0) {
      return res.status(400).json({ success: false, message: "Pick at least one dataset to clear." });
    }

    // Reject unknown keys up-front so a client-side typo can't silently no-op.
    const unknown = datasets.filter((k) => !DATASETS[k]);
    if (unknown.length) {
      return res.status(400).json({
        success: false,
        message: `Unknown dataset(s): ${unknown.join(", ")}`,
      });
    }

    const result = {};
    for (const key of datasets) {
      const { model, label } = DATASETS[key];
      const before = await model.estimatedDocumentCount();
      const { deletedCount } = await model.deleteMany({});
      result[key] = { label, before, deleted: deletedCount };
      console.log(
        `[data-reset] user=${req.user?._id} role=${req.user?.userType?.role} cleared ${key}: ${deletedCount}/${before}`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Reset completed.",
      response: result,
    });
  } catch (err) {
    console.error("data-reset run:", err);
    return res.status(500).json({ success: false, message: err.toString() });
  }
};

exports.DATASETS = DATASETS;
