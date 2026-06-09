const Menu = require("../models/menu");
const User = require("../models/user");
const UserType = require("../models/userTypes");
const Franchise = require("../models/franchise");
const ExamRegistration = require("../models/examRegistration");
const AboutUs = require("../models/aboutUsPage");
const FloatingSettings = require("../models/floatingMenuSettings");
const ExamScore = require("../models/examScore");
const OnlineExam = require("../models/onlineExam");
const ExamAttempt = require("../models/examAttempt");
const { errorLog } = require("../utils/errorLog");
const LoginLog = require("../models/Login");

const getMenu = async (role) => {
  const menu = await Menu.aggregate([
    {
      $lookup: {
        from: "menuroles",
        localField: "_id",
        foreignField: "menu",
        as: "privilege",
        pipeline: [{ $match: { userType: role?._id } }],
      },
    },
    {
      $match: { "privilege.0": { $exists: true } },
    },
    {
      $unwind: "$privilege", // Unwind the menuRoles to filter menus per role
    },
    {
      $match: { "privilege.status": true }, // Only include menus where the role is active
    },
    {
      $lookup: {
        from: "submenus",
        localField: "_id",
        foreignField: "menu",
        as: "submenus",
        pipeline: [
          {
            $lookup: {
              from: "submenuroles",
              localField: "_id",
              foreignField: "subMenu",
              as: "privilege",
              pipeline: [{ $match: { userType: role?._id } }],
            },
          },
          {
            $match: { "privilege.0": { $exists: true } },
          },
          {
            $unwind: "$privilege", // Unwind the menuRoles to filter menus per role
          },
          {
            $match: { "privilege.status": true }, // Only include sub-menus where the role is active
          },
          {
            $sort: { sequence: 1 },
          },
        ],
      },
    },
    {
      $sort: { sequence: 1 },
    },
  ]).exec();

  return menu;
};

const buildActiveExamWindow = (now) => ({
  $or: [{ examDate: null }, { examDate: { $lte: now }, examEndDate: { $gte: now } }, { examDate: { $lte: now }, examEndDate: null }],
});

const resolveStudentRegistrationByMobile = async (mobile) => {
  const normalizedMobile = Number(mobile);
  if (!normalizedMobile) {
    return null;
  }

  return ExamRegistration.findOne({ mobileNumber: normalizedMobile })
    .populate("nameOfExamAppearingNow", "examType examShortName examLevel examCategory")
    .populate("district", "district")
    .populate("area", "area")
    .lean();
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, res, req, meta = {}) => {
  const userObject = user.toObject();
  const {
    email,
    userType,
    _id,
    franchise,
    username,
    userDisplayName,
    fullName,
    name,
    mobile,
    userImage,
    image,
  } = userObject;
  const displayName = meta.fullName || userDisplayName || fullName || name || username || email || "Member";
  const photo = meta.photo || userImage || image || "";
  try {
    const token = user.getSignedJwtToken(
      userType.idleMinutes,
      userType.loginTokenDuration
    );
    const refreshToken = user.getRefreshToken(userType.refreshTokenDuration);
    if (!token) {
      res.status(200).json({
        success: false,
        message: "Something went wrong!",
      });
    } else {
      const ipAddress = req.ip;

      // Get the user agent of the user
      const userAgent = req.get("User-Agent");
      await LoginLog.create({
        status: "success",
        user: _id,
        ipAddress,
        userAgent,
      });
      const menu = await getMenu(userType);

      return res.status(200).json({
        user: {
          userType,
          email,
          userDisplayName: displayName,
          _id,
          franchise,
          username,
          name: displayName,
          fullName: displayName,
          photo,
          mobile: meta.mobile || mobile || "",
          examRegistrationId: meta.examRegistrationId || null,
          regno: meta.regno || "",
        },
        menu,
        token,
        refreshToken,
        userId: _id,
        examRegistrationId: meta.examRegistrationId || null,
        student: meta.student || null,
        success: true,
        message: "welcome back",
      });
    }
  } catch (error) {
    errorLog(req, error);
  }
};

