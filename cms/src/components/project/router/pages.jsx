import { lazy } from "react";
import page404 from "../pages/page404";
// const attendee = lazy(() => import("../pages/event/attendee"));
// const approval = lazy(() => import("../pages/event/approval"));
const dashboard = lazy(() => import("../pages/dashboard"));
const RenderSubPage = (element, content) => {
  if (content) {
    return content;
  } else {
    switch (element.page) {
      // case "attendee":
      //   return attendee;
      case "dashboard":
        return dashboard;
      // case "approval":
      //   return approval;
      default:
        return page404;
    }
  }
};

export default RenderSubPage;
