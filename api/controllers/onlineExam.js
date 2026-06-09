const OnlineExam = require("../models/onlineExam");
const QuestionPool = require("../models/questionPool");
const ExamAttempt = require("../models/examAttempt");
const ExamResponse = require("../models/examResponse");
const ExamType = require("../models/examtype");
const User = require("../models/user");
const ExamRegistration = require("../models/examRegistration");
const { default: mongoose } = require("mongoose");

const buildActiveExamWindow = (now) => ({
  $or: [{ examDate: null }, { examDate: { $lte: now }, examEndDate: { $gte: now } }, { examDate: { $lte: now }, examEndDate: null }],
});

const getMappedExamTypeId = (registration) => {
  if (!registration?.nameOfExamAppearingNow) {
    return "";
  }

  return registration.nameOfExamAppearingNow._id
    ? String(registration.nameOfExamAppearingNow._id)
    : String(registration.nameOfExamAppearingNow);
};

const resolveStudentRegistration = async (userId) => {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return null;
  }

  const directRegistration = await ExamRegistration.findById(userId)
    .select("_id nameOfExamAppearingNow mobileNumber regno")
    .lean();

  if (directRegistration) {
    return directRegistration;
  }

  const user = await User.findById(userId).select("mobile").lean();
  if (!user?.mobile) {
    return null;
  }

  return ExamRegistration.findOne({ mobileNumber: Number(user.mobile) })
    .select("_id nameOfExamAppearingNow mobileNumber regno")
    .lean();
};

// ────────────────────────────────────────────
// ADMIN ENDPOINTS
// ────────────────────────────────────────────

// @desc      CREATE ONLINE EXAM
// @route     POST /api/v1/online-exam
// @access    protect (admin)
exports.addOnlineExam = async (req, res) => {
  try {
    req.body.createdBy = req.user?._id;
    const response = await OnlineExam.create(req.body);
    res.status(201).json({ success: true, message: "Online exam created.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      GET ONLINE EXAMS (admin list)
// @route     GET /api/v1/online-exam
// @access    protect
exports.getOnlineExams = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await OnlineExam.findById(id).populate("exam", "examType examShortName");
      const mappedExamId = response?.exam?._id || response?.exam;
      const questionCount = mappedExamId ? await QuestionPool.countDocuments({ exam: mappedExamId, status: true }) : 0;
      return res.status(200).json({ success: true, response: { ...response.toObject(), questionCount } });
    }

    let query = { ...req.filter };
    if (searchkey) {
      query.$or = [
        { title: { $regex: searchkey, $options: "i" } },
        { description: { $regex: searchkey, $options: "i" } },
      ];
    }

    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const [totalCount, filterCount, data] = await Promise.all([
      OnlineExam.countDocuments(),
      OnlineExam.countDocuments(query),
      OnlineExam.find(query)
        .populate("exam", "examType examShortName")
        .sort({ [sortField]: sortOrder })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 20)
        .lean(),
    ]);

    // Attach question counts
    const examIds = data.map((d) => d._id);
    const mappedExamIds = data.map((d) => d?.exam?._id || d?.exam).filter(Boolean);
    const qCounts = mappedExamIds.length
      ? await QuestionPool.aggregate([
          { $match: { exam: { $in: mappedExamIds.map((value) => new mongoose.Types.ObjectId(String(value))) }, status: true } },
          { $group: { _id: "$exam", count: { $sum: 1 } } },
        ])
      : [];
    const countMap = {};
    qCounts.forEach((c) => (countMap[String(c._id)] = c.count));

    // Attach attempt counts
    const aCounts = await ExamAttempt.aggregate([
      { $match: { exam: { $in: examIds } } },
      { $group: { _id: "$exam", count: { $sum: 1 } } },
    ]);
    const attemptMap = {};
    aCounts.forEach((c) => (attemptMap[String(c._id)] = c.count));

    const response = data.map((d, i) => ({
      ...d,
      slno: (parseInt(skip) || 0) + i + 1,
      questionCount: countMap[String(d?.exam?._id || d?.exam)] || 0,
      attemptCount: attemptMap[String(d._id)] || 0,
    }));

    res.status(200).json({
      success: true,
      message: "Retrieved online exams.",
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

// @desc      UPDATE ONLINE EXAM
// @route     PUT /api/v1/online-exam
// @access    protect (admin)
exports.updateOnlineExam = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "ID is required." });
    const response = await OnlineExam.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Online exam updated.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      DELETE ONLINE EXAM
// @route     DELETE /api/v1/online-exam
// @access    protect (admin)
exports.deleteOnlineExam = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: "ID is required." });
    // Cascade: remove questions, attempts, responses
    const attempts = await ExamAttempt.find({ exam: id }).distinct("_id");
    if (attempts.length) await ExamResponse.deleteMany({ attempt: { $in: attempts } });
    await ExamAttempt.deleteMany({ exam: id });
    const response = await OnlineExam.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Online exam and related data deleted.", response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      SELECT (dropdown)
