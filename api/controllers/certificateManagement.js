const { default: mongoose } = require("mongoose");
const CertificateManagement = require("../models/certificateManagement");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW CERTIFICATE MANAGEMENT
// @route     POST /api/v1/certificate-management
// @access    protect
// Phase 3 — added P/R-split state/district slots.
const CERTIFICATE_FIELDS = [
  "hallTicket",
  "examCertificate",
  "stateExamCertificate",
  "districtExamCertificate",
  "stateExamCertificateRegular",
  "stateExamCertificatePrivate",
  "districtExamCertificateRegular",
  "districtExamCertificatePrivate",
  "affiliationCertificate",
];

exports.createCertificateManagement = async (req, res) => {
  try {
    // Clean and validate the request body
    const certificateFields = CERTIFICATE_FIELDS;
    const cleanData = {};

    certificateFields.forEach((field) => {
      const value = req.body[field];
      // Only include fields that have valid string values
      if (value && typeof value === "string" && value.trim() !== "") {
        cleanData[field] = value.trim();
      }
    });

    // Only create if there's at least one certificate field
    if (Object.keys(cleanData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one certificate field must be provided",
      });
    }

    const newCertificateManagement = await CertificateManagement.create(cleanData);
    res.status(200).json({
      success: true,
      message: "Certificate Management created successfully",
      data: newCertificateManagement,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL CERTIFICATE MANAGEMENT
// @route     GET /api/v1/certificate-management
// @access    public
exports.getCertificateManagement = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await CertificateManagement.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific certificate management",
        response,
      });
    }
    const query = searchkey ? { ...req.filter, hallTicket: { $regex: searchkey, $options: "i" } } : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && CertificateManagement.countDocuments(),
      parseInt(skip) === 0 && CertificateManagement.countDocuments(query),
      CertificateManagement.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all certificate management`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC CERTIFICATE MANAGEMENT
// @route     PUT /api/v1/certificate-management/:id
// @access    protect
exports.updateCertificateManagement = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the current document to preserve metadata
    const currentDoc = await CertificateManagement.findById(id);
    if (!currentDoc) {
      return res.status(404).json({
        success: false,
        message: "Certificate Management not found",
      });
    }

    // Create update object with only the fields that should be updated
    const updateData = {};

    // Only include certificate fields that exist in the request body
    const certificateFields = CERTIFICATE_FIELDS;
    certificateFields.forEach((field) => {
      const value = req.body[field];
      if (value !== undefined) {
        // Only include valid string values
        if (value && typeof value === "string" && value.trim() !== "") {
          updateData[field] = value.trim();
        } else if (value === null || value === "") {
          // Set to null to remove the field
          updateData[field] = null;
        }
      }
    });

    // If no certificate fields are provided, remove all certificate fields
    if (Object.keys(updateData).length === 0) {
      // Use $unset to remove all certificate fields
      const unsetFields = {};
      certificateFields.forEach((field) => {
        unsetFields[field] = 1;
      });
      updateData.$unset = unsetFields;
    } else {
      // If we have fields to update, we need to unset the fields that are not in the request
      const fieldsToUnset = {};
      certificateFields.forEach((field) => {
        if (req.body[field] === undefined && currentDoc[field]) {
          fieldsToUnset[field] = 1;
        }
      });
      if (Object.keys(fieldsToUnset).length > 0) {
        updateData.$unset = fieldsToUnset;
      }
    }

    const certificateManagement = await CertificateManagement.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Certificate Management updated successfully",
      data: certificateManagement,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC CERTIFICATE MANAGEMENT
// @route     DELETE /api/v1/certificate-management/:id
// @access    protect
exports.deleteCertificateManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const certificateManagement = await CertificateManagement.findByIdAndDelete(id);
    if (!certificateManagement) {
      return res.status(404).json({
        success: false,
        message: "Certificate Management not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Certificate Management deleted successfully",
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET CERTIFICATE MANAGEMENT
// @route     GET /api/v1/certificate-management/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await CertificateManagement.find({}, { _id: 0, id: "$_id", value: "$hallTicket" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPSERT A SINGLE CERTIFICATE FIELD
// @route     PUT /api/v1/certificate-management/upsert-field
// @access    protect
exports.upsertField = async (req, res) => {
  try {
    const { field } = req.body;

    if (!field || !CERTIFICATE_FIELDS.includes(field)) {
      return res.status(400).json({ success: false, message: "Invalid certificate field" });
    }

    // Only accept the value that came through the upload middleware
    const value = req.body[field];
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ success: false, message: "A file must be provided" });
    }

    // Find the single document or create one
    let doc = await CertificateManagement.findOne();
    if (!doc) {
      doc = await CertificateManagement.create({ [field]: value.trim() });
    } else {
      doc[field] = value.trim();
      await doc.save();
    }

    res.status(200).json({ success: true, message: "Certificate updated successfully", data: doc });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE A SINGLE CERTIFICATE FIELD
// @route     PUT /api/v1/certificate-management/delete-field
// @access    protect
exports.deleteField = async (req, res) => {
  try {
    const { field } = req.body;

    if (!field || !CERTIFICATE_FIELDS.includes(field)) {
      return res.status(400).json({ success: false, message: "Invalid certificate field" });
    }

    const doc = await CertificateManagement.findOne();
    if (!doc) {
      return res.status(404).json({ success: false, message: "No certificate document found" });
    }

    doc[field] = undefined;
    await doc.save();

    res.status(200).json({ success: true, message: "Certificate field removed successfully", data: doc });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};
