const ResultAndCertificates = require("../models/resultAndCertificates");
const { default: mongoose } = require("mongoose");

// @desc      ADD Result And Certificates
// @route     POST /api/user/result-certificates
// @access    public
exports.addResultAndCertificates = async (req, res) => {
  try {
    const response = await ResultAndCertificates.create(req.body);
    res.status(200).json({ success: true, message: `succefully added ResultAndCertificates`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET SPECIFIC Result And Certificates
// @route     GET /api/user/result-certificates
// @access    protect
exports.getResultAndCertificates = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await ResultAndCertificates.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific ResultAndCertificates", response });
    }
    const query = searchkey ? { ...req.filter, district: { $regex: searchkey, $options: "i" } } : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ResultAndCertificates.countDocuments(),
      parseInt(skip) === 0 && ResultAndCertificates.countDocuments(query),
      ResultAndCertificates.find(query)
        .populate("hallTicket")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({ success: true, message: `Retrieved all ResultAndCertificates`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC Result And Certificates
// @route     PUT /api/user/result-certificates
// @access    public
exports.updateResultAndCertificates = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await ResultAndCertificates.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific Result And Certificates`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC Result And Certificates
// @route     DELETE /api/user/result-certificates
// @access    public
exports.deleteResultAndCertificates = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await ResultAndCertificates.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific Result And Certificates`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET Result And Certificates
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ResultAndCertificates.find({}, { _id: 0, id: "$_id", value: "$registerNo" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
