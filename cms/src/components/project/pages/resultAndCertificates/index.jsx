import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";

//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const ResultAndCertificates = (props) => {
  //to update Certificatesthe page title
  useEffect(() => {
    document.title = `Results - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "select",
      apiType: "API",
      selectApi: "hall-ticket/select",
      placeholder: "Hall Ticket",
      name: "hallTicket",
      validation: "",
      collection: "hallTicket",
      showItem: "hallTicket",
      default: "",
      label: "Hall Ticket",
      tag: true,
      required: false,
      view: true,
      add: true,
      update: true,
      filter: false,
    },
    {
      type: "number",
      placeholder: "Score",
      name: "score",
      validation: "",
      default: "",
      label: "Score",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Grade",
      name: "grade",
      validation: "",
      default: "",
      label: "Grade",
      tag: true,
      required: false,
      view: true,
      add: true,
      update: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`result-certificates`}
        // itemTitle={`label`}
        itemTitle={{
          name: "score",
          type: "number",
          collection: "",
        }}
        shortName={`Result`}
        formMode={`single`}
        surfaceTheme={"district"}
        attributes={attributes}
        {...props}
      ></ListTable>
    </Container>
  );
};

export default Layout(ResultAndCertificates);
