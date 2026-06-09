const FloatingSettings = require("../models/floatingMenuSettings");
const { default: mongoose } = require("mongoose");

// @desc      ADD USER TYPE
// @route     POST /api/user/exam-type
// @access    public
exports.addFloatingSettings = async (req, res) => {
  try {
    // Delete all existing data in the collection
    await FloatingSettings.deleteMany({});
    const response = await FloatingSettings.create(req.body);
    res.status(200).json({ success: true, message: `succefully added user type}`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET EXAM TYPE
// @route     GET /api/v1/exam-type
// @access    public
exports.getFloatingSettings = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await FloatingSettings.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific floatingSettings", response });
    }
    const query = searchkey
      ? {
          ...req.filter,
          floatingSettings: { $regex: searchkey, $options: "i" },
        }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && FloatingSettings.countDocuments(),
      parseInt(skip) === 0 && FloatingSettings.countDocuments(query),
      FloatingSettings.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);

    res.status(200).json({ success: true, message: `Retrieved all floatingSettings`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC FloatingSettings
// @route     PUT /api/user/exam-type
// @access    public
exports.updateFloatingSettings = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Settings id is required." });
    }

    const response = await FloatingSettings.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, message: `updated specific floatingSettings`, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC FloatingSettings
// @route     DELETE /api/user/exam-type
// @access    public
exports.deleteFloatingSettings = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await FloatingSettings.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific FloatingSettings`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET FloatingSettings
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await FloatingSettings.find({}, { _id: 0, id: "$_id", value: "$floatingSettings" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
