import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import { postData } from "../../../../backend/api";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const HallTicket = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Hall Ticket - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-registration/select",
      placeholder: "Name Of Applicant",
      name: "nameOfApplicant",
      collection: "",
      showItem: "nameOfApplicant",
      validation: "",
      default: "",
      tag: true,
      label: "Name Of Applicant",
      required: false,
      view: true,
      add: true,
      update: true,
      filter: false,
      customClass: "full",
      search: true,
    },
    {
      type: "text",
      name: "regno",
      collection: "nameOfApplicant",
      showItem: "regno",
      label: "Reg No",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "number",
      name: "mobileNumber",
      collection: "nameOfApplicant",
      showItem: "mobileNumber",
      label: "Mobile Number",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "status",
      collection: "nameOfApplicant",
      showItem: "status",
      label: "Mode of Study",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "district",
      collection: "nameOfApplicant",
      showItem: "district",
      showSubItem: "district",
      label: "District",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "area",
      collection: "nameOfApplicant",
      showItem: "area",
      showSubItem: "area",
      label: "Area",
      tag: false,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "centerRegistration",
      collection: "nameOfApplicant",
      showItem: "centerRegistration",
      showSubItem: "nameOfCenter",
      label: "Study Center",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "nameOfExamAppearingNow",
      collection: "nameOfApplicant",
      showItem: "nameOfExamAppearingNow",
      showSubItem: "examType",
      label: "Exam Type",
      tag: true,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "assignedExamCenter",
      collection: "nameOfApplicant",
      showItem: "assignedExamCenter",
      showSubItem: "nameOfCenter",
      label: "Exam Center",
      tag: false,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "text",
      name: "gender",
      collection: "nameOfApplicant",
      showItem: "gender",
      label: "Gender",
      tag: false,
      view: true,
      add: false,
      update: false,
      filter: false,
    },
  ]);

  const [actions] = useState([
    {
      element: "button",
      type: "callback",
      callback: (item, data, refreshView) => {
        console.log(data);
        getApproved(data?._id, data.nameOfApplicant.mobileNumber, refreshView);
      },
      icon: "hall-ticket",
      title: "Download Hall Ticket",
      params: {
        api: ``,
        parentReference: "",
        itemTitle: {
          name: "nameOfApplicant",
          type: "text",
          collection: "nameOfApplicant",
        },
        shortName: "Download Hall Ticket",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "medium",
      },
      actionType: "button",
    },
  ]);

  const getApproved = (id, mobileNumber, refreshView) => {
    console.log({ id });
    props.setLoaderBox(true);
    postData({ mobileNumber }, "hall-ticket/download")
      .then((response) => {
        console.log(response.data.url);
        props.setLoaderBox(false);
        if (response.data) {
          props.setMessage({ content: response.data.message });
          window.open(response.data.url, "_blank");
          refreshView();
        } else {
          console.error("Response data is undefined.");
        }
      })
      .catch((error) => {
        props.setLoaderBox(false);
        console.error("API request error:", error);
        props.setMessage({ content: error.response?.data?.customMessage || "Error downloading hall ticket", type: "error" });
      });
  };

  return (
    <Container className="noshadow">
      <ListTable
        actions={actions}
        api={`hall-ticket`}
        itemTitle={{
          name: "nameOfApplicant",
          type: "text",
          collection: "nameOfApplicant",
        }}
        shortName={`Hall Ticket`}
        formMode={`single`}
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};

export default Layout(HallTicket);
