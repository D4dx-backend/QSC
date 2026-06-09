import React, { lazy, Suspense } from "react";
import Loader from "../../core/loader/index.jsx";

// Lazy load all components
const Landing = lazy(() => import("../../public/landing"));
const Menu = lazy(() => import("../pages/menu/index.jsx"));
const Franchise = lazy(() => import("../pages/franchise/index.jsx"));
const Page404 = lazy(() => import("../pages/page404/index.jsx"));
const UserType = lazy(() => import("../pages/user/userType/index.jsx"));
const UserList = lazy(() => import("../pages/user/userList/index.jsx"));
const Dashboard = lazy(() => import("../pages/dashboard/index.jsx"));
const Admin = lazy(() => import("../pages/franchise/admin.jsx"));
const Elements = lazy(() => import("../pages/settings/elements/index.jsx"));
const Settings = lazy(() => import("../../core/settings/index.jsx"));
const District = lazy(() => import("../pages/district/index.jsx"));
const Area = lazy(() => import("../pages/area/index.jsx"));
const ResultAndCertificates = lazy(() => import("../pages/resultAndCertificates/index.jsx"));
const ExamRegistration = lazy(() => import("../pages/examRegistration/index.jsx"));
const ExamType = lazy(() => import("../pages/examType/index.jsx"));
const HallTicket = lazy(() => import("../pages/hallTicket/index.jsx"));
const OldQuestionPapers = lazy(() => import("../pages/oldQuestionPapers/index.jsx"));
const ExamCenterRegistration = lazy(() => import("../pages/examCenterRegistration/index.jsx"));
const CenterRegistration = lazy(() => import("../pages/centerRegistration/index.jsx"));
const DistrictAdmin = lazy(() => import("../pages/district/districtAdmin.jsx"));
const FloatingMenuSettings = lazy(() => import("../pages/floatingMenuSettings/index.jsx"));
const MarkEntry = lazy(() => import("../pages/markEntry/index.jsx"));
const ResultPublish = lazy(() => import("../pages/resultPublish/index.jsx"));
const ExamScore = lazy(() => import("../pages/examScore/index.jsx"));
const Syllabus = lazy(() => import("../pages/syllabus/index.jsx"));
const ExamCenterAttendance = lazy(() => import("../pages/examCenterAttendance/index.jsx"));
const QuestionPacking = lazy(() => import("../pages/questionPacking/index.jsx"));
const CertificateManagement = lazy(() => import("../pages/certificateManagement/index.jsx"));
const OutsideCenter = lazy(() => import("../pages/outSideCenter/index.jsx"));
const ExamAllocation = lazy(() => import("../pages/examAllocation/index.jsx"));
const ExamSettingsPage = lazy(() => import("../pages/examSettings/index.jsx"));
const RankList = lazy(() => import("../pages/rankList/index.jsx"));
const DataReset = lazy(() => import("../pages/dataReset/index.jsx"));
const QuestionPoolPage = lazy(() => import("../pages/questionPool/index.jsx"));
const OnlineExamPage = lazy(() => import("../pages/onlineExam/index.jsx"));
const OnlineExamResults = lazy(() => import("../pages/onlineExamResults/index.jsx"));
const StudentHomePage = lazy(() => import("../pages/studentHome/index.jsx"));
const TakeExam = lazy(() => import("../pages/takeExam/index.jsx"));
const PracticeExam = lazy(() => import("../pages/practiceExam/index.jsx"));
const ExamHistoryPage = lazy(() => import("../pages/examHistory/index.jsx"));
const MasterData = lazy(() => import("../pages/masterData/index.jsx"));

const RenderPage = (page, key, privileges) => {
  const renderComponent = (Component) => (
    <Suspense fallback={<Loader>Loading...</Loader>}>
      <Component key={key} {...privileges} />
    </Suspense>
  );

  switch (page) {
    case "login":
      return renderComponent(Landing);
    case "landing":
      return renderComponent(Landing);
    case "menu":
      return renderComponent(Menu);
    case "franchise":
      return renderComponent(Franchise);
    case "user-role":
      return renderComponent(UserType);
    case "user":
      return renderComponent(UserList);
    case "dashboard":
      return renderComponent(Dashboard);
    case "admin":
      return renderComponent(Admin);
    case "elements":
      return renderComponent(Elements);
    case "settings":
      return renderComponent(Settings);

    case "district":
      return renderComponent(District);
    case "area":
      return renderComponent(Area);
    case "result-And-Certificates":
      return renderComponent(ResultAndCertificates);
    case "exam-registration":
      return renderComponent(ExamRegistration);
    case "exam-type":
      return renderComponent(ExamType);
    case "hall-ticket":
      return renderComponent(HallTicket);
    case "old-question-papers":
      return renderComponent(OldQuestionPapers);
    case "about-us":
      return renderComponent(FloatingMenuSettings);
    case "exam-center-registration":
      return renderComponent(ExamCenterRegistration);
    case "center-registration":
      return renderComponent(CenterRegistration);
    case "district-admin":
      return renderComponent(DistrictAdmin);
    case "floating-menu-settings":
      return renderComponent(FloatingMenuSettings);
    case "landing-page-settings":
      return renderComponent(FloatingMenuSettings);
    case "mark-entry":
      return renderComponent(MarkEntry);
    case "result-publish":
      return renderComponent(ResultPublish);
    case "exam-score":
      return renderComponent(ExamScore);
    case "syllabus":
      return renderComponent(Syllabus);
    case "exam-center-attendance":
      return renderComponent(ExamCenterAttendance);
    case "question-packing":
      return renderComponent(QuestionPacking);
    case "certificate-management":
      return renderComponent(CertificateManagement);
    case "outside-center-list":
      return renderComponent(OutsideCenter);
    case "exam-allocation":
      return renderComponent(ExamAllocation);
    case "exam-settings":
      return renderComponent(ExamSettingsPage);
    case "rank-list":
      return renderComponent(RankList);
    case "data-reset":
      return renderComponent(DataReset);
    case "question-pool":
      return renderComponent(QuestionPoolPage);
    case "online-exam":
      return renderComponent(OnlineExamPage);
    case "online-exam-results":
      return renderComponent(OnlineExamResults);
    case "student-home":
      return renderComponent(StudentHomePage);
    case "take-exam":
      return renderComponent(TakeExam);
    case "practice-exam":
      return renderComponent(PracticeExam);
    case "exam-history":
      return renderComponent(ExamHistoryPage);
    case "question-papers":
      return renderComponent(OldQuestionPapers);
    case "master-data":
      return renderComponent(MasterData);
    default:
      return renderComponent(Page404);
  }
};
export default RenderPage;
