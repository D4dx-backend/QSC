import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen, Timer,
  ArrowLeft, RotateCcw, Send, AlertCircle,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, postJson } from "../../../../backend/api";
import { getStoredStudentRegistrationId } from "../shared/studentSession";

const PracticeExam = (props) => {
  useEffect(() => {
    document.title = `Practice Exam - QSC Automation`;
  }, []);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Practice session
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false); // practice mode: instant feedback
  const [practiceResults, setPracticeResults] = useState(null); // detailed results after submit
  const timerRef = useRef(null);

  const getUserId = () => getStoredStudentRegistrationId();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        if (!userId) {
          setExams([]);
          return;
        }
        const r = await getData({ userId }, "online-exam/select");
        setExams(r?.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Timer
  useEffect(() => {
    if (!attempt || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [attempt, result]);

  const startPractice = async (examId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        props.setMessage?.({ type: 1, content: "Student session not found. Please login again.", proceed: "Okay" });
        return;
      }
      const r = await postJson({ examId, userId, attemptType: "practice" }, "online-exam/start");
      if (r?.data?.success) {
        setAttempt(r.data.attempt);
        setQuestions(r.data.questions || []);
        setDuration(r.data.duration || 60);
        setTimeLeft((r.data.duration || 60) * 60);
        setCurrentIdx(0);
        setAnswers({});
        setQuestionStartTime(Date.now());
        setResult(null);
        setPracticeResults(null);
        setShowAnswer(false);
      } else {
        props.setMessage?.({ type: 1, content: r?.data?.message || "Could not start practice.", proceed: "Okay" });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: e?.message || "Error.", proceed: "Okay" });
    }
  };

  const selectAnswer = async (questionId, answer) => {
    const timeOnQ = Math.round((Date.now() - questionStartTime) / 1000);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer, timeTaken: (prev[questionId]?.timeTaken || 0) + timeOnQ },
    }));
    setQuestionStartTime(Date.now());

    try {
      await postJson({
        attemptId: attempt._id,
        questionId,
        selectedAnswer: answer,
        timeTaken: (answers[questionId]?.timeTaken || 0) + timeOnQ,
      }, "online-exam/submit-answer");
    } catch { /* silent */ }
  };

  const goToQuestion = (idx) => {
    setCurrentIdx(idx);
    setQuestionStartTime(Date.now());
    setShowAnswer(false);
  };

  const doSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const r = await postJson({ attemptId: attempt._id }, "online-exam/submit");
      if (r?.data?.success) {
        setResult(r.data.result);
        // Fetch detailed results for practice
        const detail = await getData({}, `online-exam/result/${attempt._id}`);
        setPracticeResults(detail?.data?.responses || []);
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: e?.message || "Submit failed.", proceed: "Okay" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const q = questions[currentIdx];
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.answer).length;

  // ─── DETAILED RESULT ───
  if (result && practiceResults) {
    return (
      <Container className="noshadow">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${result.isPassed ? "bg-emerald-100" : "bg-red-100"}`}>
              {result.isPassed ? <CheckCircle className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Practice Complete</h2>
            {result.totalScore !== undefined && (
              <p className="text-2xl font-bold">{result.totalScore} / {result.maxScore} <span className="text-sm text-gray-400">({result.percentage}%)</span></p>
            )}
            <div className="flex justify-center gap-6 text-sm mt-3">
              <span className="text-emerald-600"><strong>{result.totalCorrect}</strong> Correct</span>
              <span className="text-red-500"><strong>{result.totalWrong}</strong> Wrong</span>
              <span className="text-gray-400"><strong>{result.totalSkipped}</strong> Skipped</span>
            </div>
          </div>

          {/* Per-question review */}
          <h3 className="text-base font-semibold text-gray-800 mb-3">Review Answers</h3>
          <div className="space-y-4">
            {practiceResults.map((r, i) => (
              <div key={r._id} className={`bg-white rounded-xl border p-5 ${r.isCorrect ? "border-emerald-200" : r.selectedAnswer ? "border-red-200" : "border-gray-200"}`}>
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.isCorrect ? "bg-emerald-100 text-emerald-700" : r.selectedAnswer ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-3">{r.question?.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {["A", "B", "C", "D"].map((opt) => {
                        const isCorrect = r.question?.correctAnswer === opt;
                        const isSelected = r.selectedAnswer === opt;
                        return (
                          <div
                            key={opt}
                            className={`px-3 py-2 rounded-lg text-sm border ${
                              isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium" :
                              isSelected ? "bg-red-50 border-red-300 text-red-700" :
                              "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            <span className="font-bold mr-2">{opt}.</span> {r.question?.[`option${opt}`]}
                            {isCorrect && <CheckCircle className="inline w-3.5 h-3.5 ml-1 text-emerald-500" />}
                            {isSelected && !isCorrect && <XCircle className="inline w-3.5 h-3.5 ml-1 text-red-500" />}
                          </div>
                        );
                      })}
                    </div>
                    {r.question?.description && (
                      <p className="text-xs text-gray-500 mt-2 italic">{r.question.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button onClick={() => { setAttempt(null); setResult(null); setPracticeResults(null); }} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4" /> Back to Exams
            </button>
            <button onClick={() => { setResult(null); setPracticeResults(null); startPractice(attempt.exam); }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // ─── PRACTICE IN PROGRESS ───
  if (attempt && questions.length > 0 && !result) {
    return (
      <Container className="noshadow">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="text-sm font-medium text-gray-800">Practice — Q {currentIdx + 1} / {questions.length}</div>
            <div className="flex items-center gap-2 text-sm font-mono text-gray-600"><Timer className="w-4 h-4" /> {formatTimer(timeLeft)}</div>
            <button onClick={doSubmit} disabled={submitting} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">
              <Send className="w-3.5 h-3.5" /> Finish
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {q && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                    <p className="text-lg font-medium text-gray-800">{q.question}</p>
                  </div>
                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((opt) => {
                      const selected = answers[q._id]?.answer === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => selectAnswer(q._id, opt)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition ${
                            selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>{opt}</span>
                            <span className="text-sm">{q[`option${opt}`]}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <button disabled={currentIdx === 0} onClick={() => goToQuestion(currentIdx - 1)} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    {currentIdx < questions.length - 1 ? (
                      <button onClick={() => goToQuestion(currentIdx + 1)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={doSubmit} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                        <Send className="w-3.5 h-3.5" /> Finish
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-56 bg-gray-50 border-l border-gray-200 hidden md:flex flex-col p-4 overflow-y-auto flex-shrink-0">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Questions</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((ques, idx) => {
                  const isAnswered = !!answers[ques._id]?.answer;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={ques._id}
                      onClick={() => goToQuestion(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium ${
                        isCurrent ? "bg-blue-600 text-white" : isAnswered ? "bg-emerald-100 text-emerald-700" : "bg-white text-gray-600 border border-gray-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // ─── EXAM SELECTION ───
  return (
    <Container className="noshadow">
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Practice Exam</h2>
        <p className="text-sm text-gray-500 mb-6">Pick an exam to practice with random questions. Your answers will be reviewed after submission.</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No exams available for practice.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <h3 className="font-semibold text-gray-800">{ex.value}</h3>
                  <p className="text-xs text-gray-400 mt-1">Random questions from the question pool</p>
                </div>
                <button
                  onClick={() => startPractice(ex.id)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Layout(PracticeExam);