// @desc      GET CURRENT LOGGED UER
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res) => {
  //This req.user come from middleware -> auth -> protect
  const admin = await User.findById(req.user.id);

  // if (admin.role === "admin") {
  res.status(200).json({
    success: true,
    admin,
  });
  // }
};

// @desc      LOGIN USER
// @route     POST /api/v1/auth/login
// @access    Public
// exports.login = async (req, res) => {
//   const { email, password, role } = req.body;
//   try {
//     const checkMail = await User.findOne({ email }).populate("userType").select("+password");
//     if (!checkMail) {
//       res.status(200).json({
//         success: false,
//         message: "There is no user corresponding to the email address.",
//       });
//     } else {
//       const checkPassword = await checkMail.matchPassword(password);
//       delete checkMail.password;
//       if (!checkPassword) {
//         res.status(200).json({
//           success: false,
//           message: "Wrong password",
//         });
//       } else {
//         sendTokenResponse(checkMail, res, req);
//       }
//     }
//   } catch (err) {
//     console.log("error check", err);
//     errorLog(req, err);
//     res.status(204).json({
//       success: false,
//       message: err,
//     });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .populate("userType")
      .select("+password");
    if (!user) {
      return res.status(200).json({
        success: false,
        message:
          "No user found with this email address. Please try again or sign up for a new account.",
      });
    }
    const checkPassword = await user.matchPassword(password);
    if (!checkPassword) {
      if (user.blocked) {
        const ipAddress = req.ip;
        const userAgent = req.get("User-Agent");
        await LoginLog.create({
          status: "blocked",
          user: user._id,
          ipAddress,
          userAgent,
        });
        return res.status(200).json({
          success: false,
          message:
            "Your account has been blocked. Please contact support for assistance.",
        });
      } else {
        const ipAddress = req.ip;
        const userAgent = req.get("User-Agent");
        await LoginLog.create({
          status: "failed",
          user: user._id,
          ipAddress,
          userAgent,
        });

        const loginLogs = await LoginLog.find({ user: user._id })
          .sort({ loginTime: -1 })
          .limit(5);

        let consecutiveFailedAttempts = 0;
        let breaked = false;
        loginLogs.forEach(async (log) => {
          if (log.status === "failed") {
            if (!breaked) {
              consecutiveFailedAttempts++;
            }
          } else {
            breaked = true;
          }
        });

        const remainingAttempts = Math.max(0, 5 - consecutiveFailedAttempts);
        console.log(loginLogs, consecutiveFailedAttempts, remainingAttempts);
        let message = `Incorrect password. You have ${remainingAttempts} attempts remaining before your account is blocked.`;
        if (consecutiveFailedAttempts === 5) {
          await User.findByIdAndUpdate(user._id, { blocked: true });
          message =
            "Your account has been blocked due to multiple failed login attempts. Please contact support for assistance.";
        }
        return res.status(200).json({
          success: false,
          message,
        });
      }
    }
    if (user.blocked) {
      const ipAddress = req.ip;
      const userAgent = req.get("User-Agent");
      await LoginLog.create({
        status: "blocked",
        user: user._id,
        ipAddress,
        userAgent,
      });
      return res.status(200).json({
        success: false,
        message:
          "Your account has been blocked. Please contact support for assistance.",
      });
    } else {
      // Check the role (userType) and handle login accordingly
      if (user.userType.role === "patient") {
        // For patient login, use additional criteria (e.g., CPR number)
        // Modify this condition based on your actual authentication criteria
        const isPatientAuthenticated = await user.matchCprNumber(
          req.body.cprNumber
        );
        if (!isPatientAuthenticated) {
          return res.status(200).json({
            success: false,
            message: "Invalid CPR number for patient login.",
          });
        }
      }

      // If the user is not a patient or the patient is authenticated, proceed with login
      sendTokenResponse(user, res, req);
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Check if email already exists
    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user
    const user = await User.create({ email, username, password });

    sendTokenResponse(user, res);
  } catch (err) {
    console.error("Error during registration:", err);
    errorLog(req, err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// @desc      Update Password
// @route     PUT /api/v1/auth/update-password
// @access    Private
exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Find the user by ID without validating other fields like email
    const user = await User.findById(req.body.user).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the password
    user.password = newPassword;

    // Save the user document, only validating the updated password
    await user.save({ validateModifiedOnly: true });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Password update failed" });
  }
};

