import React, { useEffect, useState, useCallback } from "react";
import {
  Search, ChevronLeft, ChevronRight, Trophy, Clock, CheckCircle, XCircle, MinusCircle,
  BarChart3, Users, ArrowLeft, Eye, User2, Timer,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData } from "../../../../backend/api";

const PAGE_SIZE = 20;

const OnlineExamResults = (props) => {
  useEffect(() => {
    document.title = `Online Exam Results - QSC Automation`;
  }, []);

  const [exams, setExams] = useState([]);
  const [selExam, setSelExam] = useState("");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null); // attempt detail view
  const [detailResponses, setDetailResponses] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await getData({}, "online-exam/select");
      setExams(r?.data || []);
    })();
  }, []);

  const load = useCallback(async () => {
    if (!selExam) return;
    setLoading(true);
    try {
      const q = { exam: selExam, skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
      if (search) q.searchkey = search;
      const r = await getData(q, "online-exam/results");
      setRows(r?.data?.response || []);
      setTotalCount(r?.data?.totalCount || 0);
      setStats(r?.data?.stats || null);
    } finally {
      setLoading(false);
    }
  }, [selExam, page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const openDetail = async (attemptId) => {
    setDetailLoading(true);
    try {
      const r = await getData({}, `online-exam/results/detail/${attemptId}`);
      setDetail(r?.data?.attempt || null);
      setDetailResponses(r?.data?.responses || []);
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

  // DETAIL VIEW
  if (detail) {
    return (
      <Container className="noshadow">
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          <button onClick={() => setDetail(null)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Attempt Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Student</span>
                <strong>{detail.user?.nameOfApplicant || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Reg No</span>
                <strong>{detail.user?.regno || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">District</span>
                <strong>{detail.user?.district?.district || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Area</span>
                <strong>{detail.user?.area?.area || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Score</span>
                <strong className={detail.isPassed ? "text-emerald-600" : "text-red-600"}>
                  {detail.totalScore} / {detail.maxScore}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block">Percentage</span>
                <strong>{detail.percentage}%</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Time Taken</span>
                <strong>{formatTime(detail.totalTimeTaken)}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${detail.isPassed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {detail.isPassed ? <><CheckCircle className="w-3 h-3" /> Passed</> : <><XCircle className="w-3 h-3" /> Failed</>}
                </span>
              </div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <h3 className="text-base font-semibold text-gray-800 mb-3">Question-wise Breakdown</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Selected</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody>
                {detailResponses.map((r, i) => (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{r.question?.question || "—"}</td>
                    <td className="px-4 py-3 text-center font-medium">{r.selectedAnswer || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-center font-medium text-emerald-600">{r.question?.correctAnswer}</td>
                    <td className="px-4 py-3 text-center">
                      {!r.selectedAnswer ? (
                        <MinusCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      ) : r.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">{formatTime(r.timeTaken)}</td>
                    <td className="px-4 py-3 text-center font-medium">{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    );
  }

  // LIST VIEW
  return (
    <Container className="noshadow">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Exam Results</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selExam}
              onChange={(e) => { setSelExam(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Exam</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.value}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-56"
              />
            </div>
          </div>
        </div>

        {!selExam ? (
          <div className="text-center py-20 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Select an exam to view results.</p>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
                <StatCard icon={Users} label="Total Attempts" value={stats.totalAttempts} />
                <StatCard icon={CheckCircle} label="Passed" value={stats.passCount} color="text-emerald-600" />
                <StatCard icon={XCircle} label="Failed" value={stats.failCount} color="text-red-600" />
                <StatCard icon={Trophy} label="Top Score" value={stats.maxScore} />
                <StatCard icon={BarChart3} label="Avg %" value={`${(stats.avgPercentage || 0).toFixed(1)}%`} />
                <StatCard icon={Clock} label="Avg Time" value={formatTime(Math.round(stats.avgTime || 0))} />
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">%</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Wrong</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Skipped</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={11} className="text-center py-10 text-gray-400">Loading...</td></tr>
                    ) : rows.length === 0 ? (
                      <tr><td colSpan={11} className="text-center py-10 text-gray-400">No results found.</td></tr>
                    ) : rows.map((row) => (
                      <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-700">{row.rank}</td>
                        <td className="px-4 py-3 text-gray-800">{row.user?.nameOfApplicant || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{row.user?.regno || "—"}</td>
                        <td className="px-4 py-3 text-center font-semibold">{row.totalScore} / {row.maxScore}</td>
                        <td className="px-4 py-3 text-center">{row.percentage}%</td>
                        <td className="px-4 py-3 text-center text-emerald-600">{row.totalCorrect}</td>
                        <td className="px-4 py-3 text-center text-red-500">{row.totalWrong}</td>
                        <td className="px-4 py-3 text-center text-gray-400">{row.totalSkipped}</td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">{formatTime(row.totalTimeTaken)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${row.isPassed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {row.isPassed ? "Pass" : "Fail"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openDetail(row._id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > PAGE_SIZE && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                  <div className="flex gap-1">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

const StatCard = ({ icon: Icon, label, value, color = "text-gray-800" }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
      <Icon className="w-3.5 h-3.5" /> {label}
    </div>
    <div className={`text-lg font-bold ${color}`}>{value}</div>
  </div>
);

const formatTime = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export default Layout(OnlineExamResults);
