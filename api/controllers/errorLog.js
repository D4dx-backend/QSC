const { default: mongoose } = require("mongoose");
const ErrorLog = require("../models/errorLog");
const { errorLog } = require("../utils/errorLog");

//@desc ADD ERROR LOG
//@route POST/api/error-log
//@access public
exports.addErrorLog = async (req, res, err) => {
  console.log({ req, res, err });
  try {
    const response = await ErrorLog.create(req.body);
    res.status(200).json({
      success: true,
      message: `Successfully added error log`,
      response,
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

// @desc      GET SPECIFIC ERROR LOG & ALL ERROR LOGS
// @route     GET /api/error-log
// @access    public
exports.getErrorLog = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await ErrorLog.findById(id).populate("franchise").populate("addedBy");
      return res.status(200).json({
        success: true,
        message: `Retrieved  specific error log`,
        response,
      });
    }
    const query = searchkey
      ? {
        ...req.filter,
        date: { $regex: searchkey, $options: "i" },
      }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ErrorLog.countDocuments(),
      parseInt(skip) === 0 && ErrorLog.countDocuments(query),
      ErrorLog.find(query)
        .populate("user")
        .populate("franchise").populate("addedBy")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 40)
        .sort({ _id: -1 }),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved  all error log`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC ERROR LOG
// @route     PUT /api/error-log
// @access    portect
exports.updateErrorLog = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await ErrorLog.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `Updated Specific error log`,
      response,
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

// @desc      DELETE SPECIFIC ERROR LOG
// @route     DELETE /api/error-log
// @access    portect
exports.deleteErrorLog = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await ErrorLog.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Deleted specific error log`,
      response,
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

// @desc      GET ERROR LOG
// @route     GET /api/error-log/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ErrorLog.find(
      {},
      { _id: 0, id: "$_id", value: "$page" }
    );
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
