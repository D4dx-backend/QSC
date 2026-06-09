import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle,
  Send, BookOpen, Timer, ArrowLeft, Flag,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, postJson } from "../../../../backend/api";
import { getStoredStudentRegistrationId } from "../shared/studentSession";

const TakeExam = (props) => {
  useEffect(() => {
    document.title = `Take Exam - QSC Automation`;
  }, []);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exam in progress
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: { answer, timeTaken } }
  const [duration, setDuration] = useState(0); // minutes
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const timerRef = useRef(null);

  const getUserId = () => getStoredStudentRegistrationId();

  // Load available exams
  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        setExams([]);
        return;
      }
      const r = await getData({ userId }, "online-exam/available");
      setExams(r?.data?.response || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  // Timer effect
  useEffect(() => {
    if (!attempt || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [attempt, result]);

  const handleAutoSubmit = async () => {
    await doSubmit();
  };

  const startExam = async (examId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        props.setMessage?.({ type: 1, content: "Student session not found. Please login again.", proceed: "Okay" });
        return;
      }
      const r = await postJson({ examId, userId, attemptType: "exam" }, "online-exam/start");
      if (r?.data?.success) {
        setAttempt(r.data.attempt);
        setQuestions(r.data.questions || []);
        setDuration(r.data.duration || 60);
        setTimeLeft((r.data.duration || 60) * 60);
        setCurrentIdx(0);
        setAnswers({});
        setQuestionStartTime(Date.now());
        setResult(null);

        // If resuming, populate existing answers
        if (r.data.resumed && r.data.responses) {
          const existing = {};
          r.data.responses.forEach((resp) => {
            if (resp.selectedAnswer) {
              existing[String(resp.question?._id || resp.question)] = {
                answer: resp.selectedAnswer,
                timeTaken: resp.timeTaken || 0,
              };
            }
          });
          setAnswers(existing);
          // Adjust time left based on elapsed time
          const elapsed = Math.round((Date.now() - new Date(r.data.attempt.startedAt).getTime()) / 1000);
          setTimeLeft(Math.max(0, (r.data.duration || 60) * 60 - elapsed));
        }
      } else {
        props.setMessage?.({ type: 1, content: r?.data?.message || "Could not start exam.", proceed: "Okay" });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: e?.message || "Error starting exam.", proceed: "Okay" });
    }
  };

  const selectAnswer = async (questionId, answer) => {
    const timeOnQuestion = Math.round((Date.now() - questionStartTime) / 1000);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer, timeTaken: (prev[questionId]?.timeTaken || 0) + timeOnQuestion },
    }));
    setQuestionStartTime(Date.now());

    // Save in real time
    try {
      await postJson(
        {
          attemptId: attempt._id,
          questionId,
          selectedAnswer: answer,
          timeTaken: (answers[questionId]?.timeTaken || 0) + timeOnQuestion,
        },
        "online-exam/submit-answer"
      );
    } catch {
      // Silent fail — will be reconciled on submit
    }
  };

  const goToQuestion = (idx) => {
    // Record time on current question before moving
    const qId = questions[currentIdx]?._id;
    if (qId && answers[qId]) {
      const timeOnQuestion = Math.round((Date.now() - questionStartTime) / 1000);
      setAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], timeTaken: (prev[qId]?.timeTaken || 0) + timeOnQuestion },
      }));
    }
    setCurrentIdx(idx);
    setQuestionStartTime(Date.now());
  };

  const doSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const r = await postJson({ attemptId: attempt._id }, "online-exam/submit");
      if (r?.data?.success) {
        setResult(r.data.result);
      } else {
        props.setMessage?.({ type: 1, content: r?.data?.message || "Submit failed.", proceed: "Okay" });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: e?.message || "Submit failed.", proceed: "Okay" });
    } finally {
      setSubmitting(false);
      setConfirmSubmit(false);
    }
  };

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const q = questions[currentIdx];
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.answer).length;

  // ─── RESULT VIEW ───
  if (result) {
    return (
      <Container className="noshadow">
        <div className="p-4 md:p-6 max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${result.isPassed ? "bg-emerald-100" : "bg-red-100"}`}>
              {result.isPassed ? <CheckCircle className="w-10 h-10 text-emerald-500" /> : <XCircle className="w-10 h-10 text-red-500" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.isPassed ? "Congratulations! You Passed!" : "Exam Completed"}</h2>
            {result.totalScore !== undefined && (
              <p className="text-3xl font-bold text-gray-900 my-4">
                {result.totalScore} <span className="text-lg text-gray-400">/ {result.maxScore}</span>
              </p>
            )}
            {result.percentage !== undefined && (
              <p className="text-lg text-gray-600 mb-2">{result.percentage}%</p>
            )}
            {result.totalCorrect !== undefined && (
              <div className="flex justify-center gap-6 text-sm mt-4">
                <div className="text-emerald-600"><strong>{result.totalCorrect}</strong> Correct</div>
                <div className="text-red-500"><strong>{result.totalWrong}</strong> Wrong</div>
                <div className="text-gray-400"><strong>{result.totalSkipped}</strong> Skipped</div>
              </div>
            )}
            {result.totalTimeTaken !== undefined && (
              <p className="text-sm text-gray-400 mt-3">Time: {formatTimer(result.totalTimeTaken)}</p>
            )}
            <button
              onClick={() => { setAttempt(null); setResult(null); loadExams(); }}
              className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Exams
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // ─── EXAM IN PROGRESS ───
  if (attempt && questions.length > 0) {
    return (
      <Container className="noshadow">
        <div className="h-full flex flex-col">
          {/* Top bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="text-sm font-medium text-gray-800">
              Q {currentIdx + 1} / {questions.length}
            </div>
            <div className={`flex items-center gap-2 text-sm font-mono font-bold ${timeLeft < 300 ? "text-red-600 animate-pulse" : timeLeft < 600 ? "text-amber-600" : "text-gray-700"}`}>
              <Timer className="w-4 h-4" /> {formatTimer(timeLeft)}
            </div>
            <button
              onClick={() => setConfirmSubmit(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Send className="w-3.5 h-3.5" /> Submit
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Question panel */}
            <div className="flex-1 overflow-y-auto p-6">
              {q && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">{q.question}</p>
                    {q.score > 1 && <span className="inline-block mt-2 text-xs text-gray-400">({q.score} marks)</span>}
                  </div>

                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((opt) => {
                      const selected = answers[q._id]?.answer === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => selectAnswer(q._id, opt)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition ${
                            selected
                              ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {opt}
                            </span>
                            <span className={`text-sm ${selected ? "text-blue-800 font-medium" : "text-gray-700"}`}>
                              {q[`option${opt}`]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Prev / Next */}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => goToQuestion(currentIdx - 1)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm disabled:opacity-30 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    {currentIdx < questions.length - 1 ? (
                      <button
                        onClick={() => goToQuestion(currentIdx + 1)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmSubmit(true)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                      >
                        <Send className="w-3.5 h-3.5" /> Finish
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Question navigation sidebar */}
            <div className="w-64 bg-gray-50 border-l border-gray-200 hidden md:flex flex-col p-4 overflow-y-auto flex-shrink-0">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Questions</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((ques, idx) => {
                  const isAnswered = !!answers[ques._id]?.answer;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={ques._id}
                      onClick={() => goToQuestion(idx)}
                      className={`w-9 h-9 rounded-lg text-xs font-medium transition ${
                        isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-300"
                          : isAnswered
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> Answered ({answeredCount})</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-white border border-gray-200" /> Not answered ({questions.length - answeredCount})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit confirmation */}
        {confirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmSubmit(false)}>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Submit Exam?</h3>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              </p>
              {questions.length - answeredCount > 0 && (
                <p className="text-amber-600 text-sm mb-4">
                  {questions.length - answeredCount} question(s) are unanswered.
                </p>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm">Continue Exam</button>
                <button onClick={doSubmit} disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                  {submitting ? "Submitting..." : "Submit Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    );
  }

  // ─── EXAM LIST ───
  return (
    <Container className="noshadow">
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Exams</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No exams available at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => {
              const completed = exam.userAttempt?.status === "completed";
              return (
                <div key={exam._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${exam.examType === "Main" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {exam.examType}
                      </span>
                    </div>
                    {completed ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => startExam(exam._id)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Start Exam
                      </button>
                    )}
                  </div>
                  {exam.description && <p className="text-sm text-gray-500 mt-2">{exam.description}</p>}
                  <div className="flex gap-6 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {exam.totalQuestions} Questions</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.duration} min</span>
                    <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> Pass: {exam.passingPercentage}%</span>
                  </div>
                  {exam.examDate && (
                    <p className="text-xs text-gray-400 mt-2">
                      Available: {new Date(exam.examDate).toLocaleString()} {exam.examEndDate ? `— ${new Date(exam.examEndDate).toLocaleString()}` : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Layout(TakeExam);