exports.gauthregister = async (req, res) => {
  try {
    const { email, uid, userType, franchise } = req.body;

    // Check if user with the same email and franchise already exists
    const existingUser = await User.exists({
      email,
      franchise,
    });

    if (existingUser) {
      // If the user already exists with the same email and franchise, update their uid
      await User.updateOne({ email }, { uid });
      return res.status(400).json({
        error: "User with the same email and franchise already exists",
      });
    }

    // Validate userType and franchise
    const isValidUserType = isValidObjectId(userType);
    const isValidFranchise = isValidObjectId(franchise);

    if (!isValidUserType) {
      return res.status(400).json({ error: "Invalid userType" });
    }

    if (!isValidFranchise) {
      return res.status(400).json({ error: "Invalid franchise" });
    }

    // Check if the provided franchise ID exists
    const existingFranchise = await Franchise.exists({ _id: franchise });
    if (!existingFranchise) {
      return res.status(400).json({ error: "Franchise does not exist" });
    }

    // Create user with the provided franchise ID
    const user = await User.create(req.body);

    sendTokenResponse(user, res);
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed", err });
  }
};

exports.gauth = async (req, res) => {
  const { uid, email, franchiseId } = req.body;
  console.log({ email, uid, franchiseId });
  try {
    const checkUser = await User.findOne({
      uid,
      email,
      franchise: franchiseId,
    }).populate("userType");
    if (!checkUser) {
      res.status(200).json({
        success: false,
        message: "There is no user corresponding to the Google User ID.",
      });
    } else {
      sendTokenResponse(checkUser, res);
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(204).json({
      success: false,
      message: "An error occurred during Google authentication.",
    });
  }
};

// ─── Student PIN Login ────────────────────────────────────────
// @desc   Login student with mobile number + 4-digit PIN
// @route  POST /api/v1/auth/student-login
// @access Public
exports.studentLogin = async (req, res) => {
  const { mobile, pin } = req.body;
  try {
    if (!mobile || !pin) {
      return res.status(200).json({ success: false, message: "Mobile number and PIN are required." });
    }

    const studentRole = await UserType.findOne({ role: "Student" });
    if (!studentRole) {
      return res.status(200).json({ success: false, message: "Student role not configured." });
    }

    // Look up student in ExamRegistration by mobileNumber
    const registration = await ExamRegistration.findOne({ mobileNumber: Number(mobile) }).populate("nameOfExamAppearingNow", "examType examShortName");
    if (!registration) {
      return res.status(200).json({ success: false, message: "No student account found with this mobile number." });
    }

    // Find or create corresponding User record for this student
    let user = await User.findOne({ mobile, userType: studentRole._id })
      .populate("userType")
      .select("+pin +password");

    if (!user) {
      // Auto-create User record from ExamRegistration data
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const defaultPin = mobile.slice(-4);
      const hashedPin = await bcrypt.hash(defaultPin, salt);
      const dummyPassword = await bcrypt.hash(mobile + Date.now(), salt);

      user = await User.collection.insertOne({
        name: registration.nameOfApplicant || "Student",
        email: `student_${mobile}@qsc.local`,
        mobile,
        userType: studentRole._id,
        password: dummyPassword,
        pin: hashedPin,
        blocked: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await User.findById(user.insertedId)
        .populate("userType")
        .select("+pin +password");
    }

    if (user.blocked) {
      return res.status(200).json({ success: false, message: "Your account has been blocked. Please contact support." });
    }

    // If user has no pin set, default to last 4 digits of mobile
    if (!user.pin) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const defaultPin = mobile.slice(-4);
      user.pin = await bcrypt.hash(defaultPin, salt);
      await User.findByIdAndUpdate(user._id, { pin: user.pin });
    }

    const isMatch = await user.matchPin(pin);
    if (!isMatch) {
      const ipAddress = req.ip;
      const userAgent = req.get("User-Agent");
      await LoginLog.create({ status: "failed", user: user._id, ipAddress, userAgent });

      const recentLogs = await LoginLog.find({ user: user._id }).sort({ loginTime: -1 }).limit(5);
      let consecutiveFails = 0;
      for (const log of recentLogs) {
        if (log.status === "failed") consecutiveFails++;
        else break;
      }
      const remaining = Math.max(0, 5 - consecutiveFails);
      if (consecutiveFails >= 5) {
        await User.findByIdAndUpdate(user._id, { blocked: true });
        return res.status(200).json({ success: false, message: "Account blocked due to multiple failed attempts. Contact support." });
      }
      return res.status(200).json({ success: false, message: `Incorrect PIN. ${remaining} attempts remaining.` });
    }

    sendTokenResponse(user, res, req, {
      mobile,
      regno: registration.regno || "",
      fullName: registration.nameOfApplicant || user.name || "Student",
      examRegistrationId: String(registration._id),
      student: {
        id: String(registration._id),
        name: registration.nameOfApplicant || user.name || "Student",
        mobile: String(registration.mobileNumber || mobile),
        regno: registration.regno || "",
        registeredExamId: registration.nameOfExamAppearingNow?._id ? String(registration.nameOfExamAppearingNow._id) : "",
        registeredExam: registration.nameOfExamAppearingNow?.examType || "",
        registeredExamShortName: registration.nameOfExamAppearingNow?.examShortName || "",
      },
    });
  } catch (err) {
    console.error("studentLogin error:", err);
    errorLog(req, err);
    res.status(200).json({ success: false, message: "Internal server error." });
  }
};

// @desc   Student home summary
// @route  GET /api/v1/auth/student-home
// @access Private (Student)
exports.getStudentHome = async (req, res) => {
  try {
    const registration = await resolveStudentRegistrationByMobile(req.user?.mobile);

    if (!registration) {
      return res.status(404).json({ success: false, message: "Student registration not found." });
    }

    const now = new Date();
    const registeredExamId = registration.nameOfExamAppearingNow?._id ? String(registration.nameOfExamAppearingNow._id) : registration.nameOfExamAppearingNow ? String(registration.nameOfExamAppearingNow) : "";

    const [about, floatingSettings, examScore, liveExams, practiceExams, recentAttempts] = await Promise.all([
      AboutUs.findOne().sort({ updatedAt: -1, _id: -1 }).lean(),
      FloatingSettings.findOne().sort({ updatedAt: -1, _id: -1 }).lean(),
      ExamScore.findOne({ student: registration._id }).populate("exam", "examType examShortName").lean(),
      registeredExamId
        ? OnlineExam.find({
            status: true,
            exam: registeredExamId,
            ...buildActiveExamWindow(now),
          })
            .select("title examType description totalQuestions duration passingPercentage examDate examEndDate")
            .sort({ examDate: -1, createdAt: -1 })
            .limit(5)
            .lean()
        : [],
      registeredExamId
        ? OnlineExam.find({ status: true, exam: registeredExamId })
            .select("title examType description totalQuestions duration practiceQuestionCount")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
        : [],
      ExamAttempt.find({ user: registration._id })
        .populate("exam", "title examType")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const hallTicketAvailable = Boolean(floatingSettings?.hallTicket);
    const certificateAvailable = Boolean(floatingSettings?.result && examScore);

    const notifications = [];

    if (!registeredExamId) {
      notifications.push({
        id: "exam-mapping-missing",
        tone: "warning",
        title: "Exam mapping pending",
        description: "Your registration has no mapped online exam yet. Please contact the admin team.",
      });
    }

    if (liveExams.length > 0) {
      notifications.push({
        id: "live-exams",
        tone: "info",
        title: "Online exam is available",
        description: `${liveExams.length} exam${liveExams.length > 1 ? "s are" : " is"} ready to start for your registered stream.`,
        actionPath: "/take-exam",
        actionLabel: "Take exam",
      });
    }

    if (practiceExams.length > 0) {
      notifications.push({
        id: "practice-exams",
        tone: "success",
        title: "Practice exam is ready",
        description: `${practiceExams.length} practice option${practiceExams.length > 1 ? "s are" : " is"} available for revision.`,
        actionPath: "/practice-exam",
        actionLabel: "Practice now",
      });
    }

    if (hallTicketAvailable) {
      notifications.push({
        id: "hall-ticket",
        tone: "info",
        title: "Hall ticket download is enabled",
        description: "You can download your hall ticket directly from home when needed.",
      });
    }

    if (certificateAvailable) {
      notifications.push({
        id: "certificate",
        tone: "success",
        title: "Certificate is available",
        description: "Your result certificate can be downloaded from the home screen.",
      });
    }

    if (notifications.length === 0) {
      notifications.push({
        id: "no-updates",
        tone: "neutral",
        title: "No new updates",
        description: "New exam, hall ticket, and certificate updates will appear here when available.",
      });
    }

    res.status(200).json({
      success: true,
      response: {
        student: {
          id: String(registration._id),
          name: registration.nameOfApplicant || req.user?.name || req.user?.mobile || "Student",
          mobile: String(registration.mobileNumber || req.user?.mobile || ""),
          regno: registration.regno || "",
          registeredExamId,
          registeredExam: registration.nameOfExamAppearingNow?.examType || "",
          registeredExamShortName: registration.nameOfExamAppearingNow?.examShortName || "",
          district: registration.district?.district || "",
          area: registration.area?.area || "",
        },
        banner: {
          title: about?.landingTitle || about?.title || "Welcome",
          description: about?.landingDescription || about?.description || "All your student actions stay in one place.",
          image: about?.landingMainbanner || about?.image || "",
        },
        actions: {
          liveExamCount: liveExams.length,
          practiceExamCount: practiceExams.length,
          hallTicketAvailable,
          certificateAvailable,
        },
        notifications,
        liveExams,
        practiceExams,
        recentAttempts,
        downloads: {
          hallTicket: {
            available: hallTicketAvailable,
            mobileNumber: String(registration.mobileNumber || req.user?.mobile || ""),
          },
          certificate: {
            available: certificateAvailable,
            regno: registration.regno || String(registration.mobileNumber || req.user?.mobile || ""),
          },
        },
      },
    });
  } catch (err) {
    console.error("getStudentHome error:", err);
    errorLog(req, err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// @desc   Student changes own PIN (authenticated)
// @route  POST /api/v1/auth/change-pin
// @access Private (Student)
exports.changePin = async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    if (!newPin || !/^\d{4}$/.test(newPin)) {
      return res.status(200).json({ success: false, message: "PIN must be exactly 4 digits." });
    }

    const user = await User.findById(req.user.id).select("+pin");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // If a PIN is already set, verify the current one
    if (user.pin) {
      if (!currentPin) return res.status(200).json({ success: false, message: "Current PIN is required." });
      const valid = await user.matchPin(currentPin);
      if (!valid) return res.status(200).json({ success: false, message: "Current PIN is incorrect." });
    }

    user.pin = newPin;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, message: "PIN updated successfully." });
  } catch (err) {
    console.error("changePin error:", err);
    res.status(500).json({ success: false, message: "Failed to update PIN." });
  }
};

// @desc   Admin resets student PIN to last 4 digits of mobile
// @route  POST /api/v1/auth/reset-pin
// @access Private (Admin)
exports.resetPin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const mobile = user.mobile || "";
    if (mobile.length < 4) {
      return res.status(200).json({ success: false, message: "User has no valid mobile number to derive PIN." });
    }

    const defaultPin = mobile.slice(-4);
    user.pin = defaultPin;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, message: `PIN reset to last 4 digits of mobile (****${defaultPin}).` });
  } catch (err) {
    console.error("resetPin error:", err);
    res.status(500).json({ success: false, message: "Failed to reset PIN." });
  }
};
