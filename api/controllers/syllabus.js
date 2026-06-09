const Syllabus = require("../models/syllabus");
const { default: mongoose } = require("mongoose");

// @desc      ADD SYLLABUS
// @route     POST /api/v1/syllabus
// @access    public
exports.addSyllabus = async (req, res) => {
  try {
    const response = await Syllabus.create(req.body);
    res.status(200).json({ success: true, message: `Successfully added syllabus`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET SPECIFIC SYLLABUS
// @route     GET /api/v1/syllabus
// @access    protect
exports.getSyllabus = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Syllabus.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific syllabus", response });
    }

    const query = searchkey ? { ...req.filter, syllabus: { $regex: searchkey, $options: "i" } } : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Syllabus.countDocuments(),
      parseInt(skip) === 0 && Syllabus.countDocuments(query),
      Syllabus.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({ success: true, message: `Retrieved all syllabus`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC SYLLABUS
// @route     PUT /api/v1/syllabus
// @access    public
exports.updateSyllabus = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Syllabus.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `Updated specific syllabus`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC SYLLABUS
// @route     DELETE /api/v1/syllabus
// @access    public
exports.deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Syllabus.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `Deleted specific syllabus`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET SYLLABUS
// @route     GET /api/v1/syllabus/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Syllabus.find({}, { _id: 0, id: "$_id", value: "$syllabus" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
