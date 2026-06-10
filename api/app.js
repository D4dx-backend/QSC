const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const session = require("express-session");

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

// Trust the DigitalOcean App Platform / load balancer proxy so that
// secure cookies and req.protocol work correctly behind HTTPS termination.
app.set("trust proxy", 1);

app.use(
  session({
    secret: "This_is_my_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Default allowed origins (fallback when ALLOWED_ORIGINS env var is not set)
const defaultAllowedOrigins = [
  "https://qsc-cms-w9eob.ondigitalocean.app",
  "https://qsc-cms-new-wbgek.ondigitalocean.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:8072",
  "https://sio-kerala-deconquista-qywe3.ondigitalocean.app",
  "https://lemon-grass-0c88ad110.3.azurestaticapps.net",
  "https://lively-wave-04701e810.3.azurestaticapps.net",
  "https://sio-kerala-admin-6gv6l.ondigitalocean.app",
  "https://accounts.google.com",
  "https://oauth.googleusercontent.com",
  "https://deconquista.siokerala.org",
  "https://eventhex-cms-a53a3.ondigitalocean.app",
  "https://event-manager.syd1.cdn.digitaloceanspaces.com",
  "https://d10hztoo0gcg1m.cloudfront.net",
  "https://admin.eventhex.co",
  "http://192.168.1.5:3000",
  "https://eventhex.datahex.co",
  "http://192.168.1.11:3000",
  "http://admin.local:3000",
  "http://event.local:3000",
  "http://media.local:3000",
  "http://edunext.mediaoneonline.com",
  "https://qsc-api-462u2.ondigitalocean.app",
  "https://quranstudycentre.com",
  "https://qsc-reg.netlify.app",
];

// Read additional/override origins from env (comma-separated), e.g.
// ALLOWED_ORIGINS=https://qsc-reg.netlify.app,https://example.com
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Merge env-provided origins with defaults, removing duplicates
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

//cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Connect to database
connectDB();

app.use("/images", express.static("./public/user"));
app.use("/images", express.static("./public/proteincategory"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// route files
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const userType = require("./routes/userType.js");
const menu = require("./routes/menu.js");
const subMenu = require("./routes/subMenu.js");
const menuRole = require("./routes/menuRole.js");
const subMenuRole = require("./routes/subMenuRole.js");
const appointment = require("./routes/appointment.js");
const franchise = require("./routes/franchise.js");
const dashboard = require("./routes/dashboard.js");
const errorLog = require("./routes/errorLog.js");
const examRegistration = require("./routes/examRegistration.js");
const hallTicket = require("./routes/hallTicket.js");
const oldQuestionPaper = require("./routes/oldQuestionPaper.js");
const examType = require("./routes/examType.js");
const district = require("./routes/district.js");
const area = require("./routes/area.js");
const resultAndCertificates = require("./routes/resultAndCertificates.js");
const examCenterRegistration = require("./routes/examCenterRegistration.js");
const aboutUs = require("./routes/aboutUs.js");
const centerRegistration = require("./routes/centerRegistration.js");
const floatingMenuSettings = require("./routes/floatingMenuSettings.js");
const examScore = require("./routes/examScore.js");
const syllabus = require("./routes/syllabus.js");
const certificateManagement = require("./routes/certificateManagement.js");
const examAllocation = require("./routes/examAllocation.js");
const examSettings = require("./routes/examSettings.js");
const dataReset = require("./routes/dataReset.js");
const onlineExam = require("./routes/onlineExam.js");
const questionPool = require("./routes/questionPool.js");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// health check endpoints (used by DigitalOcean App Platform health checks)
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "qsc-api" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/user-type", userType);
app.use("/api/v1/menu", menu);
app.use("/api/v1/sub-menu", subMenu);
app.use("/api/v1/menu-role", menuRole);
app.use("/api/v1/submenu-role", subMenuRole);
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/franchise", franchise);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/error-log", errorLog);
app.use("/api/v1/exam-registration", examRegistration);
app.use("/api/v1/hall-ticket", hallTicket);
app.use("/api/v1/old-question-papers", oldQuestionPaper);
app.use("/api/v1/exam-type", examType);
app.use("/api/v1/district", district);
app.use("/api/v1/area", area);
app.use("/api/v1/result-certificates", resultAndCertificates);
app.use("/api/v1/exam-center-registration", examCenterRegistration);
app.use("/api/v1/about-us", aboutUs);
app.use("/api/v1/center-registration", centerRegistration);
app.use("/api/v1/floating-menu-settings", floatingMenuSettings);
app.use("/api/v1/exam-score", examScore);
app.use("/api/v1/syllabus", syllabus);
app.use("/api/v1/certificate-management", certificateManagement);
app.use("/api/v1/exam-allocation", examAllocation);
app.use("/api/v1/exam-settings", examSettings);
app.use("/api/v1/data-reset", dataReset);
app.use("/api/v1/online-exam", onlineExam);
app.use("/api/v1/question-pool", questionPool);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
