import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Download,
  FileBadge2,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  Sparkles,
  Ticket,
  Trophy,
  UserRound,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, postData } from "../../../../backend/api";
import { getStoredStudentProfile, resolveAssetUrl } from "../shared/studentSession";

const notificationToneClass = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
};

const statusClass = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  abandoned: "bg-rose-50 text-rose-700 border-rose-200",
};

const StudentHome = (props) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Home - QSC Automation";
  }, []);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getData({}, "auth/student-home");
      if (response?.data?.success) {
        setSummary(response.data.response || null);
      } else {
        props.setMessage?.({
          type: 1,
          content: response?.data?.message || "Could not load your home screen.",
          proceed: "Okay",
        });
      }
    } catch (error) {
      props.setMessage?.({
        type: 1,
        content: error?.message || "Could not load your home screen.",
        proceed: "Okay",
      });
    } finally {
      setLoading(false);
    }
  }, [props]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const fallbackProfile = useMemo(() => getStoredStudentProfile(), []);
  const student = summary?.student || fallbackProfile;
  const bannerImage = resolveAssetUrl(summary?.banner?.image);

  const quickActions = useMemo(
    () => [
      {
        id: "take-exam",
        label: "Take Exam",
        description: summary?.actions?.liveExamCount
          ? `${summary.actions.liveExamCount} live exam${summary.actions.liveExamCount > 1 ? "s are" : " is"} available now.`
          : "No live exam is currently open for your registration.",
        icon: BookOpen,
        disabled: !summary?.actions?.liveExamCount,
        action: () => navigate("/take-exam"),
        accent: "from-blue-600 to-blue-500",
      },
      {
        id: "practice-exam",
        label: "Practice Exam",
        description: summary?.actions?.practiceExamCount
          ? `${summary.actions.practiceExamCount} practice option${summary.actions.practiceExamCount > 1 ? "s are" : " is"} ready for revision.`
          : "No practice exam is mapped to your registered exam yet.",
        icon: Sparkles,
        disabled: !summary?.actions?.practiceExamCount,
        action: () => navigate("/practice-exam"),
        accent: "from-emerald-600 to-emerald-500",
      },
      {
        id: "exam-history",
        label: "Exam History",
        description: summary?.recentAttempts?.length
          ? `You have ${summary.recentAttempts.length} recent online exam record${summary.recentAttempts.length > 1 ? "s" : ""}.`
          : "Your completed and in-progress attempts will appear here.",
        icon: ScrollText,
        disabled: false,
        action: () => navigate("/exam-history"),
        accent: "from-slate-800 to-slate-700",
      },
    ],
    [navigate, summary]
  );

  const utilityActions = useMemo(() => {
    const items = [];

    if (summary?.downloads?.hallTicket?.available) {
      items.push({
        id: "hall-ticket",
        label: "Hall Ticket",
        description: "Download your hall ticket when you are ready for the exam.",
        icon: Ticket,
      });
    }

    if (summary?.downloads?.certificate?.available) {
      items.push({
        id: "certificate",
        label: "Certificate",
        description: "Your latest result certificate is ready to download.",
        icon: FileBadge2,
      });
    }

    return items;
  }, [summary]);

  const handleDownloadHallTicket = async () => {
    props.setLoaderBox?.(true);
    try {
      const response = await postData(
        { mobileNumber: summary?.downloads?.hallTicket?.mobileNumber || student.mobile },
        "hall-ticket/download"
      );

      if (response?.data?.success && response?.data?.url) {
        window.open(resolveAssetUrl(response.data.url), "_blank", "noopener,noreferrer");
      } else {
        props.setMessage?.({
          type: 1,
          content: response?.data?.customMessage || response?.data?.message || "Hall ticket is not available right now.",
          proceed: "Okay",
        });
      }
    } finally {
      props.setLoaderBox?.(false);
    }
  };

  const handleDownloadCertificate = async () => {
    props.setLoaderBox?.(true);
    try {
      const response = await getData(
        { regno: summary?.downloads?.certificate?.regno || student.regno || student.mobile },
        "exam-registration/download-state-certificate"
      );

      if (response?.data?.success && response?.data?.url) {
        window.open(resolveAssetUrl(response.data.url), "_blank", "noopener,noreferrer");
      } else {
        props.setMessage?.({
          type: 1,
          content: response?.data?.customMessage || response?.data?.message || "Certificate is not available right now.",
          proceed: "Okay",
        });
      }
    } finally {
      props.setLoaderBox?.(false);
    }
  };

  const notifications = summary?.notifications || [];
  const recentAttempts = summary?.recentAttempts || [];

  if (loading) {
    return (
      <Container className="noshadow">
        <div className="max-w-6xl mx-auto p-4 md:p-6 xl:p-8 space-y-6 animate-pulse">
          <div className="h-64 rounded-[28px] border border-slate-200 bg-slate-100" />
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="h-52 rounded-[28px] border border-slate-200 bg-slate-100" />
              <div className="h-56 rounded-[28px] border border-slate-200 bg-slate-100" />
            </div>
            <div className="space-y-6">
              <div className="h-64 rounded-[28px] border border-slate-200 bg-slate-100" />
              <div className="h-40 rounded-[28px] border border-slate-200 bg-slate-100" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="noshadow">
      <div className="max-w-6xl mx-auto p-4 md:p-6 xl:p-8 space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white p-6 md:p-8 lg:p-10">
              {bannerImage ? <img src={bannerImage} alt="Student home banner" className="absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-blue-900/85" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-blue-100">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Home
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-blue-100/90">{summary?.banner?.title || "Welcome"}</p>
                  <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                    Welcome, {student?.name || "Student"}
                  </h1>
                  <p className="max-w-2xl text-sm md:text-base text-slate-200 leading-7">
                    {summary?.banner?.description || "Your online exam access, downloads, and updates stay in one place."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/take-exam")}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100"
                  >
                    <BookOpen className="h-4 w-4" />
                    Take Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/practice-exam")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    <Sparkles className="h-4 w-4" />
                    Practice Exam
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-slate-200">
              <div className="flex items-center gap-3 text-slate-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Registered student</p>
                  <h2 className="text-lg font-semibold text-slate-900">{student?.name || "Student"}</h2>
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Mobile</dt>
                  <dd className="font-medium text-right">{student?.mobile || "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Reg No</dt>
                  <dd className="font-medium text-right">{student?.regno || "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Registered Exam</dt>
                  <dd className="font-medium text-right max-w-[16rem]">{student?.registeredExam || "Not mapped yet"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">District</dt>
                  <dd className="font-medium text-right">{student?.district || "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Area</dt>
                  <dd className="font-medium text-right">{student?.area || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
                  <p className="text-sm text-slate-500">Everything important for the student flow stays here.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={action.action}
                      disabled={action.disabled}
                      className={`group rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition ${
                        action.disabled ? "cursor-not-allowed opacity-55" : "hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.accent} text-white shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-semibold text-slate-900">{action.label}</h3>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700" />
                        </div>
                        <p className="text-sm leading-6 text-slate-500">{action.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {utilityActions.length > 0 ? (
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-slate-900">Downloads</h2>
                  <p className="text-sm text-slate-500">Only documents that are currently available are shown here.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {utilityActions.map((item) => {
                    const Icon = item.icon;
                    const handleClick = item.id === "hall-ticket" ? handleDownloadHallTicket : handleDownloadCertificate;

                    return (
                      <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">{item.label}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleClick}
                          className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                        >
                          <Download className="h-4 w-4" />
                          Download {item.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
                  <p className="text-sm text-slate-500">Your latest exam and practice attempts appear here.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/exam-history")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  View history
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  No online exam activity yet. Once you start an exam or practice session, it will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt._id} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 md:px-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">{attempt?.exam?.title || "Online Exam"}</h3>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[attempt.status] || statusClass.abandoned}`}>
                              {attempt.status === "in_progress" ? "In Progress" : attempt.status === "completed" ? "Completed" : "Abandoned"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            {attempt.attemptType === "practice" ? "Practice session" : attempt?.exam?.examType || "Exam"}
                            {attempt.percentage ? ` • ${attempt.percentage}%` : ""}
                          </p>
                        </div>
                        <div className="text-sm text-slate-500 md:text-right">
                          <div>{new Date(attempt.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                          {attempt.totalScore || attempt.totalScore === 0 ? <div className="font-medium text-slate-800">{attempt.totalScore} marks</div> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
                  <p className="text-sm text-slate-500">Important updates for your student account appear here.</p>
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-[22px] border px-4 py-4 ${notificationToneClass[notification.tone] || notificationToneClass.neutral}`}
                  >
                    <h3 className="text-sm font-semibold">{notification.title}</h3>
                    <p className="mt-1 text-sm leading-6 opacity-85">{notification.description}</p>
                    {notification.actionPath ? (
                      <button
                        type="button"
                        onClick={() => navigate(notification.actionPath)}
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/70 px-3 py-1.5 text-xs font-medium transition hover:bg-white"
                      >
                        {notification.actionLabel || "Open"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Current Student</h2>
                  <p className="text-sm text-slate-500">The logged-in member details shown below are used for online exams.</p>
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-lg font-semibold text-slate-900">{student?.name || "Student"}</p>
                <p className="mt-1 text-sm text-slate-500">{student?.registeredExam || "Registered exam will appear here once mapped."}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mobile</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{student?.mobile || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Registration</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{student?.regno || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Exams</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{summary?.actions?.liveExamCount || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Practice Exams</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{summary?.actions?.practiceExamCount || 0}</p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Container>
  );
};

export default Layout(StudentHome);