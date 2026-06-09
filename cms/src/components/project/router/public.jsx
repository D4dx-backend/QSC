import { Route } from "react-router-dom";
import Login from "../../public/login";
import StudentLogin from "../../public/studentLogin";
import QuestionPapersComponent from "../../public/landing/questionPapers";
import About from "../../public/landing/about/about";
// import ResultPublish from "../pages/resultPublish";
import Results from "../../public/landing/results";

const CustomPublicRoute = () => [<Route key="landing-page" path="/admin" element={<Login key={"landing-page"} />} />, <Route key="student-login" path="/student" element={<StudentLogin key={"student-login"} />} />, <Route key="question-papers" path="/question-papers" element={<QuestionPapersComponent key={"question-papers"} />} />, <Route key="about-us" path="/about-us" element={<About key={"about-us"} />} />, <Route key="result" path="/result" element={<Results key={"result"} />} />];

export default CustomPublicRoute;
