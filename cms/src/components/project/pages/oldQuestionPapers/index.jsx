import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const OldQuestionPaper = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Old Question Paper - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "text",
      placeholder: "Title",
      name: "title",
      validation: "",
      default: "",
      label: "Title",
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
      selectApi: "2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026",
      name: "year",
      validation: "",
      default: "",
      label: "Year",
      required: true,
      view: true,
      add: true,
      update: true,
      tag: true,
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
      allowedFileTypes: ["image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`old-question-papers`}
        itemTitle={{
          name: "title",
          type: "text",
          collection: "",
        }}
        shortName={`Old Question Paper`}
        formMode={`single`}
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};

export default Layout(OldQuestionPaper);
