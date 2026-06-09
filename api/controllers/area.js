const Area = require("../models/area");
const CenterRegistration = require("../models/centerRegistration");
const { default: mongoose } = require("mongoose");

const emptyAreaStats = {
  studyCenterCount: 0,
  maleCenterCount: 0,
  femaleCenterCount: 0,
  mixedCenterCount: 0,
  maleStudentCount: 0,
  femaleStudentCount: 0,
  totalStudents: 0,
};

async function aggregateCenterStatsByArea(areaIds = []) {
  if (!areaIds.length) return new Map();

  const rows = await CenterRegistration.aggregate([
    { $match: { area: { $in: areaIds } } },
    {
      $addFields: {
        maleInt: { $convert: { input: "$studentsCountMale", to: "int", onError: 0, onNull: 0 } },
        femaleInt: { $convert: { input: "$studentsCountFemale", to: "int", onError: 0, onNull: 0 } },
      },
    },
    {
      $group: {
        _id: "$area",
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

function sortAreaRows(rows = [], sortBy = "_id", sortOrder = "desc") {
  const direction = sortOrder === "asc" ? 1 : -1;
  const getNumber = (value) => Number(value || 0);

  return [...rows].sort((left, right) => {
    switch (sortBy) {
      case "area":
        return String(left.area || "").localeCompare(String(right.area || "")) * direction;
      case "studyCenterCount":
        return (getNumber(left.studyCenterCount) - getNumber(right.studyCenterCount)) * direction;
      case "maleCenterCount":
        return (getNumber(left.maleCenterCount) - getNumber(right.maleCenterCount)) * direction;
      case "femaleCenterCount":
        return (getNumber(left.femaleCenterCount) - getNumber(right.femaleCenterCount)) * direction;
      case "mixedCenterCount":
        return (getNumber(left.mixedCenterCount) - getNumber(right.mixedCenterCount)) * direction;
      case "maleStudentCount":
        return (getNumber(left.maleStudentCount) - getNumber(right.maleStudentCount)) * direction;
      case "femaleStudentCount":
        return (getNumber(left.femaleStudentCount) - getNumber(right.femaleStudentCount)) * direction;
      case "totalStudents":
        return (getNumber(left.totalStudents) - getNumber(right.totalStudents)) * direction;
      case "_id":
      default:
        return String(left._id || "").localeCompare(String(right._id || "")) * direction;
    }
  });
}

// @desc      ADD AREA
// @route     POST /api/user/area
// @access    public
exports.addArea = async (req, res) => {
  try {
    const response = await Area.create(req.body);
    res.status(200).json({ success: true, message: `succefully added area`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET SPECIFIC AREA
// @route     GET /api/user/area
// @access    protect
exports.getArea = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, sortBy = "_id", sortOrder = "desc" } = req.query;
    const parsedSkip = parseInt(skip) || 0;
    const parsedLimit = parseInt(limit) || 50;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Area.findById(id).populate("district").lean();
      const statsMap = await aggregateCenterStatsByArea([new mongoose.Types.ObjectId(id)]);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Area",
        response: response
          ? {
              ...response,
              ...(statsMap.get(String(id)) || emptyAreaStats),
            }
          : response,
      });
    }

    const query = {
      ...req.filter,
      ...(req.user.districts ? { district: req.user.districts } : {}),
      ...(searchkey && { area: { $regex: searchkey, $options: "i" } }),
    };

    const [totalCount, filterCount, areas] = await Promise.all([
      Area.countDocuments(),
      Area.countDocuments(query),
      Area.find(query)
        .populate("district")
        .lean(),
    ]);

    const areaIds = areas.map((item) => item._id);
    const areaStatsMap = await aggregateCenterStatsByArea(areaIds);

    const enrichedRows = areas.map((item) => ({
      ...item,
      ...(areaStatsMap.get(String(item._id)) || emptyAreaStats),
    }));

    const summary = enrichedRows.reduce(
      (acc, item) => {
        acc.studyCenterCount += Number(item.studyCenterCount || 0);
        acc.maleCenterCount += Number(item.maleCenterCount || 0);
        acc.femaleCenterCount += Number(item.femaleCenterCount || 0);
        acc.mixedCenterCount += Number(item.mixedCenterCount || 0);
        acc.maleStudentCount += Number(item.maleStudentCount || 0);
        acc.femaleStudentCount += Number(item.femaleStudentCount || 0);
        acc.totalStudents += Number(item.totalStudents || 0);
        return acc;
      },
      { ...emptyAreaStats }
    );

    const sortedRows = sortAreaRows(enrichedRows, sortBy, sortOrder);
    const data = sortedRows.slice(parsedSkip, parsedSkip + parsedLimit);

    res.status(200).json({
      success: true,
      message: `Retrieved all Area`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
      summary,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC Area
// @route     PUT /api/user/area
// @access    public
exports.updateArea = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Area.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific Area`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC Area
// @route     DELETE /api/user/area
// @access    public
exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Valid area id is required." });
    }

    const centerCount = await CenterRegistration.countDocuments({ area: id });
    if (centerCount) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete area with linked study centres. Centres: ${centerCount}.`,
      });
    }

    const response = await Area.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific Area`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET Area
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Area.find(req.filter || {}, { _id: 0, id: "$_id", value: "$area" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

exports.getAreaByDistrict = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.query.district)) {
      return res.status(200).json([]);
    }
    const items = await Area.find({ district: req.query.district ?? "" }, { _id: 0, id: "$_id", value: "$area" }).populate("district");
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};
