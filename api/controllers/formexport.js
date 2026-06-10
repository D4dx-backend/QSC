const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const ExamRegistration = require("../models/examRegistration");

exports.selectAndExport = async (req, res) => {
  try {
    const query = {
      ...(req.filter || {}),
      ...(req.user && req.user.districts ? { district: req.user.districts } : {}),
    };

    const items = await ExamRegistration.find(query)
      .populate("district", "district") // Populating district field with only the title
      .populate("area", "area") // Populating area field with only the title
      .populate("nameOfExamAppearingNow", "examType") // Populating area field with only the title
      .populate("CenterRegistration", "nameOfCenter") // Populating area field with only the title
      .populate("examCenter", "centerName") // Populating area field with only the title
      .select("-_id district area nameOfApplicant address pincode age mobileNumber educationalQualification feeDetails nameOfExamAppearingNow status CenterRegistration examCenter affiliation whatsappNumber ");

    // Transform the response to replace IDs with titles
    const transformedItems = items.map((item) => {
      const itemObject = item.toObject();
      return {
        ...itemObject,
        district: itemObject.district ? itemObject.district.district : null,
        area: itemObject.area ? itemObject.area.area : null,
        nameOfExamAppearingNow: itemObject.nameOfExamAppearingNow ? itemObject.nameOfExamAppearingNow.examType : null,
        CenterRegistration: itemObject.CenterRegistration ? itemObject.CenterRegistration.nameOfCenter : null,
        examCenter: itemObject.examCenter ? itemObject.examCenter.centerName : null,
      };
    });

    // Convert transformedItems to CSV
    const csvFields = ["district", "area", "nameOfApplicant", "address", "pincode", "age", "mobileNumber", "educationalQualification", "feeDetails", "nameOfExamAppearingNow", "status", "CenterRegistration", "examCenter", "affiliation", "whatsappNumber"];
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(transformedItems);

    // Define the file path
    const filePath = path.join(__dirname, "exported_data.csv");

    // Write CSV to file with UTF-8 BOM encoding
    fs.writeFileSync(filePath, "\uFEFF" + csv, "utf8");

    // Send the file as a download
    res.download(filePath, "exported_data.csv", (err) => {
      if (err) {
        console.log(err);
        errorLog(req, err);
        res.status(400).json({ success: false, message: err.toString() });
      } else {
        console.log("File successfully downloaded");
      }
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

exports.deduplicate = async (req, res) => {
  try {
    // Find all documents
    const allRecords = await ExamRegistration.find({});

    // Group records by mobileNumber and case-insensitive (uppercased) nameOfApplicant
    const groupedRecords = allRecords.reduce((acc, record) => {
      const key = `${record.mobileNumber}-${record.nameOfApplicant.toUpperCase()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {});

    // Find duplicates and delete them, keeping one of each
    const recordsToKeep = [];
    const recordsToDelete = [];

    for (const key in groupedRecords) {
      if (groupedRecords[key].length > 1) {
        recordsToKeep.push(groupedRecords[key][0]._id);
        for (let i = 1; i < groupedRecords[key].length; i++) {
          recordsToDelete.push(groupedRecords[key][i]._id);
        }
      }
    }

    // Delete duplicates
    await ExamRegistration.deleteMany({ _id: { $in: recordsToDelete } });

    res.status(200).json({ success: true, message: "Duplicates removed successfully", recordsKept: recordsToKeep, recordsDeleted: recordsToDelete });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.toString() });
  }
};
