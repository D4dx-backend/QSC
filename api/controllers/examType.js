const ExamType = require("../models/examtype");
const { default: mongoose } = require("mongoose");

// @desc      ADD USER TYPE
// @route     POST /api/v1/exam-type
// @access    public
exports.addExamType = async (req, res) => {
  try {
    const response = await ExamType.create(req.body);
    res.status(200).json({ success: true, message: `succefully added user type}`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET EXAM TYPE
// @route     GET /api/v1/exam-type
// @access    public
exports.getExamType = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      let response = await ExamType.findById(id);

      // Modify the examType to only show text before the colon
     
      return res.status(200).json({ success: true, message: "Retrieved specific examType", response });
    }

    const query = searchkey ? { ...req.filter, examType: { $regex: searchkey, $options: "i" } } : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ExamType.countDocuments(),
      parseInt(skip) === 0 && ExamType.countDocuments(query),
      ExamType.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    // Modify the examType field in each record to show text only before the colon
    const modifiedData = data.map((item) => ({
      ...item._doc,
      examType: item.examType.split(":")[0].trim(),
    }));
    res.status(200).json({ success: true, message: `Retrieved all examType`, response: modifiedData, count: modifiedData.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC ExamType
// @route     PUT /api/v1/exam-type
// @access    public
exports.updateExamType = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await ExamType.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific examType`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC ExamType
// @route     DELETE /api/v1/exam-type
// @access    public
exports.deleteExamType = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await ExamType.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific ExamType`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET ExamType
// @route     GET /api/v1/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ExamType.find({}, { _id: 0, id: "$_id", value: "$examType" }).sort({ examType: 1 });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
