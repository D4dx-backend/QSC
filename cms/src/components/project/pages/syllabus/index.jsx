import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const Syllabus = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Syllabus - QSC Automation`;
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2023 + 3 }, (_, i) => 2023 + i).join(", ");

  const [attributes] = useState([
    {
      type: "text",
      placeholder: "Syllabus",
      name: "syllabus",
      validation: "",
      default: "",
      label: "Syllabus",
      tag: true,
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "select",
      placeholder: "Year",
      apiType: "CSV",
      selectApi: years,
      name: "year",
      validation: "",
      default: "",
      label: "Year",
      tag: true,
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "file",
      placeholder: "Attachment",
      name: "attachment",
      validation: "",
      default: "",
      tag: false,
      label: "Attachment",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`syllabus`}
        itemTitle={{
          name: "syllabus",
          type: "text",
          collection: "",
        }}
        shortName={`Syllabus`}
        formMode={`single`}
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};

export default Layout(Syllabus);
