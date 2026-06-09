const OldQuestionPaper = require("../models/oldQuestionPapers");
const { default: mongoose } = require("mongoose");

// @desc      ADD OLD QUESTION PAPERS
// @access    public
exports.addOldQuestionPaper = async (req, res) => {
  try {
    const response = await OldQuestionPaper.create(req.body);
    res.status(200).json({ success: true, message: `succefully added oldQuestionPaper`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET OLD QUESTION PAPERS
// @route     GET /api/v1/old-question-papers
// @access    public
exports.getOldQuestionPaper = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await OldQuestionPaper.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific oldQuestionPaper", response });
    }
    const query = searchkey ? { ...req.filter, oldQuestionPaper: { $regex: searchkey, $options: "i" } } : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && OldQuestionPaper.countDocuments(),
      parseInt(skip) === 0 && OldQuestionPaper.countDocuments(query),
      OldQuestionPaper.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({ success: true, message: `Retrieved all oldQuestionPaper`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC OldQuestionPaper
// @route     PUT /api/user/old-question-Paper
// @access    public
exports.updateOldQuestionPaper = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await OldQuestionPaper.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific oldQuestionPaper`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC OldQuestionPaper
// @route     DELETE /api/user/old-question-Paper
// @access    public
exports.deleteOldQuestionPaper = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await OldQuestionPaper.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific oldQuestionPaper`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET OldQuestionPaper
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await OldQuestionPaper.find({}, { _id: 0, id: "$_id", value: "$roleDisplayName" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
