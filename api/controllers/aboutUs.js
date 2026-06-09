const { default: mongoose } = require("mongoose");
const AboutUs = require("../models/aboutUsPage");

// @desc      CREATE NEW aboutUs
// @route     POST /api/v1/about-us
// @access    protect

exports.createAboutUs = async (req, res) => {
  try {
    const newAboutUs = await AboutUs.create(req.body);
    res.status(200).json({ success: true, message: "AboutUs created successfully", data: newAboutUs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET ALL AboutUs
// @route     GET /api/v1/about-us
// @access    public
exports.getAboutUs = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const query = searchkey ? { ...req.filter, title: { $regex: searchkey, $options: "i" } } : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && AboutUs.countDocuments(),
      parseInt(skip) === 0 && AboutUs.countDocuments(query),
      AboutUs.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({ success: true, message: "Retrieved all AboutUs ", response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC AboutUs
// @route     PUT /api/v1/about-us/:id
// @access    protect
exports.updateAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!aboutUs) {
      return res.status(404).json({ success: false, message: " AboutUs not found" });
    }

    res.status(200).json({ success: true, message: "AboutUs updated successfully", data: aboutUs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC AboutUs
// @route     DELETE /api/v1/about-us/:id
// @access    protect
exports.deleteAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndDelete(req.query.id);

    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "AboutUs not found" });
    }

    res.status(200).json({ success: true, message: "AboutUs deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET CUSTOMER TYPE
// @route     GET /api/v1/about-us/select
// @access    public
exports.select = async (req, res) => {
  try {
    const items = await AboutUs.find({}, { _id: 0, id: "$_id", value: "$title" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};
