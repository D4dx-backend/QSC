import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const ExamType = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Exam Type - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "text",
      placeholder: "ExamType",
      name: "examType",
      validation: "",
      default: "",
      tag: true,
      label: "ExamType",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Exam Short Name",
      name: "examShortName",
      validation: "",
      default: "",
      tag: true,
      label: "ExamShortName",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      // Phase 3 — State vs District. Drives certificate template picker and
      // admin filtering. Existing rows default to "District" on the server.
      type: "select",
      apiType: "CSV",
      selectApi: "State,District",
      placeholder: "Exam Level",
      name: "examLevel",
      validation: "",
      default: "District",
      tag: true,
      label: "Exam Level",
      showItem: "examLevel",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      // Phase 3 — Regular vs Private. The *exam itself* has two variants:
      // one paper for Regular candidates, another for Private candidates.
      // Certificate template picker uses (examLevel × examCategory).
      type: "select",
      apiType: "CSV",
      selectApi: "Regular,Private",
      placeholder: "Exam Category",
      name: "examCategory",
      validation: "",
      default: "Regular",
      tag: true,
      label: "Exam Category",
      showItem: "examCategory",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`exam-type`}
        itemTitle={{
          name: "examType",
          type: "text",
          collection: "",
        }}
        shortName={`Exam Type`}
        formMode={`single`}
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};

export default Layout(ExamType);
