const examRegistration = require("../models/examRegistration");
const ExamScore = require("../models/examScore");
const { default: mongoose } = require("mongoose");
const ExamType = require("../models/examtype");
const Area = require("../models/area");
const District = require("../models/district");

// @desc      ADD EXAM SCORE
// @route     POST /api/v1/exam-score
// @access    public
exports.addExamScore = async (req, res) => {
  try {
    // Check if the exam score already exists
    const existingScore = await ExamScore.findOne({
      student: req.body.student, // Update this according to your schema
      exam: req.body.exam, // Adjust the fields as necessary
    });

    if (existingScore) {
      return res.status(400).json({ success: false, customMessage: "Exam score already exists for this student and exam." });
    }

    // Create the new exam score with grade
    const score = req.body.score;
    const grade = calculateGrade(score);
    const response = await ExamScore.create({
      ...req.body,
      grade, // Add the grade to the document
    });

    res.status(201).json({ success: true, message: "Successfully added exam score", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred while adding the exam score.", error: err.message });
  }
};

// @desc      GET EXAM SCORE
// @route     GET /api/v1/exam-score
// @access    public
exports.getExamScore = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    const userDistrictId = req.user.districts;

    // Check if a specific exam score is requested
    if (id && mongoose.isValidObjectId(id)) {
      const response = await ExamScore.findById(id).populate("student").populate("exam");
      return res.status(200).json({ success: true, message: "Retrieved specific exam score", response });
    }

    // Build the query for exam scores
    let query = { ...req.filter };

    // If searchkey provided, search by candidate name, exam name, or score
    if (searchkey) {
      const isNumericSearch = !isNaN(searchkey);

      // Find matching student ids by candidate name and registration number
      const matchedStudentIds = await examRegistration
        .find({
          $or: [{ nameOfApplicant: { $regex: searchkey, $options: "i" } }, { regno: { $regex: searchkey, $options: "i" } }],
        })
        .distinct("_id");

      // Find matching exam ids by examType label
      const matchedExamIds = await ExamType.find({ examType: { $regex: searchkey, $options: "i" } }).distinct("_id");

      const orConditions = [];
      if (matchedStudentIds.length > 0) orConditions.push({ student: { $in: matchedStudentIds } });
      if (matchedExamIds.length > 0) orConditions.push({ exam: { $in: matchedExamIds } });
      // For numeric search, match score by equality since score is a Number
      if (isNumericSearch) {
        orConditions.push({ score: Number(searchkey) });
      }

      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
    }

    // Add the district condition if req.user.districts exists
    if (userDistrictId) {
      // Find student IDs within the specific district
      const districtStudentIds = await examRegistration.find({ district: userDistrictId }).distinct("_id");

      // Enforce district scoping on student
      if (query.$or) {
        query = { $and: [{ $or: query.$or }, { student: { $in: districtStudentIds } }] };
      } else {
        query.student = { $in: districtStudentIds };
      }
    }

    // District-based filtering - if district is provided, filter areas by district first
    let districtAreaIds = [];
    if (req.filter && req.filter.district) {
      const rawDistrict = req.filter.district;

      let matchedDistrictIds = [];
      // Accept both ObjectId (exact) and string (regex on District.district)
      if (mongoose.isValidObjectId(rawDistrict)) {
        matchedDistrictIds = [new mongoose.Types.ObjectId(rawDistrict)];
      } else if (typeof rawDistrict === "string") {
        matchedDistrictIds = await District.find({ district: { $regex: rawDistrict, $options: "i" } }, { _id: 1 }).distinct("_id");
      }

      if (matchedDistrictIds.length > 0) {
        // Find areas within the selected district(s)
        districtAreaIds = await Area.find({ district: { $in: matchedDistrictIds } }, { _id: 1 }).distinct("_id");
      } else {
        // No matching districts → ensure empty result set
        query._id = { $exists: false };
      }

      // Remove raw district filter key from the query baseline if present
      if (query.district) delete query.district;
    }

    // Area-based filtering (case-insensitive, regex match on Area name via ExamRegistration.area)
    // If district filter is applied, only search within areas of that district
    if (req.filter && req.filter.area) {
      const rawArea = req.filter.area;

      let matchedAreaIds = [];
      // Accept both ObjectId (exact) and string (regex on Area.area)
      if (mongoose.isValidObjectId(rawArea)) {
        matchedAreaIds = [new mongoose.Types.ObjectId(rawArea)];
      } else if (typeof rawArea === "string") {
        // If district filter is applied, search only within district areas
        const areaQuery = { area: { $regex: rawArea, $options: "i" } };
        if (districtAreaIds.length > 0) {
          areaQuery._id = { $in: districtAreaIds };
        }
        matchedAreaIds = await Area.find(areaQuery, { _id: 1 }).distinct("_id");
      }

      if (matchedAreaIds.length > 0) {
        // Find student ids (ExamRegistration docs) within these areas
        const studentsInAreas = await examRegistration.find({ area: { $in: matchedAreaIds } }).distinct("_id");

        if (Array.isArray(query.$and)) {
          query.$and.push({ student: { $in: studentsInAreas } });
        } else if (query.$or) {
          query = { $and: [{ $or: query.$or }, { student: { $in: studentsInAreas } }] };
        } else {
          query.student = { $in: studentsInAreas };
        }
      } else {
        // No matching areas → ensure empty result set
        query._id = { $exists: false };
      }

      // Remove raw area filter key from the query baseline if present
      if (query.area) delete query.area;
    } else if (districtAreaIds.length > 0) {
      // If only district filter is applied (no area filter), filter by district areas
      const studentsInDistrictAreas = await examRegistration.find({ area: { $in: districtAreaIds } }).distinct("_id");

      if (Array.isArray(query.$and)) {
        query.$and.push({ student: { $in: studentsInDistrictAreas } });
      } else if (query.$or) {
        query = { $and: [{ $or: query.$or }, { student: { $in: studentsInDistrictAreas } }] };
      } else {
        query.student = { $in: studentsInDistrictAreas };
      }
    }

    // Phase 3 — Private/Regular filter. Admin UI sends `studentStatus=Private|Regular`;
    // we resolve it to student ids on ExamRegistration and AND it into the score query.
    if (req.filter && (req.filter.studentStatus === "Private" || req.filter.studentStatus === "Regular")) {
      const idsByStatus = await examRegistration.find({ status: req.filter.studentStatus }).distinct("_id");
      if (Array.isArray(query.$and)) {
        query.$and.push({ student: { $in: idsByStatus } });
      } else if (query.$or) {
        query = { $and: [{ $or: query.$or }, { student: { $in: idsByStatus } }] };
      } else if (query.student && query.student.$in) {
        query.student.$in = query.student.$in.filter((id) => idsByStatus.some((x) => String(x) === String(id)));
      } else {
        query.student = { $in: idsByStatus };
      }
    }
    if (query.studentStatus) delete query.studentStatus;

    // Execute the queries
    const [totalCount, filterCount, data] = await Promise.all([
      ExamScore.countDocuments(),
      ExamScore.countDocuments(query),
      ExamScore.find(query)
        .populate({
          path: "student",
          populate: [
            { path: "district", select: "district" },
            { path: "area", select: "area" },
            { path: "centerRegistration", select: "nameOfCenter centerCode" },
          ],
        })
        .populate("exam")
        .lean()
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10)
        .sort({ _id: -1 }),
    ]);

    // Add serial number to each record based on pagination
    const baseIndex = parseInt(skip) || 0;
    const dataWithSerial = Array.isArray(data) ? data.map((doc, index) => ({ ...doc, slno: baseIndex + index + 1 })) : [];

    res.status(200).json({ success: true, message: `Retrieved all exam scores`, response: dataWithSerial, count: dataWithSerial.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC EXAM SCORE
// @route     PUT /api/v1/exam-score
// @access    public
exports.updateExamScore = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await ExamScore.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific exam score`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC EXAM SCORE
// @route     DELETE /api/v1/exam-score
// @access    public
exports.deleteExamScore = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await ExamScore.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific exam score`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET EXAM SCORE
// @route     GET /api/v1/exam-score/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ExamScore.find({}, { _id: 0, id: "$_id", value: "$score" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// Grading function based on score
const calculateGrade = (score) => {
  if (score >= 90 && score <= 100) {
    return "A+";
  } else if (score >= 80 && score <= 89) {
    return "A";
  } else if (score >= 70 && score <= 79) {
    return "B+";
  } else if (score >= 60 && score <= 69) {
    return "B";
  } else if (score >= 50 && score <= 59) {
    return "C+";
  } else if (score >= 40 && score <= 49) {
    return "C";
  } else if (score >= 1 && score <= 39) {
    return "D+";
  } else {
    return "Grade Not Published"; // Handle invalid scores
  }
};

// API to get areas by district
exports.getAreasByDistrict = async (req, res) => {
  try {
    const { districtId } = req.query;

    if (!districtId) {
      return res.status(400).json({ success: false, message: "District ID is required" });
    }

    // Validate if districtId is a valid ObjectId
    if (!mongoose.isValidObjectId(districtId)) {
      return res.status(400).json({ success: false, message: "Invalid District ID format" });
    }

    // Find areas within the specified district
    const areas = await Area.find({ district: districtId }).populate("district", "district code").select("_id area district").sort({ area: 1 });

    res.status(200).json({
      success: true,
      message: "Retrieved areas by district",
      response: areas,
      count: areas.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving areas by district", error: error.message });
  }
};

// API to update bulk grades in ExamScore
exports.updateGradesForExamScores = async (req, res) => {
  try {
    // Fetch all exam scores that need grade calculation
    const examScores = await ExamScore.find({});

    // Update each student's grade based on the score
    const bulkOperations = examScores.map((examScore) => {
      const newGrade = calculateGrade(examScore.score);

      return {
        updateOne: {
          filter: { _id: examScore._id }, // Find by exam score ID
          update: { grade: newGrade }, // Update the grade
        },
      };
    });

    // Perform bulk update operation
    const result = await ExamScore.bulkWrite(bulkOperations);

    // Return the number of modified records
    return res.status(200).json({ message: "Grades updated successfully!", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating grades", error });
  }
};
