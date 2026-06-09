import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const ExamCenterRegistration = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = "Exam Center Registration - QSC Automation";
  }, []);

  const [attributes] = useState([
    {
      type: "text",
      placeholder: "Center Name",
      name: "centerName",
      validation: "",
      default: "",
      tag: true,
      label: "Center Name",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "District",
      name: "district",
      validation: "",
      showItem: "district",
      default: "",
      tag: true,
      label: "District",
      required: false,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      type: "number",
      placeholder: "Male",
      name: "maleCount",
      validation: "",
      default: "",
      label: "Male",
      required: false,
      view: false,
      add: false,
      update: false,
      export: true,
    },
    {
      type: "number",
      placeholder: "Female",
      name: "femaleCount",
      validation: "",
      default: "",
      label: "Female",
      required: false,
      view: false,
      add: false,
      update: false,
      export: true,
    },
    {
      type: "number",
      placeholder: "Total Count",
      name: "totalCount",
      validation: "",
      default: "",
      label: "Total Count",
      required: false,
      view: false,
      add: false,
      update: false,
      export: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={"exam-center-registration"}
        itemTitle={{
          name: "centerName",
          type: "text",
          collection: "",
        }}
        shortName={"Exam Center Registration"}
        formMode={"single"}
        displayColumn="double"
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};

export default Layout(ExamCenterRegistration);
