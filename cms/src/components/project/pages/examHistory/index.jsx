import React, { useEffect, useState, useCallback } from "react";
import {
  Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, BookOpen,
  Eye, Calendar, Trophy, MinusCircle, BarChart3,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData } from "../../../../backend/api";
import { getStoredStudentRegistrationId } from "../shared/studentSession";

const PAGE_SIZE = 15;

const ExamHistory = (props) => {
  useEffect(() => {
    document.title = `Exam History - QSC Automation`;
  }, []);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(""); // exam or practice
  const [detail, setDetail] = useState(null);
  const [detailResponses, setDetailResponses] = useState([]);
  const [detailVisibility, setDetailVisibility] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);

  const getUserId = () => getStoredStudentRegistrationId();

  const load = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setRows([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = { userId, skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
      if (filter) q.attemptType = filter;
      const r = await getData(q, "online-exam/history");
      setRows(r?.data?.response || []);
      setTotalCount(r?.data?.totalCount || 0);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const viewResult = async (attemptId) => {
    setDetailLoading(true);
    try {
      const r = await getData({}, `online-exam/result/${attemptId}`);
      setDetail(r?.data?.attempt || null);
      setDetailResponses(r?.data?.responses || []);
      setDetailVisibility(r?.data?.visibility || "");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  // ─── DETAIL VIEW ───
  if (detail) {
    const exam = detail.exam;
    const notPublished = detailVisibility === "not_published";

    return (
      <Container className="noshadow">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          <button onClick={() => setDetail(null)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to History
          </button>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{exam?.title || "Exam"}</h2>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${detail.attemptType === "practice" ? "bg-emerald-50 text-emerald-700" : exam?.examType === "Main" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
              {detail.attemptType === "practice" ? "Practice" : exam?.examType}
            </span>

            {notPublished ? (
              <div className="mt-6 text-center py-8">
                <MinusCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Results are not yet published.</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  {detail.totalScore !== undefined && (
                    <div>
                      <span className="text-gray-500 block text-xs">Score</span>
                      <strong>{detail.totalScore} / {detail.maxScore}</strong>
                    </div>
                  )}
                  {detail.percentage !== undefined && (
                    <div>
                      <span className="text-gray-500 block text-xs">Percentage</span>
                      <strong>{detail.percentage}%</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 block text-xs">Status</span>
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${detail.isPassed ? "text-emerald-600" : "text-red-600"}`}>
                      {detail.isPassed ? <><CheckCircle className="w-3.5 h-3.5" /> Passed</> : <><XCircle className="w-3.5 h-3.5" /> Failed</>}
                    </span>
                  </div>
                  {detail.totalTimeTaken !== undefined && (
                    <div>
                      <span className="text-gray-500 block text-xs">Time</span>
                      <strong>{formatTime(detail.totalTimeTaken)}</strong>
                    </div>
                  )}
                </div>

                {/* Detailed Q-by-Q review */}
                {detailResponses.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-3">Answer Review</h3>
                    <div className="space-y-3">
                      {detailResponses.map((r, i) => (
                        <div key={r._id} className={`rounded-lg border p-4 ${r.isCorrect ? "border-emerald-200 bg-emerald-50/30" : r.selectedAnswer ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}>
                          <p className="text-sm font-medium text-gray-800 mb-2">
                            <span className="text-gray-400 mr-2">Q{i + 1}.</span> {r.question?.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {["A", "B", "C", "D"].map((opt) => {
                              const correct = r.question?.correctAnswer === opt;
                              const selected = r.selectedAnswer === opt;
                              return (
                                <div key={opt} className={`px-2 py-1.5 rounded ${correct ? "bg-emerald-100 text-emerald-800 font-medium" : selected ? "bg-red-100 text-red-700" : "text-gray-600"}`}>
                                  {opt}. {r.question?.[`option${opt}`]}
                                </div>
                              );
                            })}
                          </div>
                          {r.question?.description && (
                            <p className="text-xs text-gray-500 mt-2 italic">{r.question.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    );
  }

  // ─── LIST VIEW ───
  return (
    <Container className="noshadow">
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Exam History</h2>
          <div className="flex items-center gap-2">
            {["", "exam", "practice"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "" ? "All" : f === "exam" ? "Exams" : "Practice"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No exam history found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {rows.map((row) => {
                const exam = row.exam;
                return (
                  <div key={row._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{exam?.title || "Exam"}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.attemptType === "practice" ? "bg-emerald-50 text-emerald-700" :
                            exam?.examType === "Main" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {row.attemptType === "practice" ? "Practice" : exam?.examType}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.status === "completed" ? "bg-gray-100 text-gray-600" :
                            row.status === "in_progress" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                          }`}>
                            {row.status === "completed" ? "Completed" : row.status === "in_progress" ? "In Progress" : "Abandoned"}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(row.completedAt || row.startedAt)}</span>
                          {row.status === "completed" && (
                            <>
                              <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {row.totalScore} / {row.maxScore}</span>
                              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {row.percentage}%</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(row.totalTimeTaken)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.status === "completed" && (
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${row.isPassed ? "text-emerald-600" : "text-red-500"}`}>
                            {row.isPassed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {row.isPassed ? "Pass" : "Fail"}
                          </span>
                        )}
                        {row.status === "completed" && (
                          <button onClick={() => viewResult(row._id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm ml-2">
                            <Eye className="w-4 h-4" /> View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalCount > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-1">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                  <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Layout(ExamHistory);