// @route     GET /api/v1/online-exam/select
// @access    protect
exports.selectOnlineExam = async (req, res) => {
  try {
    const registration = await resolveStudentRegistration(req.query.userId);
    const mappedExamId = getMappedExamTypeId(registration);

    if (req.query.userId && !mappedExamId) {
      return res.status(200).send([]);
    }

    const query = {
      status: true,
      ...(mappedExamId ? { exam: mappedExamId } : {}),
    };

    const items = await OnlineExam.find(query, { _id: 0, id: "$_id", value: "$title" }).sort({ title: 1 });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      PUBLISH / UNPUBLISH RESULTS
// @route     PATCH /api/v1/online-exam/publish/:id
// @access    protect (admin)
exports.publishResults = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await OnlineExam.findById(id);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found." });

    exam.publishResult = !exam.publishResult;
    exam.publishedAt = exam.publishResult ? new Date() : null;
    await exam.save();

    res.status(200).json({
      success: true,
      message: exam.publishResult ? "Results published." : "Results unpublished.",
      response: exam,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ────────────────────────────────────────────
// ADMIN — RESULTS & ANALYTICS
// ────────────────────────────────────────────

// @desc      GET EXAM RESULTS SUMMARY (admin)
// @route     GET /api/v1/online-exam/results
// @access    protect
exports.getExamResults = async (req, res) => {
  try {
    const { exam, skip, limit, searchkey } = req.query;
    if (!exam) return res.status(400).json({ success: false, message: "Exam ID required." });

    let query = { exam, status: "completed" };

    // Search by user name / mobile
    let userIds = null;
    if (searchkey) {
      const ExamRegistration = require("../models/examRegistration");
      userIds = await ExamRegistration.find({
        $or: [
          { nameOfApplicant: { $regex: searchkey, $options: "i" } },
          { regno: { $regex: searchkey, $options: "i" } },
          { mobileNumber: !isNaN(searchkey) ? Number(searchkey) : -1 },
        ],
      }).distinct("_id");
      query.user = { $in: userIds };
    }

    const [totalCount, data] = await Promise.all([
      ExamAttempt.countDocuments(query),
      ExamAttempt.find(query)
        .populate({
          path: "user",
          select: "nameOfApplicant mobileNumber regno district area",
          populate: [
            { path: "district", select: "district" },
            { path: "area", select: "area" },
          ],
        })
        .populate("exam", "title examType totalQuestions duration passingPercentage resultVisibility")
        .sort({ totalScore: -1, totalTimeTaken: 1 })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 20)
        .lean(),
    ]);

    // Add rank
    const response = data.map((d, i) => ({
      ...d,
      rank: (parseInt(skip) || 0) + i + 1,
    }));

    // Summary stats
    const stats = await ExamAttempt.aggregate([
      { $match: { exam: new mongoose.Types.ObjectId(exam), status: "completed" } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: "$totalScore" },
          avgTime: { $avg: "$totalTimeTaken" },
          maxScore: { $max: "$totalScore" },
          minScore: { $min: "$totalScore" },
          passCount: { $sum: { $cond: ["$isPassed", 1, 0] } },
          failCount: { $sum: { $cond: ["$isPassed", 0, 1] } },
          avgPercentage: { $avg: "$percentage" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      response,
      count: response.length,
      totalCount,
      stats: stats[0] || null,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      GET DETAILED ATTEMPT (admin)
// @route     GET /api/v1/online-exam/results/detail/:attemptId
// @access    protect
exports.getAttemptDetail = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate({
        path: "user",
        select: "nameOfApplicant mobileNumber regno district area",
        populate: [
          { path: "district", select: "district" },
          { path: "area", select: "area" },
        ],
      })
      .populate("exam", "title examType totalQuestions duration passingPercentage marksPerQuestion negativeMarking")
      .lean();

    if (!attempt) return res.status(404).json({ success: false, message: "Attempt not found." });

    const responses = await ExamResponse.find({ attempt: attemptId })
      .populate("question", "question optionA optionB optionC optionD correctAnswer score description sequence")
      .sort({ "question.sequence": 1 })
      .lean();

    res.status(200).json({ success: true, attempt, responses });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ────────────────────────────────────────────
// USER ENDPOINTS — EXAM TAKING
// ────────────────────────────────────────────

// @desc      GET AVAILABLE EXAMS (user)
// @route     GET /api/v1/online-exam/available
// @access    protect
exports.getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const registration = await resolveStudentRegistration(req.query.userId);
    const mappedExamId = getMappedExamTypeId(registration);

    if (req.query.userId && !mappedExamId) {
      return res.status(200).json({ success: true, response: [] });
    }

    const exams = await OnlineExam.find({
      status: true,
      examType: { $in: ["Trial", "Main"] },
      ...(mappedExamId ? { exam: mappedExamId } : {}),
      ...buildActiveExamWindow(now),
    })
      .select("title examType description totalQuestions duration marksPerQuestion passingPercentage examDate examEndDate practiceQuestionCount exam")
      .populate("exam", "examType examShortName")
      .sort({ examDate: -1, createdAt: -1 })
      .lean();

    let attemptMap = {};
    if (registration?._id) {
      const attempts = await ExamAttempt.find({
        user: registration._id,
        exam: { $in: exams.map((e) => e._id) },
        attemptType: "exam",
      })
        .select("exam status totalScore percentage isPassed")
        .lean();
      attempts.forEach((a) => {
        attemptMap[String(a.exam)] = a;
      });
    }

    const response = exams.map((e) => ({
      ...e,
      userAttempt: attemptMap[String(e._id)] || null,
    }));

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      START EXAM ATTEMPT
// @route     POST /api/v1/online-exam/start
// @access    protect
exports.startExam = async (req, res) => {
  try {
    const { examId, userId, attemptType } = req.body;

    if (!examId || !userId) {
      return res.status(400).json({ success: false, message: "examId and userId are required." });
    }

    const registration = await resolveStudentRegistration(userId);
    if (!registration) {
      return res.status(400).json({ success: false, message: "Student registration not found. Please login again." });
    }

    const mappedExamId = getMappedExamTypeId(registration);
    const exam = await OnlineExam.findById(examId).populate("exam", "examType examShortName");
    if (!exam || !exam.status) {
      return res.status(404).json({ success: false, message: "Exam not found or inactive." });
    }

    const questionPoolExamId = exam?.exam?._id ? String(exam.exam._id) : exam?.exam ? String(exam.exam) : "";
    if (!questionPoolExamId) {
      return res.status(400).json({ success: false, message: "This online exam is not mapped to an exam type yet." });
    }

    if (mappedExamId && mappedExamId !== questionPoolExamId) {
      return res.status(403).json({ success: false, message: "This exam is not assigned to your registration." });
    }

    const isPractice = attemptType === "practice";

    // For real exams (non-practice), check if already attempted
    if (!isPractice) {
      const existingAttempt = await ExamAttempt.findOne({
        exam: examId,
        user: registration._id,
        attemptType: "exam",
        status: { $in: ["in_progress", "completed"] },
      });

      if (existingAttempt) {
        if (existingAttempt.status === "in_progress") {
          const storedQuestions = await QuestionPool.find({
            _id: { $in: existingAttempt.questionOrder || [] },
          })
            .select("question optionA optionB optionC optionD score sequence")
            .lean();

          const questionMap = new Map(storedQuestions.map((question) => [String(question._id), question]));
          const orderedQuestions = (existingAttempt.questionOrder || [])
            .map((questionId) => questionMap.get(String(questionId)))
            .filter(Boolean);

          // Resume existing attempt
          const responses = await ExamResponse.find({ attempt: existingAttempt._id })
            .populate("question", "question optionA optionB optionC optionD score sequence")
            .sort({ "question.sequence": 1 })
            .lean();

          return res.status(200).json({
            success: true,
            message: "Resuming existing attempt.",
            attempt: existingAttempt,
            questions: orderedQuestions,
            responses,
            resumed: true,
            duration: exam.duration,
          });
        }
        return res.status(400).json({ success: false, message: "You have already completed this exam." });
      }
    }

    // Fetch questions
    let questions;
    if (isPractice) {
      // Random subset for practice
      const count = exam.practiceQuestionCount || 10;
      questions = await QuestionPool.aggregate([
        { $match: { exam: new mongoose.Types.ObjectId(questionPoolExamId), status: true } },
        { $sample: { size: count } },
      ]);
    } else {
      // All active questions, optionally shuffled
      questions = await QuestionPool.find({ exam: questionPoolExamId, status: true }).sort({ sequence: 1 }).lean();
      if (exam.shuffleQuestions) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
      }
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: "No questions available for this exam." });
    }

    // Compute max score
    const maxScore = questions.reduce((sum, q) => sum + (q.score || exam.marksPerQuestion || 1), 0);

    // Create attempt
    const attempt = await ExamAttempt.create({
      exam: examId,
      user: registration._id,
      attemptType: isPractice ? "practice" : "exam",
      startedAt: new Date(),
      maxScore,
      questionOrder: questions.map((q) => q._id),
    });

    // Strip correct answers from questions sent to user
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      score: q.score,
      sequence: q.sequence,
    }));

    res.status(201).json({
      success: true,
      message: "Exam started.",
      attempt,
      questions: safeQuestions,
      duration: exam.duration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      SAVE SINGLE ANSWER (real-time)
// @route     POST /api/v1/online-exam/submit-answer
// @access    protect
exports.submitAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, selectedAnswer, timeTaken } = req.body;

    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt || attempt.status !== "in_progress") {
      return res.status(400).json({ success: false, message: "Invalid or completed attempt." });
    }

    const question = await QuestionPool.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const exam = await OnlineExam.findById(attempt.exam);
    const score = isCorrect ? (question.score || exam.marksPerQuestion || 1) : -(exam.negativeMarking || 0);

    // Upsert response
    await ExamResponse.findOneAndUpdate(
      { attempt: attemptId, question: questionId },
      {
        selectedAnswer: selectedAnswer || null,
        isCorrect,
        timeTaken: timeTaken || 0,
        score,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: "Answer saved." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      SUBMIT EXAM (finalize)
// @route     POST /api/v1/online-exam/submit
// @access    protect
exports.submitExam = async (req, res) => {
  try {
    const { attemptId } = req.body;

    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt || attempt.status !== "in_progress") {
      return res.status(400).json({ success: false, message: "Invalid or already completed attempt." });
    }

    const exam = await OnlineExam.findById(attempt.exam);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found." });

    // Gather all responses
    const responses = await ExamResponse.find({ attempt: attemptId }).lean();

    const totalCorrect = responses.filter((r) => r.isCorrect).length;
    const totalWrong = responses.filter((r) => r.selectedAnswer && !r.isCorrect).length;
    const totalSkipped = (attempt.questionOrder?.length || exam.totalQuestions) - responses.filter((r) => r.selectedAnswer).length;
    const totalScore = responses.reduce((sum, r) => sum + (r.score || 0), 0);
    const finalScore = Math.max(0, totalScore); // floor at 0
    const maxScore = attempt.maxScore || exam.totalQuestions * (exam.marksPerQuestion || 1);
    const percentage = maxScore > 0 ? Math.round((finalScore / maxScore) * 10000) / 100 : 0;
    const isPassed = percentage >= (exam.passingPercentage || 40);

    const now = new Date();
    const totalTimeTaken = Math.round((now.getTime() - new Date(attempt.startedAt).getTime()) / 1000);

    attempt.completedAt = now;
    attempt.totalTimeTaken = totalTimeTaken;
    attempt.totalScore = finalScore;
    attempt.totalCorrect = totalCorrect;
    attempt.totalWrong = totalWrong;
    attempt.totalSkipped = totalSkipped;
    attempt.isPassed = isPassed;
    attempt.percentage = percentage;
    attempt.status = "completed";
    await attempt.save();

    // Build result based on visibility
    const result = { isPassed, status: "completed" };
    if (exam.resultVisibility === "detailed" || attempt.attemptType === "practice") {
      result.totalScore = finalScore;
      result.maxScore = maxScore;
      result.percentage = percentage;
      result.totalCorrect = totalCorrect;
      result.totalWrong = totalWrong;
      result.totalSkipped = totalSkipped;
      result.totalTimeTaken = totalTimeTaken;
    } else if (exam.resultVisibility === "score_only") {
      result.totalScore = finalScore;
      result.maxScore = maxScore;
      result.percentage = percentage;
    }
    // pass_fail → only isPassed is returned (already set)

    res.status(200).json({ success: true, message: "Exam submitted successfully.", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc      GET ATTEMPT RESULT (user)
// @route     GET /api/v1/online-exam/result/:attemptId
// @access    protect
exports.getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("exam", "title examType totalQuestions duration passingPercentage resultVisibility publishResult marksPerQuestion negativeMarking")
      .lean();

    if (!attempt) return res.status(404).json({ success: false, message: "Attempt not found." });

    const exam = attempt.exam;

    // For practice attempts, always show detailed
    if (attempt.attemptType === "practice") {
      const responses = await ExamResponse.find({ attempt: attemptId })
        .populate("question", "question optionA optionB optionC optionD correctAnswer score description sequence")
        .sort({ "question.sequence": 1 })
        .lean();
      return res.status(200).json({ success: true, attempt, responses, visibility: "detailed" });
    }

    // For real exams, respect publishResult and resultVisibility
    if (!exam.publishResult) {
      return res.status(200).json({
        success: true,
        attempt: { _id: attempt._id, status: attempt.status, exam: { title: exam.title, examType: exam.examType } },
        responses: [],
        visibility: "not_published",
        message: "Results are not yet published.",
      });
    }

    if (exam.resultVisibility === "detailed") {
      const responses = await ExamResponse.find({ attempt: attemptId })
        .populate("question", "question optionA optionB optionC optionD correctAnswer score description sequence")
        .sort({ "question.sequence": 1 })
        .lean();
      return res.status(200).json({ success: true, attempt, responses, visibility: "detailed" });
    }

    // score_only or pass_fail — no per-question details
    return res.status(200).json({
      success: true,
      attempt,
      responses: [],
      visibility: exam.resultVisibility,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      GET USER EXAM HISTORY
// @route     GET /api/v1/online-exam/history
// @access    protect
exports.getExamHistory = async (req, res) => {
  try {
    const { userId, skip, limit, attemptType } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "userId required." });

    const registration = await resolveStudentRegistration(userId);
    if (!registration) {
      return res.status(200).json({ success: true, response: [], totalCount: 0, count: 0 });
    }

    let query = { user: registration._id };
    if (attemptType) query.attemptType = attemptType;

    const [totalCount, data] = await Promise.all([
      ExamAttempt.countDocuments(query),
      ExamAttempt.find(query)
        .populate("exam", "title examType totalQuestions duration passingPercentage resultVisibility publishResult exam")
        .sort({ createdAt: -1 })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 20)
        .lean(),
    ]);

    res.status(200).json({ success: true, response: data, totalCount, count: data.length });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      GET PRACTICE QUESTIONS (random subset, no attempt created)
// @route     GET /api/v1/online-exam/practice
// @access    protect
exports.getPracticeQuestions = async (req, res) => {
  try {
    const { examId } = req.query;
    if (!examId) return res.status(400).json({ success: false, message: "examId required." });

    const exam = await OnlineExam.findById(examId).populate("exam", "examType examShortName");
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found." });

    const questionPoolExamId = exam?.exam?._id ? String(exam.exam._id) : exam?.exam ? String(exam.exam) : "";
    if (!questionPoolExamId) {
      return res.status(400).json({ success: false, message: "This online exam is not mapped to an exam type yet." });
    }

    const count = exam.practiceQuestionCount || 10;
    const questions = await QuestionPool.aggregate([
      { $match: { exam: new mongoose.Types.ObjectId(questionPoolExamId), status: true } },
      { $sample: { size: count } },
      { $project: { correctAnswer: 0 } },
    ]);

    res.status(200).json({
      success: true,
      response: questions,
      examTitle: exam.title,
      duration: exam.duration,
      count: questions.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
