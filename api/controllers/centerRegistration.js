const { default: mongoose } = require("mongoose");
const CenterRegistration = require("../models/centerRegistration");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const s3 = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// @desc      CREATE NEW CenterRegistration
// @route     POST /api/v1/center-registration
// @access    protect
exports.createCenterRegistration = async (req, res) => {
  try {
    const response = await registerNewCenter(req.body);
    res.status(200).json({ success: true, message: `succefully added Center Registration`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET ALL CenterRegistration
// @route     GET /api/v1/center-registration
// @access    public
exports.getCenterRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, sortBy = "_id", sortOrder = "desc" } = req.query;
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortQuery = (() => {
      switch (sortBy) {
        case "name":
        case "nameOfCenter":
          return { nameOfCenter: sortDirection, _id: -1 };
        case "affiliation":
        case "affiliationNo":
          return { affiliationNo: sortDirection, _id: -1 };
        case "type":
        case "centerType":
          return { centerType: sortDirection, nameOfCenter: 1 };
        case "centerCode":
          return { centerCode: sortDirection, _id: -1 };
        case "halqaName":
          return { halqaName: sortDirection, _id: -1 };
        case "_id":
        default:
          return { _id: sortDirection };
      }
    })();

    const searchFilter = searchkey
      ? {
          $or: [
            { nameOfCenter: { $regex: searchkey, $options: "i" } },
            { affiliationNo: { $regex: searchkey, $options: "i" } },
            { halqaName: { $regex: searchkey, $options: "i" } },
            { centerCode: { $regex: searchkey, $options: "i" } },
          ],
        }
      : {};

    const query = {
      ...req.filter,
      ...(req.user.districts ? { district: req.user.districts } : {}),
      ...searchFilter,
    };

    // Calculate counts when filters are applied or on first page load
    const shouldCalculateCounts = parseInt(skip) === 0 || Object.keys(req.filter || {}).length > 0;

    // Ensure ObjectId types inside aggregation match stage (aggregate doesn't cast like queries do)
    const aggregateMatchQuery = (() => {
      const tmp = { ...query };
      try {
        if (tmp.district && typeof tmp.district === "string") tmp.district = new mongoose.Types.ObjectId(tmp.district);
      } catch (_) {
        // ignore cast error; leave as-is so it results in no matches, which is acceptable
      }
      try {
        if (tmp.area && typeof tmp.area === "string") tmp.area = new mongoose.Types.ObjectId(tmp.area);
      } catch (_) {}
      return tmp;
    })();

    const [totalCount, filterCount, data, centerTypeCounts, studentCounts] = await Promise.all([
      parseInt(skip) === 0 && CenterRegistration.countDocuments(),
      shouldCalculateCounts && CenterRegistration.countDocuments(query),
      CenterRegistration.find(query)
        .populate("district")
        .populate("area")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort(sortQuery),
      shouldCalculateCounts && Promise.all([CenterRegistration.countDocuments({ ...query, centerType: "Male" }), CenterRegistration.countDocuments({ ...query, centerType: "Female" }), CenterRegistration.countDocuments({ ...query, centerType: "Mixed" })]),
      shouldCalculateCounts &&
        CenterRegistration.aggregate([
          { $match: aggregateMatchQuery },
          {
            $addFields: {
              maleInt: { $convert: { input: "$studentsCountMale", to: "int", onError: 0, onNull: 0 } },
              femaleInt: { $convert: { input: "$studentsCountFemale", to: "int", onError: 0, onNull: 0 } },
            },
          },
          {
            $group: {
              _id: null,
              totalMaleStudents: { $sum: "$maleInt" },
              totalFemaleStudents: { $sum: "$femaleInt" },
              totalStudents: { $sum: { $add: ["$maleInt", "$femaleInt"] } },
            },
          },
        ]),
    ]);

    const studentCountsResult = studentCounts?.[0] || { totalMaleStudents: 0, totalFemaleStudents: 0, totalStudents: 0 };
    const maleStudentCount = studentCountsResult.totalMaleStudents || 0;
    const femaleStudentCount = studentCountsResult.totalFemaleStudents || 0;
    const totalStudents = studentCountsResult.totalStudents || 0;

    const counts = shouldCalculateCounts
      ? {
          "Male Centers": {
            count: centerTypeCounts?.[0] || 0,
          },
          "Female Centers": {
            count: centerTypeCounts?.[1] || 0,
          },
          "Mixed Centers": {
            count: centerTypeCounts?.[2] || 0,
          },
          "Total Centers": {
            count: filterCount || 0,
          },
          "Male Students": {
            count: maleStudentCount,
          },
          "Female Students": {
            count: femaleStudentCount,
          },
          "Total Students": {
            count: totalStudents,
          },
        }
      : {};

    res.status(200).json({
      success: true,
      message: "Retrieved all centerRegistration",
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

// @desc      UPDATE SPECIFIC CenterRegistration
// @route     PUT /api/v1/center-registration/:id
// @access    protect
exports.updateCenterRegistration = async (req, res) => {
  try {
    const centerRegistration = await CenterRegistration.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!centerRegistration) {
      return res.status(404).json({ success: false, message: " CenterRegistration not found" });
    }

    res.status(200).json({ success: true, message: "CenterRegistration updated successfully", data: centerRegistration });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC CenterRegistration
// @route     DELETE /api/v1/center-registration/:id
// @access    protect
exports.deleteCenterRegistration = async (req, res) => {
  try {
    const centerRegistration = await CenterRegistration.findByIdAndDelete(req.query.id);

    if (!centerRegistration) {
      return res.status(404).json({ success: false, message: "CenterRegistration not found" });
    }

    res.status(200).json({ success: true, message: "CenterRegistration deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET CUSTOMER TYPE
// @route     GET /api/v1/center-registration/select
// @access    public
exports.select = async (req, res) => {
  try {
    const items = await CenterRegistration.find({}, { _id: 0, id: "$_id", value: "$nameOfCenter" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

exports.downloadAffiliation = async (req, res) => {
  try {
    const { id } = req.query;
    const centerRegistration = await CenterRegistration.findById(id).populate("district").populate("area");

    if (!centerRegistration) {
      return res.status(404).json({
        success: false,
        customMessage: "Center registration not found",
      });
    }

    // Get the certificate template from certificate management
    const CertificateManagement = require("../models/certificateManagement.js");

    // Prefer a record that has the affiliation certificate template
    let certificate = await CertificateManagement.findOne({
      affiliationCertificate: { $exists: true, $ne: null },
    }).sort({ createdAt: -1 });

    // If not found, try any record (new fields), then fall back to one with affiliationCertificate
    if (!certificate) {
      const anyRecord = await CertificateManagement.findOne({
        $or: [{ stateExamCertificate: { $exists: true } }, { districtExamCertificate: { $exists: true } }, { affiliationCertificate: { $exists: true } }],
      }).sort({ createdAt: -1 });
      if (anyRecord?.affiliationCertificate) {
        certificate = anyRecord;
      } else {
        // Explicitly try to get a record that has affiliationCertificate
        certificate = await CertificateManagement.findOne({
          affiliationCertificate: { $exists: true, $ne: null },
        }).sort({ createdAt: -1 });
      }
    }

    if (!certificate || !certificate.affiliationCertificate) {
      return res.status(404).json({
        success: false,
        customMessage: "Affiliation certificate template not found",
      });
    }

    try {
      // Use the stored path directly as the S3 key
      const getObjectParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: certificate.affiliationCertificate,
      };

      const { Body } = await s3.send(new GetObjectCommand(getObjectParams));
      const templateBytes = await Body.transformToByteArray();

      // Load and modify the PDF
      const pdfDoc = await PDFDocument.load(templateBytes);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Log the data we're going to draw
      console.log("Drawing affiliation data:", {
        affiliationNo: centerRegistration.affiliationNo,
        centerName: centerRegistration.nameOfCenter,
        halqaName: centerRegistration.halqaName,
        area: centerRegistration.area.area,
        district: centerRegistration.district.district,
      });

      // Draw the affiliation number
      firstPage.drawText(centerRegistration.affiliationNo, {
        x: 325,
        y: 445,
        size: 14,
        font: boldFont,
      });

      // Draw the name of the center
      firstPage.drawText(centerRegistration.nameOfCenter, {
        x: 290,
        y: 403,
        size: 11,
        font: boldFont,
      });

      // Draw the name of the unit
      firstPage.drawText(centerRegistration.halqaName, {
        x: 210,
        y: 373,
        size: 11,
        font: boldFont,
      });

      // Draw the name of the area
      firstPage.drawText(centerRegistration.area.area, {
        x: 210,
        y: 343,
        size: 11,
        font: boldFont,
      });

      // Draw the name of the district
      firstPage.drawText(centerRegistration.district.district, {
        x: 210,
        y: 313,
        size: 11,
        font: boldFont,
      });

      // Get the current date
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Draw the Date
      firstPage.drawText(formattedDate, {
        x: 112,
        y: 161,
        size: 11,
        font: boldFont,
      });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const folder = process.env.DO_SPACES_FOLDER || "";
      const fileName = folder ? `${folder}/affiliation/Affiliation-Certificate-${Date.now()}.pdf` : `affiliation/Affiliation-Certificate-${Date.now()}.pdf`;

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
        message: "Affiliation certificate generated successfully",
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Affiliation Number Generation <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \\

// Function to generate the next affiliation number
const generateAffiliationNumber = async (centerType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the last affiliation number from the database with a lock
    const lastEntry = await CenterRegistration.find({}).sort({ createdAt: -1 }).limit(1).session(session).exec();

    let lastNumber = 0;

    if (lastEntry.length > 0) {
      // Extract the numeric part of the last affiliation number
      const lastAffiliationNo = lastEntry[0].affiliationNo;
      const matches = lastAffiliationNo.match(/\d+/);
      if (matches) {
        lastNumber = parseInt(matches[0], 10);
      }
    }

    // Increment the number
    const newNumber = lastNumber + 1;

    // Define the prefix based on the centerType
    let prefix = "";
    switch (centerType) {
      case "Female":
        prefix = "F";
        break;
      case "Male":
        prefix = "M";
        break;
      case "Mixed":
        prefix = "MF";
        break;
      default:
        throw new Error("Invalid center type");
    }

    // Generate the new affiliation number
    const newAffiliationNo = `${prefix}${newNumber}/25`;

    await session.commitTransaction();
    session.endSession();

    return newAffiliationNo;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Function to register a new center
const registerNewCenter = async (centerData) => {
  try {
    // Generate the affiliation number based on center type
    const affiliationNo = await generateAffiliationNumber(centerData.centerType);

    // Add the generated affiliation number to the center data
    centerData.affiliationNo = affiliationNo;

    // Create a new center registration
    const newCenter = new CenterRegistration(centerData);
    await newCenter.save();
  } catch (error) {
    console.error("Error registering new center:", error);
  }
};

exports.getCentersByArea = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.query.area)) {
      return res.status(200).json([]);
    }
    const items = await CenterRegistration.find({ area: req.query.area ?? "" }, { _id: 0, id: "$_id", value: "$nameOfCenter" }).populate("area");
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

// @desc      BULK REASSIGN DISTRICT
// @route     PATCH /api/v1/center-registration/bulk-district
// @access    protected (State Admin)
// body: { updates: [{ id, district }] }  OR  { ids: [...], district }
exports.bulkReassignDistrict = async (req, res) => {
  try {
    const { updates, ids, district } = req.body || {};
    let ops = [];
    if (Array.isArray(updates) && updates.length) {
      ops = updates
        .filter((u) => mongoose.isValidObjectId(u.id) && mongoose.isValidObjectId(u.district))
        .map((u) => ({
          updateOne: { filter: { _id: u.id }, update: { $set: { district: u.district } } },
        }));
    } else if (Array.isArray(ids) && ids.length && mongoose.isValidObjectId(district)) {
      ops = ids
        .filter((id) => mongoose.isValidObjectId(id))
        .map((id) => ({
          updateOne: { filter: { _id: id }, update: { $set: { district: district } } },
        }));
    }
    if (!ops.length) {
      return res.status(400).json({ success: false, message: "No valid updates supplied" });
    }
    const result = await CenterRegistration.bulkWrite(ops);
    res.status(200).json({
      success: true,
      message: `Reassigned ${result.modifiedCount} center(s)`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      REASSIGN DISTRICT FROM AREA (derive each center's district from its area's district)
// @route     POST /api/v1/center-registration/sync-district-from-area
// @access    protected (State Admin) — optionally scoped by ?district=<id>
exports.syncDistrictFromArea = async (req, res) => {
  try {
    const { district: scope } = req.query;
    const match = {};
    if (scope && mongoose.isValidObjectId(scope)) {
      match.district = new mongoose.Types.ObjectId(scope);
    }
    const centers = await CenterRegistration.find(match).populate("area");
    const ops = [];
    for (const c of centers) {
      if (!c.area || !c.area.district) continue;
      const shouldBe = c.area.district.toString();
      if (!c.district || c.district.toString() !== shouldBe) {
        ops.push({
          updateOne: { filter: { _id: c._id }, update: { $set: { district: shouldBe } } },
        });
      }
    }
    if (!ops.length) {
      return res.status(200).json({ success: true, message: "Already in sync", modifiedCount: 0 });
    }
    const result = await CenterRegistration.bulkWrite(ops);
    res.status(200).json({
      success: true,
      message: `Synced ${result.modifiedCount} center(s) from their areas`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};
