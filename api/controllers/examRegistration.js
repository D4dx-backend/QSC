const ExamRegistration = require("../models/examRegistration");
const { default: mongoose } = require("mongoose");
const ExamScore = require("../models/examScore");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const ExamCenterRegistration = require("../models/examCenterRegistration");
const ExamType = require("../models/examtype");
const CertificateManagement = require("../models/certificateManagement");
const { nextRegNo, nextRegNoByDistrictArea } = require("../utils/regno");
const ExamSettings = require("../models/examSettings");
const { recomputeAllocation } = require("./examAllocation");

const s3 = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// @desc      ADD EXAM  REGISTRATION
// @route     POST /api/user/exam-registration
// @access    public
// Helper function to validate English-only input
// const isEnglishText = (text) => /^[\x00-\x7F\s]+$/.test(text);
exports.addExamRegistration = async (req, res) => {
  try {
    const { regno, mobileNumber, nameOfApplicant, address, educationalQualification, religiousEducationalQualification, age } = req.body;
    console.log(req.body);
    // Normalize mobile number by removing spaces and trimming
    const normalizedMobileNumber = Number(String(mobileNumber).replace(/\s+/g, "").trim());

    console.log(normalizedMobileNumber);
    /// Helper function to detect Malayalam characters
    const containsMalayalam = (text) => /[\u0D00-\u0D7F]/.test(text);

    // Check if the input contains Malayalam characters and return an error
    if (containsMalayalam(nameOfApplicant)) {
      return res.status(400).json({ success: false, customMessage: "The name should be typed in English only. Malayalam or other non-English characters are not allowed." });
    }

    if (containsMalayalam(address)) {
      return res.status(400).json({ success: false, customMessage: "The address should be typed in English only. Malayalam or other non-English characters are not allowed." });
    }

    if (containsMalayalam(educationalQualification)) {
      return res.status(400).json({ success: false, customMessage: "The educational qualification should be typed in English only. Malayalam or other non-English characters are not allowed." });
    }

    if (containsMalayalam(religiousEducationalQualification)) {
      return res.status(400).json({ success: false, customMessage: "The religious educational qualification should be typed in English only. Malayalam or other non-English characters are not allowed." });
    }

    // Check for existing regno, mobileNumber, or nameOfApplicant in a single query
    const existingRecord = await ExamRegistration.findOne({ mobileNumber: normalizedMobileNumber });
    console.log({ existingRecord });

    if (existingRecord) {
      let duplicateField = "";
      if (existingRecord.regno === regno) duplicateField = "registration number";
      else if (existingRecord.mobileNumber === normalizedMobileNumber) {
        duplicateField = "mobile number";
        return res.status(400).json({ success: false, customMessage: "This mobile number is already used in another registration." });
      } else if (existingRecord.nameOfApplicant === nameOfApplicant) duplicateField = "name";

      return res.status(400).json({
        success: false,
        customMessage: `This ${duplicateField} is already registered with another user.`,
      });
    }

    // Create new exam registration if no conflicts are found
    const payload = { ...req.body, mobileNumber: normalizedMobileNumber };

    // Auto-generate register number at submit time.
    // Format: QSC{DIST4}{AREA4}{Seq4} — see utils/regno.js
    // Generates when district and area are provided and no regno supplied by admin.
    if (payload.district && payload.area && !payload.regno) {
      try {
        payload.regno = await nextRegNoByDistrictArea(payload.district, payload.area);
      } catch (genErr) {
        console.error("regno generation failed:", genErr.message);
        return res.status(400).json({
          success: false,
          customMessage:
            "Could not generate registration number. Please ensure district and area are selected.",
        });
      }
    }

    // Phase 2.1/2.2: default assigned exam centre = the student's own study centre.
    // Clubbing / ≥threshold rule runs asynchronously after save (see below).
    if (payload.centerRegistration && !payload.assignedExamCenter) {
      payload.assignedExamCenter = payload.centerRegistration;
    }

    const response = await ExamRegistration.create(payload);

    // Fire-and-forget async re-allocation for this (district, examType) bucket so
    // the ≥minCount clubbing rule stays current as new registrations arrive.
    // Intentionally NOT awaited — the applicant's response should not be held up.
    (async () => {
      try {
        const settings = await ExamSettings.getCurrent();
        if (settings.autoRecomputeOnSubmit && !settings.allocationLocked && response.district && response.nameOfExamAppearingNow) {
          await recomputeAllocation({
            district: response.district,
            examType: response.nameOfExamAppearingNow,
          });
        }
      } catch (e) {
        console.error("post-submit recompute failed:", e.message);
      }
    })();

    res.status(200).json({
      success: true,
      message: "Successfully added exam registration.",
      data: { registration: response },
    });
  } catch (err) {
    console.error(err);
    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry detected: This mobile number, registration number, or name already exists." });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      GET EXAM REGISTRTAION
// @route     GET /api/v1/exam-registration
// @access    public
exports.getExamRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await ExamRegistration.findById(id).populate("centerRegistration");
      return res.status(200).json({ success: true, message: "Retrieved specific ExamRegistration", response });
    }

    const query = {
      ...req.filter,
      ...(req.user.districts ? { district: req.user.districts } : {}),
      ...(searchkey && {
        $or: [{ nameOfApplicant: { $regex: searchkey, $options: "i" } }, { regno: { $regex: searchkey, $options: "i" } }, { mobileNumber: !isNaN(searchkey) ? parseInt(searchkey) : null }].filter((cond) => Object.values(cond)[0] !== null), // Remove conditions with null values
      }),
    };

    // Calculate counts when filters are applied or on first page load
    const shouldCalculateCounts = parseInt(skip) === 0 || Object.keys(req.filter || {}).length > 0;

    const [totalCount, filterCount, data, genderCounts] = await Promise.all([
      parseInt(skip) === 0 && ExamRegistration.countDocuments(),
      shouldCalculateCounts && ExamRegistration.countDocuments(query),
      ExamRegistration.find(query)
        .populate("district")
        .populate("area")
        .populate("nameOfExamAppearingNow")
        .populate("examCenter")
        .populate("centerRegistration")
        .populate("examDistrict")
        .populate("outsideExamCenter")
        .select("nameOfApplicant examName examSyllabus district area nameOfExamAppearingNow examCenter centerRegistration examDistrict outsideExamCenter regno mobileNumber address educationalQualification religiousEducationalQualification affiliation whatsappNumber gender outsideCenter status feeDetails age")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
      shouldCalculateCounts && Promise.all([ExamRegistration.countDocuments({ ...query, gender: "Male" }), ExamRegistration.countDocuments({ ...query, gender: "Female" })]),
    ]);

    const counts = shouldCalculateCounts
      ? {
          "Male Students": {
            count: genderCounts?.[0] || 0,
          },
          "Female Students": {
            count: genderCounts?.[1] || 0,
          },
          "Total Students": {
            count: filterCount || 0,
          },
        }
      : {};

    res.status(200).json({
      success: true,
      message: `Retrieved all ExamRegistration`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
      counts,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC EXAM REGISTRTAION
// @route     PUT /api/user/exam-registration
// @access    public
exports.updateExamRegistration = async (req, res) => {
  try {
    // Log the incoming update request
    console.log("[updateExamRegistration] Incoming update:", req.body);

    // Clear conflicting fields based on the type of center
    if (req.body.outsideExamCenter) {
      req.body.examCenter = null;
      // Preserve the student's own 'district' so it remains visible in forms and exports
      console.log("[updateExamRegistration] Switching to outsideExamCenter. Cleared examCenter; preserved district as own district.");
    }
    if (req.body.examCenter) {
      req.body.outsideExamCenter = null;
      req.body.examDistrict = null;
      console.log("[updateExamRegistration] Switching to examCenter. Cleared outsideExamCenter and examDistrict.");
    }

    const examRegistration = await ExamRegistration.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!examRegistration) {
      return res.status(404).json({ success: false, message: " ExamRegistration not found" });
    }

    res.status(200).json({ success: true, message: "ExamRegistration updated successfully", data: examRegistration });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC EXAM REGISTRTAION
// @route     DELETE /api/user/exam-registration
// @access    public
exports.deleteExamRegistration = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await ExamRegistration.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific ExamRegistration`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET EXAM REGISTRTAION
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ExamRegistration.find({}, { _id: 0, id: "$_id", value: "$nameOfApplicant" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET EXAM RESULT
// @route     GET /api/v1/exam-registration/result
// @access    public
exports.getExamResult = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await ExamRegistration.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific exam registration", response });
    }

    // Check if regno or mobileNumber is provided in the request query
    if (req.query.regno) {
      // Check if the input is a number (mobile number) or string (registration number)
      const isNumeric = !isNaN(req.query.regno) && !isNaN(parseFloat(req.query.regno));

      const filters = {
        $or: [{ regno: req.query.regno }, ...(isNumeric ? [{ mobileNumber: parseInt(req.query.regno) }] : [])],
        // Removed the nameOfExamAppearingNow condition
      };

      const examData = await ExamRegistration.find(filters).populate("district").populate("area").populate("nameOfExamAppearingNow").populate("examCenter").populate("centerRegistration");

      // Check if examData is empty
      if (examData.length === 0) {
        return res.status(400).json({ success: false, customMessage: "No Exam result found for the provided register number or mobile number" });
      }

      const examScore = await ExamScore.findOne({ student: examData[0]._id });

      // Phase 2.6 — attach rank (district-level, with state-level fallback).
      let enrichedResult = examScore ? examScore.toObject() : null;
      if (examScore && examData[0]?.nameOfExamAppearingNow) {
        try {
          const { computeStudentRank } = require("./rankList");
          const ranks = await computeStudentRank({
            student: examData[0]._id,
            examType: examData[0].nameOfExamAppearingNow,
          });
          if (ranks) {
            const preferred = ranks.district || ranks.state;
            if (preferred) {
              enrichedResult = {
                ...enrichedResult,
                rank: preferred.rank,
                totalCandidates: preferred.totalCandidates,
                scopeLabel: ranks.district ? "in district" : "state-wide",
                ranks,
              };
            }
          }
        } catch (rankErr) {
          console.error("rank lookup failed:", rankErr.message);
        }
      }

      // If the result is found, return the response and exit the function
      return res.status(200).json({ success: true, message: "Filtered exam result data", response: examData, result: enrichedResult, count: examData.length });
    }

    // If no regno is provided, execute the rest of the code
    const query = {
      ...req.filter,
      ...(req.user.districts ? { district: req.user.districts } : {}),
      ...(searchkey && {
        $or: [{ nameOfApplicant: { $regex: searchkey, $options: "i" } }, { regno: { $regex: searchkey, $options: "i" } }, { mobileNumber: !isNaN(searchkey) ? parseInt(searchkey) : null }].filter((cond) => Object.values(cond)[0] !== null),
      }),
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ExamRegistration.countDocuments(),
      parseInt(skip) === 0 && ExamRegistration.countDocuments(query),
      ExamRegistration.find(query)
        .populate("district")
        .populate("area")
        .populate("nameOfExamAppearingNow")
        .populate("examCenter")
        .populate("CenterRegistration")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    return res.status(200).json({ success: true, message: `Retrieved all exam result`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err.toString() });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { regno } = req.query;

    if (!regno) {
      return res.status(400).json({
        success: false,
        customMessage: "Register number or mobile number is required",
      });
    }

    let examRegistration;

    // Check if the input is a mobile number (assume 10-digit numeric input for a mobile number)
    const isMobileNumber = /^[0-9]{10}$/.test(regno);

    if (isMobileNumber) {
      // If it's a mobile number, search by mobileNumber
      examRegistration = await ExamRegistration.findOne({ mobileNumber: regno }).populate("nameOfExamAppearingNow").populate("centerRegistration").populate("examCenter");
    } else {
      // If it's not a mobile number, assume it's a registration number
      examRegistration = await ExamRegistration.findOne({ regno: regno }).populate("nameOfExamAppearingNow").populate("centerRegistration").populate("examCenter");
    }

    if (!examRegistration) {
      return res.status(404).json({
        success: false,
        customMessage: "Exam registration not found",
      });
    }

    // Fetch the exam score associated with this exam registration
    const examScore = await ExamScore.findOne({
      student: examRegistration._id,
    }).populate("exam");

    if (!examScore) {
      return res.status(404).json({
        success: false,
        customMessage: "Exam score not found",
      });
    }

    // Get the certificate template from certificate management
    let certificate;
    try {
      // First try to find a record with the new certificate fields
      certificate = await CertificateManagement.findOne({
        $or: [{ stateExamCertificate: { $exists: true } }, { districtExamCertificate: { $exists: true } }],
      });

      // If no record with new fields found, get any record
      if (!certificate) {
        certificate = await CertificateManagement.findOne({});
      }

      console.log("Certificate management data:", certificate);

      // Additional debugging - check if the specific fields exist
      if (certificate) {
        console.log("Certificate fields check:", {
          hasStateExamCertificate: !!certificate.stateExamCertificate,
          hasDistrictExamCertificate: !!certificate.districtExamCertificate,
          stateExamCertificate: certificate.stateExamCertificate,
          districtExamCertificate: certificate.districtExamCertificate,
        });
      }
    } catch (error) {
      console.error("Error fetching certificate management data:", error);
      return res.status(500).json({
        success: false,
        customMessage: "Error retrieving certificate templates. Please try again.",
      });
    }

    // Check if certificate data exists
    if (!certificate) {
      console.log("No certificate management record found, creating default...");
      try {
        // Create a default certificate management record
        certificate = new CertificateManagement({
          stateExamCertificate: "uploads/certificate-management/stateExamCertificate-1759240327420.pdf",
          districtExamCertificate: "uploads/certificate-management/districtExamCertificate-1759240327441.pdf",
        });
        await certificate.save();
        console.log("Default certificate management record created:", certificate);
      } catch (createError) {
        console.error("Error creating default certificate management record:", createError);
        return res.status(500).json({
          success: false,
          customMessage: "Error setting up certificate templates. Please contact administrator.",
        });
      }
    }

    // Determine which certificate template to use based on exam level + exam category.
    // Phase 3 — the ExamType itself carries examLevel (State/District) and
    // examCategory (Regular/Private). The same candidate does not switch
    // between Regular and Private — they are registered for exactly one
    // variant of the exam — so we drive the template off the exam, not off
    // the student's status. Fall back to legacy slots, and finally to the
    // exam-name regex for pre-2026 data that lacks the new fields.
    const examTypeDoc = examRegistration.nameOfExamAppearingNow;
    const examType = examTypeDoc?.examType || "";
    const examLevel =
      examTypeDoc?.examLevel ||
      (examType.includes("Preliminary VI") || examType.includes("Secondary III") ? "State" : "District");
    const examCategory =
      examTypeDoc?.examCategory ||
      (examRegistration.status === "Private" ? "Private" : "Regular");
    const isStateCertificate = examLevel === "State";

    console.log("Certificate selection logic:", {
      examType,
      examLevel,
      examCategory,
      studentStatus: examRegistration.status,
      availableTemplates: {
        stateExamCertificate: certificate?.stateExamCertificate,
        districtExamCertificate: certificate?.districtExamCertificate,
        stateExamCertificateRegular: certificate?.stateExamCertificateRegular,
        stateExamCertificatePrivate: certificate?.stateExamCertificatePrivate,
        districtExamCertificateRegular: certificate?.districtExamCertificateRegular,
        districtExamCertificatePrivate: certificate?.districtExamCertificatePrivate,
        examCertificate: certificate?.examCertificate,
      },
    });

    let certificateTemplate;
    if (isStateCertificate) {
      certificateTemplate =
        (examCategory === "Private"
          ? certificate?.stateExamCertificatePrivate
          : certificate?.stateExamCertificateRegular) || certificate?.stateExamCertificate;
    } else {
      certificateTemplate =
        (examCategory === "Private"
          ? certificate?.districtExamCertificatePrivate
          : certificate?.districtExamCertificateRegular) || certificate?.districtExamCertificate;
    }

    // If specific template is not available, throw an error instead of falling back
    if (!certificateTemplate) {
      return res.status(404).json({
        success: false,
        customMessage: isStateCertificate
          ? `State ${examCategory} certificate template not found. Please upload a template under Certificate Management.`
          : `District ${examCategory} certificate template not found. Please upload a template under Certificate Management.`,
      });
    }

    try {
      // Use the stored path directly as the S3 key
      const getObjectParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: certificateTemplate,
      };

      const { Body } = await s3.send(new GetObjectCommand(getObjectParams));
      const templateBytes = await Body.transformToByteArray();

      // Load and modify the PDF
      const pdfDoc = await PDFDocument.load(templateBytes);

      // Set document title
      const documentTitle = "QSC Certificate";
      pdfDoc.setTitle(documentTitle);

      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Log the data we're going to draw
      console.log("Drawing certificate data:", {
        name: examRegistration.nameOfApplicant,
        examType: examRegistration.nameOfExamAppearingNow?.examType,
        grade: examScore?.grade,
        certificateType: isStateCertificate ? "State" : "District",
        templateUsed: certificateTemplate,
      });

      // Draw applicant's name (positioned on the right side of "Certified that Mr/Mrs." line)
      firstPage.drawText(examRegistration.nameOfApplicant || "N/A", {
        x: 300,
        y: 350,
        size: 16,
        font: font,
      });

      // Draw exam type (positioned on the right side of the same line as name)
      let examTypeFull = examRegistration.nameOfExamAppearingNow?.examType || "N/A";
      let examTypeShort = examTypeFull.split(":")[0]; // Get the part before the colon
      firstPage.drawText(examTypeShort, {
        x: 320,
        y: 312,
        size: 16,
        font: font,
      });

      // Draw the fixed date (positioned on the right side of "Examination conducted on" line)
      firstPage.drawText("13th July 2025", {
        x: 310,
        y: 264,
        size: 16,
        font: font,
      });

      // Draw the grade (positioned on the right side of the line ending with "grade.")
      firstPage.drawText(examScore?.grade || "No grade", {
        x: 420,
        y: 220,
        size: 16,
        font: font,
      });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const certificateTypePrefix = isStateCertificate ? "State" : "District";
      const folder = process.env.DO_SPACES_FOLDER || "";
      const fileName = folder ? `${folder}/certificates/${certificateTypePrefix}-Certificate-${Date.now()}.pdf` : `certificates/${certificateTypePrefix}-Certificate-${Date.now()}.pdf`;

      // Upload to DO Spaces
      const uploadParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Body: modifiedPdfBytes,
        ContentType: "application/pdf",
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      return res.status(200).json({
        success: true,
        message: `${documentTitle} generated successfully`,
        url: fileName,
      });
    } catch (s3Error) {
      console.error("S3 operation error:", s3Error);
      return res.status(500).json({
        success: false,
        customMessage: "Error accessing certificate template. Please ensure the template file exists.",
      });
    }
  } catch (error) {
    console.error("Certificate generation error:", error);
    return res.status(400).json({
      success: false,
      message: error.toString(),
    });
  }
};

exports.getOutsideExamCenterByDistrict = async (req, res) => {
  try {
    const { examDistrict } = req.query;

    // Validate the examDistrict ID
    if (!mongoose.isValidObjectId(examDistrict)) {
      return res.status(200).json([]);
    }

    // Find exam centers based on the examDistrict
    const items = await ExamCenterRegistration.find(
      { district: examDistrict }, // Match examDistrict
      { _id: 0, id: "$_id", value: "$centerName" } // Select necessary fields
    );

    // If no items are found, return an empty array
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No outside exam centers found for this district" });
    }

    // Send the response
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching outside exam centers:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Get exam registration list with specific fields
// @route     GET /api/v1/exam-registration/list
// @access    public
exports.getExamRegistrationList = async (req, res) => {
  try {
    const { skip = 0, limit = 10, searchkey, district, examCenter } = req.query;

    // Build the query
    const query = {
      ...req.filter,
      // Handle district filter with proper ObjectId conversion - check both regular and exam districts
      ...(district &&
        mongoose.Types.ObjectId.isValid(district) && {
          $or: [{ district: new mongoose.Types.ObjectId(district) }, { examDistrict: new mongoose.Types.ObjectId(district) }],
        }),
      // Handle examCenter filter with proper ObjectId conversion - check both regular and outside exam centers
      ...(examCenter &&
        mongoose.Types.ObjectId.isValid(examCenter) && {
          $or: [{ examCenter: new mongoose.Types.ObjectId(examCenter) }, { outsideExamCenter: new mongoose.Types.ObjectId(examCenter) }],
        }),
      // Handle search
      ...(searchkey && {
        $or: [{ nameOfApplicant: { $regex: searchkey, $options: "i" } }, { regno: { $regex: searchkey, $options: "i" } }].filter((cond) => Object.values(cond)[0] !== null),
      }),
    };

    // If examCenter is provided in the filter, ensure it's included in the query
    if (req.filter && req.filter.examCenter) {
      query.$or = [{ examCenter: new mongoose.Types.ObjectId(req.filter.examCenter) }, { outsideExamCenter: new mongoose.Types.ObjectId(req.filter.examCenter) }];
    }

    // Get registrations with selected fields
    const registrations = await ExamRegistration.find(query).populate("district", "district").populate("examDistrict", "district").populate("examCenter", "centerName").populate("outsideExamCenter", "centerName").populate("nameOfExamAppearingNow", "examType").select("district examDistrict nameOfApplicant examCenter outsideExamCenter regno examName").skip(parseInt(skip)).limit(parseInt(limit)).sort({ _id: -1 });

    // Transform the response to flatten nested objects
    const transformedRegistrations = registrations.map((reg) => ({
      _id: reg._id,
      nameOfApplicant: reg.nameOfApplicant,
      regno: reg.regno,
      examName: reg.examName,
      district: reg.district,
      examDistrict: reg.examDistrict,
      examCenter: reg.examCenter,
      outsideExamCenter: reg.outsideExamCenter,
    }));

    // Get total count for pagination
    const totalCount = await ExamRegistration.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Retrieved exam registration list",
      response: transformedRegistrations,
      count: transformedRegistrations.length,
      totalCount,
      filterCount: totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAttendanceSheet = async (req, res) => {
  try {
    const { district } = req.query;

    // Effective district: explicit query param for state admins, else the caller's own.
    const effectiveDistrict =
      district && mongoose.Types.ObjectId.isValid(district)
        ? district
        : req.user?.districts || null;

    if (effectiveDistrict) {
      if (!mongoose.Types.ObjectId.isValid(effectiveDistrict)) {
        return res.status(400).json({ success: false, message: "Invalid district ID" });
      }

      // Post-Phase-2.1: applicants write the exam at `assignedExamCenter` (a study
      // centre). Fall back to the legacy `examCenter`/`outsideExamCenter` fields
      // only if assignedExamCenter is missing (older records).
      const data = await ExamRegistration.find({ district: effectiveDistrict })
        .populate("district", "district")
        .populate("area", "area")
        .populate("centerRegistration", "nameOfCenter centerCode")
        .populate("assignedExamCenter", "nameOfCenter centerCode district")
        .populate("examCenter", "centerName")
        .populate("outsideExamCenter", "centerName")
        .populate("examDistrict", "district")
        .populate("nameOfExamAppearingNow", "examType");

      return res.status(200).json({
        success: true,
        message: "Registrations for district retrieved successfully",
        response: data,
      });
    } else {
      // This part remains the same
      const registrations = await ExamRegistration.find({}).populate("district", "district").select("_id district");

      const response = registrations.map((item) => ({
        id: item._id,
        value: item.district?.district || null,
      }));

      return res.status(200).json({
        success: true,
        message: "All districts retrieved successfully",
        response,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc     Phase 2.4 — Registered students verification list.
// @route    GET /api/v1/exam-registration/registered-list
// @access   protected (state admin sees all; district admin scoped)
// Returns a compact, ready-for-PDF dataset with the columns Sl / Name /
// Mobile / Study Centre / Area / Private-Regular / Exam Centre. Respects
// `req.filter` (district, examType, etc.) and the caller's district scope.
exports.getRegisteredStudentsList = async (req, res) => {
  try {
    const query = {
      ...(req.filter || {}),
      ...(req.user?.districts ? { district: req.user.districts } : {}),
    };

    const data = await ExamRegistration.find(query)
      .populate("district", "district")
      .populate("area", "area")
      .populate("centerRegistration", "nameOfCenter centerCode")
      .populate("assignedExamCenter", "nameOfCenter centerCode")
      .populate("nameOfExamAppearingNow", "examType")
      .select(
        "nameOfApplicant regno mobileNumber whatsappNumber status gender centerRegistration assignedExamCenter area district nameOfExamAppearingNow"
      )
      .sort({ nameOfApplicant: 1 });

    const rows = data.map((d, i) => ({
      sl: i + 1,
      id: d._id,
      name: d.nameOfApplicant || "",
      regno: d.regno || "",
      mobile: d.mobileNumber || "",
      whatsapp: d.whatsappNumber || "",
      gender: d.gender || "",
      status: d.status || "",
      examType: d.nameOfExamAppearingNow?.examType?.split(":")[0]?.trim() || "",
      area: d.area?.area || "",
      district: d.district?.district || "",
      studyCentre: d.centerRegistration?.nameOfCenter || "",
      studyCentreCode: d.centerRegistration?.centerCode || "",
      examCentre: d.assignedExamCenter?.nameOfCenter || d.centerRegistration?.nameOfCenter || "",
      examCentreCode: d.assignedExamCenter?.centerCode || d.centerRegistration?.centerCode || "",
    }));

    return res.status(200).json({
      success: true,
      count: rows.length,
      response: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getQuestionPackingList = async (req, res) => {
  try {
    const { examCenter } = req.query;

    if (examCenter) {
      if (!mongoose.Types.ObjectId.isValid(examCenter)) {
        return res.status(400).json({ success: false, message: "Invalid exam center ID" });
      }

      const data = await ExamRegistration.find({ examCenter }).populate("examCenter", "centerName").populate("district", "district").populate("nameOfExamAppearingNow", "examType");

      return res.status(200).json({
        success: true,
        message: "Question packing list for exam center retrieved successfully",
        response: data,
      });
    } else {
      const centers = await ExamRegistration.find({}).populate("examCenter", "centerName").select("_id examCenter");

      const response = centers.map((item) => ({
        id: item._id,
        value: item.examCenter?.centerName || null,
      }));

      return res.status(200).json({
        success: true,
        message: "All exam centers retrieved successfully",
        response,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOutsideExamAttendanceSheet = async (req, res) => {
  try {
    const { skip = 0, limit = 10, searchkey } = req.query;

    // Build the query to find students who opted for outside centers (outsideCenter: "No")
    const query = {
      outsideCenter: "No", // Students who selected "No" for the question about exam center in their district
      outsideExamCenter: { $ne: null }, // ensure they have a valid outside center
      ...(searchkey && {
        $or: [{ nameOfApplicant: { $regex: searchkey, $options: "i" } }, { regno: !isNaN(searchkey) ? parseInt(searchkey) : null }, { mobileNumber: !isNaN(searchkey) ? parseInt(searchkey) : null }].filter((cond) => Object.values(cond)[0] !== null),
      }),
    };

    // Get total count for pagination
    const totalCount = await ExamRegistration.countDocuments(query);

    // Find students with pagination
    const students = await ExamRegistration.find(query)
      .populate("district", "district")
      .populate("examDistrict", "district")
      .populate("outsideExamCenter", "centerName")
      .populate("nameOfExamAppearingNow", "examType")
      .populate("area", "area")
      .populate("centerRegistration", "nameOfCenter")
      .select("nameOfApplicant regno mobileNumber address educationalQualification religiousEducationalQualification affiliation whatsappNumber gender outsideCenter status feeDetails age district examDistrict outsideExamCenter nameOfExamAppearingNow area centerRegistration")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ "outsideExamCenter.centerName": 1, nameOfApplicant: 1 });

    if (!students.length) {
      return res.status(200).json({
        success: true,
        message: "No outside center students found.",
        response: [],
        count: 0,
        totalCount: 0,
        filterCount: 0,
      });
    }

    // Transform the data to match the expected format for ListTable
    const transformedStudents = students.map((student) => ({
      _id: student._id,
      nameOfApplicant: student.nameOfApplicant,
      regno: student.regno,
      mobileNumber: student.mobileNumber,
      address: student.address,
      educationalQualification: student.educationalQualification,
      religiousEducationalQualification: student.religiousEducationalQualification,
      affiliation: student.affiliation,
      whatsappNumber: student.whatsappNumber,
      gender: student.gender,
      outsideCenter: student.outsideCenter,
      status: student.status,
      feeDetails: student.feeDetails,
      age: student.age,
      district: student.district,
      examDistrict: student.examDistrict,
      outsideExamCenter: student.outsideExamCenter,
      nameOfExamAppearingNow: student.nameOfExamAppearingNow,
      area: student.area,
      centerRegistration: student.centerRegistration,
    }));

    res.status(200).json({
      success: true,
      message: "Outside center students retrieved successfully.",
      response: transformedStudents,
      count: transformedStudents.length,
      totalCount,
      filterCount: totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
// kajsdhwf
// @desc      Get districts excluding student's own district for examDistrict dropdown
// @route     GET /api/v1/exam-registration/districts-excluding-own
// @access    public
exports.getDistrictsExcludingOwn = async (req, res) => {
  try {
    const { studentDistrict, district } = req.query;

    // Use either studentDistrict or district parameter (district comes from updateOn)
    const excludeDistrictId = studentDistrict || district;

    // If no district is provided, return all districts
    if (!excludeDistrictId || !mongoose.isValidObjectId(excludeDistrictId)) {
      // Import District model
      const District = require("../models/district");

      // Return all districts if no valid district ID is provided
      const items = await District.find({}, { _id: 0, id: "$_id", value: "$district" });
      return res.status(200).json(items);
    }

    // Import District model
    const District = require("../models/district");

    // Find all districts except the student's own district
    const items = await District.find({ _id: { $ne: new mongoose.Types.ObjectId(excludeDistrictId) } }, { _id: 0, id: "$_id", value: "$district" });

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching districts excluding own:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// exports.assignRegisterNumbers = async (req, res) => {
//   try {
//     // Fetch all exam centers (both regular and outside centers are stored in ExamCenterRegistration)
//     const examCenters = await ExamCenterRegistration.find({});
//     const examTypes = await ExamType.find({});
//     const genders = ["Male", "Female"];

//     let counter = 1;

//     for (const center of examCenters) {
//       for (const type of examTypes) {
//         for (const gender of genders) {
//           // Fetch registrations for this group - check both regular and outside exam centers
//           const registrations = await ExamRegistration.find({
//             $or: [
//               { examCenter: center._id }, // Regular exam centers
//               { outsideExamCenter: center._id }, // Outside exam centers
//             ],
//             nameOfExamAppearingNow: type._id,
//             gender: gender,
//           }).sort({ nameOfApplicant: 1 }); // Sort by applicant name

//           for (const reg of registrations) {
//             const regNo = `QSC${String(counter).padStart(3, "0")}`;
//             reg.regno = regNo;
//             await reg.save(); // Save updated registerNo
//             counter++;
//           }

//           console.log(`Assigned ${registrations.length} registerNos for Center: ${center.centerName}, Type: ${type.examType}, Gender: ${gender}`);
//         }
//       }
//     }

//     console.log("✅ Register numbers assigned successfully.");
//     res.status(200).json({
//       success: true,
//       message: "Register numbers assigned successfully.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
