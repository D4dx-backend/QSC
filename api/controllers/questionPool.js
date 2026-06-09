const QuestionPool = require("../models/questionPool");
const ExamType = require("../models/examtype");
const { default: mongoose } = require("mongoose");

// @desc      ADD QUESTION
// @route     POST /api/v1/question-pool
// @access    protect
exports.addQuestion = async (req, res) => {
  try {
    const { exam } = req.body;
    if (!exam || !mongoose.isValidObjectId(exam)) {
      return res.status(400).json({ success: false, message: "Valid exam ID is required." });
    }
    // Auto-sequence
    const lastQ = await QuestionPool.findOne({ exam }).sort({ sequence: -1 }).lean();
    req.body.sequence = (lastQ?.sequence || 0) + 1;

    const response = await QuestionPool.create(req.body);
    res.status(201).json({ success: true, message: "Question added successfully.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      BULK ADD QUESTIONS
// @route     POST /api/v1/question-pool/bulk
// @access    protect
exports.addBulkQuestions = async (req, res) => {
  try {
    const { exam, questions } = req.body;
    if (!exam || !mongoose.isValidObjectId(exam)) {
      return res.status(400).json({ success: false, message: "Valid exam ID is required." });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions array is required." });
    }

    const lastQ = await QuestionPool.findOne({ exam }).sort({ sequence: -1 }).lean();
    let seq = (lastQ?.sequence || 0) + 1;

    const docs = questions.map((q) => ({
      exam,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      score: q.score || 1,
      description: q.description || "",
      sequence: seq++,
    }));

    const response = await QuestionPool.insertMany(docs);
    res.status(201).json({ success: true, message: `${response.length} questions added.`, response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      GET QUESTIONS
// @route     GET /api/v1/question-pool
// @access    protect
exports.getQuestions = async (req, res) => {
  try {
    const { id, exam, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await QuestionPool.findById(id).populate("exam", "examType examShortName");
      return res.status(200).json({ success: true, message: "Retrieved question.", response });
    }

    let query = { ...req.filter };

    if (searchkey) {
      query.$or = [
        { question: { $regex: searchkey, $options: "i" } },
        { optionA: { $regex: searchkey, $options: "i" } },
        { optionB: { $regex: searchkey, $options: "i" } },
        { optionC: { $regex: searchkey, $options: "i" } },
        { optionD: { $regex: searchkey, $options: "i" } },
      ];
    }

    const sortField = req.query.sortBy || "sequence";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const [totalCount, filterCount, data] = await Promise.all([
      QuestionPool.countDocuments({ ...(exam ? { exam } : {}) }),
      QuestionPool.countDocuments(query),
      QuestionPool.find(query)
        .populate("exam", "examType examShortName")
        .sort({ [sortField]: sortOrder })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .lean(),
    ]);

    const response = data.map((doc, i) => ({ ...doc, slno: (parseInt(skip) || 0) + i + 1 }));

    res.status(200).json({
      success: true,
      message: "Retrieved questions.",
      response,
      count: response.length,
      totalCount,
      filterCount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      UPDATE QUESTION
// @route     PUT /api/v1/question-pool
// @access    protect
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "ID is required." });
    const response = await QuestionPool.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Question updated.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      DELETE QUESTION
// @route     DELETE /api/v1/question-pool
// @access    protect
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: "ID is required." });
    const response = await QuestionPool.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Question deleted.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      GET QUESTION COUNT BY EXAM
// @route     GET /api/v1/question-pool/count
// @access    protect
exports.getQuestionCount = async (req, res) => {
  try {
    const { exam } = req.query;
    if (!exam) return res.status(400).json({ success: false, message: "Exam ID required." });
    const count = await QuestionPool.countDocuments({ exam, status: true });
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      BULK UPLOAD QUESTIONS (multipart/form-data with JSON file)
// @route     POST /api/v1/question-pool/bulk-upload
// @access    protect
exports.bulkUploadQuestions = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "JSON file is required." });
    }

    let questions;
    try {
      questions = JSON.parse(file.buffer.toString("utf8"));
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON file." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions array is empty." });
    }

    const newRegistrations = [];
    const skipped = [];

    for (const q of questions) {
      let examId = null;
      if (q.exam && mongoose.isValidObjectId(q.exam)) {
        examId = q.exam;
      } else if (q.exam) {
        // Try to resolve exam by examType or examShortName (trimmed, case-insensitive)
        const escapedExam = q.exam.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const examDoc = await ExamType.findOne({
          $or: [
            { examType: { $regex: new RegExp(`^\\s*${escapedExam}\\s*$`, "i") } },
            { examShortName: { $regex: new RegExp(`^\\s*${escapedExam}\\s*$`, "i") } },
          ],
        }).lean();
        if (examDoc) {
          examId = examDoc._id;
        } else {
          skipped.push({ reason: `Exam not found: "${q.exam}"`, question: q.question });
          continue;
        }
      } else {
        skipped.push({ reason: "Missing exam field", question: q.question });
        continue;
      }
      const lastQ = await QuestionPool.findOne({ exam: examId }).sort({ sequence: -1 }).lean();
      const seq = (lastQ?.sequence || 0) + 1;
      const doc = await QuestionPool.create({
        exam: examId,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: (q.correctAnswer ?? "").toString().trim().toUpperCase(),
        // Note: trim + uppercase handles "A " → "A"
        score: q.score || 1,
        description: q.description || "",
        sequence: seq,
      });
      newRegistrations.push(doc);
    }

    res.status(200).json({
      success: true,
      message: `${newRegistrations.length} questions uploaded.`,
      alreadyExist: [],
      skipped,
      newRegistrations,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      REORDER QUESTIONS
// @route     PUT /api/v1/question-pool/reorder
// @access    protect
exports.reorderQuestions = async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of question _id in new order
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds array required." });
    }
    const ops = orderedIds.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { $set: { sequence: idx + 1 } } },
    }));
    await QuestionPool.bulkWrite(ops);
    res.status(200).json({ success: true, message: "Questions reordered." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
