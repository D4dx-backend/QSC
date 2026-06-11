const District = require("../models/district");
const Area = require("../models/area");
const CenterRegistration = require("../models/centerRegistration");
const ExamRegistration = require("../models/examRegistration");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const emptyCenterStats = {
  studyCenterCount: 0,
  maleCenterCount: 0,
  femaleCenterCount: 0,
  mixedCenterCount: 0,
  maleStudentCount: 0,
  femaleStudentCount: 0,
  totalStudents: 0,
};

async function aggregateCenterStatsByDistrict(districtIds = []) {
  if (!districtIds.length) return new Map();

  const rows = await CenterRegistration.aggregate([
    { $match: { district: { $in: districtIds } } },
    {
      $addFields: {
        maleInt: { $convert: { input: "$studentsCountMale", to: "int", onError: 0, onNull: 0 } },
        femaleInt: { $convert: { input: "$studentsCountFemale", to: "int", onError: 0, onNull: 0 } },
      },
    },
    {
      $group: {
        _id: "$district",
        studyCenterCount: { $sum: 1 },
        maleCenterCount: {
          $sum: { $cond: [{ $eq: ["$centerType", "Male"] }, 1, 0] },
        },
        femaleCenterCount: {
          $sum: { $cond: [{ $eq: ["$centerType", "Female"] }, 1, 0] },
        },
        mixedCenterCount: {
          $sum: { $cond: [{ $eq: ["$centerType", "Mixed"] }, 1, 0] },
        },
        maleStudentCount: { $sum: "$maleInt" },
        femaleStudentCount: { $sum: "$femaleInt" },
        totalStudents: { $sum: { $add: ["$maleInt", "$femaleInt"] } },
      },
    },
  ]);

  return new Map(
    rows.map((item) => [
      String(item._id),
      {
        studyCenterCount: item.studyCenterCount || 0,
        maleCenterCount: item.maleCenterCount || 0,
        femaleCenterCount: item.femaleCenterCount || 0,
        mixedCenterCount: item.mixedCenterCount || 0,
        maleStudentCount: item.maleStudentCount || 0,
        femaleStudentCount: item.femaleStudentCount || 0,
        totalStudents: item.totalStudents || 0,
      },
    ])
  );
}

// @desc      ADD District
// @route     POST /api/user/district
// @access    public
exports.addDistrict = async (req, res) => {
  try {
    const response = await District.create(req.body);
    res.status(200).json({ success: true, message: `succefully added district`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET SPECIFIC District
// @route     GET /api/user/district
// @access    protect
exports.getDistrict = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const [response, areaCount, centerStatsMap] = await Promise.all([
        District.findById(id).lean(),
        Area.countDocuments({ district: id }),
        aggregateCenterStatsByDistrict([new mongoose.Types.ObjectId(id)]),
      ]);
      const centerStats = centerStatsMap.get(String(id)) || emptyCenterStats;
      return res.status(200).json({
        success: true,
        message: "Retrieved specific District",
        response: response
          ? {
              ...response,
              areaCount,
              ...centerStats,
            }
          : response,
      });
    }
    const query = searchkey ? { ...req.filter, district: { $regex: searchkey, $options: "i" } } : req.filter;
    const [totalCount, filterCount, districts] = await Promise.all([
      parseInt(skip) === 0 && District.countDocuments(),
      parseInt(skip) === 0 && District.countDocuments(query),
      District.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 })
        .lean(),
    ]);

    const districtIds = districts.map((item) => item._id);
    const [centerStatsMap, areaCounts] = districtIds.length
      ? await Promise.all([
          aggregateCenterStatsByDistrict(districtIds),
          Area.aggregate([
            { $match: { district: { $in: districtIds } } },
            { $group: { _id: "$district", count: { $sum: 1 } } },
          ]),
        ])
      : [new Map(), []];

    const areaCountMap = new Map(areaCounts.map((item) => [String(item._id), item.count]));

    const data = districts.map((item) => ({
      ...item,
      areaCount: areaCountMap.get(String(item._id)) || 0,
      ...(centerStatsMap.get(String(item._id)) || emptyCenterStats),
    }));

    res.status(200).json({ success: true, message: `Retrieved all Districts`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC District
// @route     PUT /api/user/district
// @access    public
exports.updateDistrict = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await District.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific District`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC District
// @route     DELETE /api/user/district
// @access    public
exports.deleteDistrict = async (req, res) => {
  try {
    const { id, reason = "" } = req.query;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Valid district id is required." });
    }

    const districtId = new mongoose.Types.ObjectId(id);
    const [district, areaCount, centerCount, examRegistrationCount, userCount] = await Promise.all([
      District.findById(id),
      Area.countDocuments({ district: districtId }),
      CenterRegistration.countDocuments({ district: districtId }),
      ExamRegistration.countDocuments({ district: districtId }),
      User.countDocuments({ districts: id }),
    ]);

    if (!district) {
      return res.status(404).json({ success: false, message: "District not found." });
    }

    if (areaCount || centerCount || examRegistrationCount || userCount) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete district with linked data. Areas: ${areaCount}, Centres: ${centerCount}, Registrations: ${examRegistrationCount}, Users: ${userCount}.`,
        counts: {
          areaCount,
          centerCount,
          examRegistrationCount,
          userCount,
        },
      });
    }

    const response = await District.findByIdAndDelete(id);
    if (reason) {
      console.log(`District deleted: ${response?.district || id}; reason: ${reason}`);
    }
    res.status(200).json({ success: true, message: `deleted specific District`, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET District
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await District.find(req.filter || {}, { _id: 0, id: "$_id", value: "$district" }).sort({ district: 1 });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
