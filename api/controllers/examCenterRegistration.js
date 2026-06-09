const { default: mongoose } = require("mongoose");
const ExamCenterRegistration = require("../models/examCenterRegistration");
const ExamRegistration = require("../models/examRegistration");

// @desc      CREATE NEW ExamCenter Registration
// @route     POST /api/v1/exam-center-registration
// @access    protect

exports.createExamCenterRegistration = async (req, res) => {
  try {
    const newExamCenterRegistration = await ExamCenterRegistration.create(req.body);
    res.status(200).json({ success: true, message: "ExamCenterRegistration created successfully", data: newExamCenterRegistration });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET ALL ExamCenter Registration
// @route     GET /api/v1/exam-center-registration
// @access    public
exports.getExamCenterRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const query = {
      ...req.filter,
      ...(req.user.districts ? { district: req.user.districts } : {}),
      ...(searchkey && { centerName: { $regex: searchkey, $options: "i" } }),
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ExamCenterRegistration.countDocuments(),
      parseInt(skip) === 0 && ExamCenterRegistration.countDocuments(query),
      ExamCenterRegistration.find(query)
        .populate("district")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ district: 1 }),
    ]);

    // Get candidate counts for each exam center
    const centerIds = data.map(center => center._id);
    
    const candidateCounts = await ExamRegistration.aggregate([
      {
        $match: {
          examCenter: { $in: centerIds }
        }
      },
      {
        $group: {
          _id: "$examCenter",
          maleCount: {
            $sum: {
              $cond: [{ $eq: ["$gender", "Male"] }, 1, 0]
            }
          },
          femaleCount: {
            $sum: {
              $cond: [{ $eq: ["$gender", "Female"] }, 1, 0]
            }
          },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    // Create a map for quick lookup
    const countsMap = {};
    candidateCounts.forEach(count => {
      countsMap[count._id.toString()] = {
        maleCount: count.maleCount,
        femaleCount: count.femaleCount,
        totalCount: count.totalCount
      };
    });

    // Add candidate counts to each exam center
    const dataWithCounts = data.map(center => {
      const centerId = center._id.toString();
      const counts = countsMap[centerId] || { maleCount: 0, femaleCount: 0, totalCount: 0 };
      
      return {
        ...center.toObject(),
        maleCount: counts.maleCount,
        femaleCount: counts.femaleCount,
        totalCount: counts.totalCount
      };
    });

    res.status(200).json({ 
      success: true, 
      message: "Retrieved all examCenterRegistration ", 
      response: dataWithCounts, 
      count: dataWithCounts.length, 
      totalCount: totalCount || 0, 
      filterCount: filterCount || 0 
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC ExamCenter Registration
// @route     PUT /api/v1/exam-center-registration/:id
// @access    protect
exports.updateExamCenterRegistration = async (req, res) => {
  try {
    const examCenterRegistration = await ExamCenterRegistration.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!examCenterRegistration) {
      return res.status(404).json({ success: false, message: " ExamCenterRegistration not found" });
    }

    res.status(200).json({ success: true, message: "ExamCenterRegistration updated successfully", data: examCenterRegistration });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC ExamCenter Registration
// @route     DELETE /api/v1/exam-center-registration/:id
// @access    protect
exports.deleteExamCenterRegistration = async (req, res) => {
  try {
    const examCenterRegistration = await ExamCenterRegistration.findByIdAndDelete(req.query.id);

    if (!examCenterRegistration) {
      return res.status(404).json({ success: false, message: "ExamCenterRegistration not found" });
    }

    res.status(200).json({ success: true, message: "ExamCenterRegistration deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET CUSTOMER TYPE
// @route     GET /api/v1/exam-center-registration/select
// @access    public
exports.select = async (req, res) => {
  try {
    const items = await ExamCenterRegistration.find({}, { _id: 0, id: "$_id", value: "$centerName" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

exports.getCenterByDistrict = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.query.district)) {
      return res.status(200).json([]);
    }
    const items = await ExamCenterRegistration.find({ district: req.query.district ?? "" }, { _id: 0, id: "$_id", value: "$centerName" }).populate("district");
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};
