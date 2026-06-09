import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";

const QuestionPool = (props) => {
  useEffect(() => {
    document.title = `Question Pool - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-type/select",
      placeholder: "Exam",
      name: "exam",
      validation: "",
      default: "",
      tag: true,
      label: "Exam",
      showItem: "examType",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      type: "textarea",
      placeholder: "Question",
      name: "question",
      validation: "",
      default: "",
      tag: true,
      label: "Question",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Option A",
      name: "optionA",
      validation: "",
      default: "",
      tag: false,
      label: "Option A",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Option B",
      name: "optionB",
      validation: "",
      default: "",
      tag: false,
      label: "Option B",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Option C",
      name: "optionC",
      validation: "",
      default: "",
      tag: false,
      label: "Option C",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Option D",
      name: "optionD",
      validation: "",
      default: "",
      tag: false,
      label: "Option D",
      showItem: "",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "select",
      apiType: "CSV",
      selectApi: "A,B,C,D",
      placeholder: "Correct Answer",
      name: "correctAnswer",
      validation: "",
      default: "A",
      tag: true,
      label: "Answer",
      showItem: "correctAnswer",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "number",
      placeholder: "Score",
      name: "score",
      validation: "",
      default: "1",
      tag: true,
      label: "Score",
      showItem: "",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "textarea",
      placeholder: "Description / Explanation",
      name: "description",
      validation: "",
      default: "",
      tag: false,
      label: "Description",
      showItem: "",
      required: false,
      view: false,
      add: true,
      update: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        api={`question-pool`}
        itemTitle={{
          name: "question",
          type: "text",
          collection: "",
        }}
        shortName={`Question`}
        formMode={`double`}
        surfaceTheme={"district"}
        bulkUplaod={true}
        {...props}
        attributes={attributes}
      />
    </Container>
  );
};

export default Layout(QuestionPool);
