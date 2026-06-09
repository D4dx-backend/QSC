import React, { useEffect, useState } from "react";
import { Button, ElementContainer, TextBox } from "../../../core/elements";
import Layout from "../../../core/layout";
import styled from "styled-components";
import { getData, postData } from "../../../../backend/api"; // Assuming you have a postData function for posting data
import ListTable from "../../../core/list/list";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file

const TextDiv = styled.div`
  display: flex;
  gap: 10px;
  width: 50%;
`;
const ButtonDiv = styled.div`
  margin-top: 23px;
`;

const MarkEntry = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Mark Entry - QSC Automation`;
  }, []);
  const [regNo, setRegNo] = useState("");
  const [score, setScore] = useState("");
  const [name, setName] = useState("");
  const [exam, setExam] = useState("");
  const [student, setstudent] = useState("");

  const [attributes] = useState([

    {
      // Export-only SI number provided by API
      type: "number",
      placeholder: "Sl no",
      name: "slno",
      validation: "",
      default: "",
      label: "Sl no",
      required: false,
      tag: false,
      view: false,
      add: false,
      update: false,
      filter: false,
      export: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-registration/select",
      placeholder: "Name",
      updateOn: "",
      name: "student",
      validation: "",
      showItem: "nameOfApplicant",
      search: true,
      default: "",
      tag: true,
      label: "Name",
      required: true,
      view: true,
      add: true,
      update: true,
      export: true,
      filter: false,
    },
    
    {
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "District",
      updateOn: "",
      name: "district",
      validation: "",
      showItem: "district",
      search: true,
      default: "",
      tag: true,
      label: "District",
      required: false,
      view: false,
      add: false,
      update: false,
      filter: true,
      export: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "area/get-area-by-district",
      placeholder: "Area",
      updateOn: "district",
      name: "area",
      validation: "",
      showItem: "area",
      search: true,
      default: "",
      tag: true,
      label: "Area",
      required: false,
      view: false,
      add: false,
      update: false,
      filter: true,
      export: false,
    },
    {
      type: "text",
      placeholder: "Registration number",
      name: "studentRegNo",
      validation: "",
      default: "",
      label: "Registration number",
      required: false,
      tag: true,
      view: true,
      export: true,
      collection: "student",
      showItem: "regno",
    },
    {
      // Phase 2.5 — Private/Regular status from the linked exam registration (view/export only)
      // Phase 3 — also exposed as a filter; resolved server-side in getExamScore.
      type: "select",
      apiType: "CSV",
      selectApi: "Private,Regular",
      placeholder: "P / R",
      name: "studentStatus",
      validation: "",
      default: "",
      label: "P/R",
      required: false,
      tag: true,
      view: true,
      export: true,
      filter: true,
      collection: "student",
      showItem: "status",
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-type/select",
      placeholder: "Name of Exam",
      updateOn: "",
      name: "exam",
      validation: "",
      collection: "exam",
      showItem: "examType",
      search: true,
      default: "",
      tag: true,
      label: "Name of Exam",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      export: true,
    },
    {
      type: "number",
      placeholder: "Mark",
      name: "score",
      validation: "",
      default: "",
      label: "Mark",
      tag: true,
      required: false,
      view: true,
      add: true,
      update: true,
      export: true,
    },
    {
      type: "text",
      placeholder: "Grade",
      name: "grade",
      validation: "",
      default: "",
      label: "Grade",
      tag: false,
      required: false,
      view: true,
      add: true,
      update: true,
      export: true,
    },
  ]);

  const handleSubmit = () => {
    // Prepare the data to be sent to the backend
    const formData = {
      regNo,
      student,
      exam,
      score,
    };
    // Send the data using postData
    postData(formData, "exam-score")
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
        // You can add any additional logic here, like resetting the form or showing a success message
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        // Handle any errors here, like showing an error message to the user
      });
  };

  return (
    <ElementContainer
      className="dashboard"
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "0px",
        flexWrap: "nowrap",
      }}
    >
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <h2 style={{ marginTop: "0px", marginBottom: "10px" }}>Student Mark Entry</h2>
        <TextDiv>
          <TextBox
            className="text-box"
            label="Enter Register Number"
            value={regNo}
            onChange={(value) => {
              console.log("Text Changed", value);
              setRegNo(value);
            }}
          ></TextBox>
          <ButtonDiv>
            <Button
              className="btn-search"
              type={"secondary"}
              align="right"
              icon={"search"}
              ClickEvent={() => {
                getData({ regno: regNo }, "exam-registration").then((response) => {
                  console.log(response.data.response[0]);
                  setName(response.data.response[0].nameOfApplicant);
                  setstudent(response.data.response[0]._id);
                  setExam(response.data.response[0].nameOfExamAppearingNow._id);
                });
              }}
              value="Search"
            ></Button>
          </ButtonDiv>
        </TextDiv>
        <p style={{ textAlign: "left", marginBottom: "10px", marginTop: "10px" }}>Name : {name} </p>
        <TextDiv>
          <TextBox
            className="text-box"
            label="Enter Score"
            value={score}
            onChange={(value) => {
              console.log("Text Changed", value);
              setScore(value);
            }}
          ></TextBox>
          <ButtonDiv>
            <Button
              type={"secondary"}
              align="right"
              icon={"checked"}
              ClickEvent={handleSubmit} // Use handleSubmit function here
              value="Submit"
            ></Button>
          </ButtonDiv>
        </TextDiv>
      </div>
      <ListTable
        api={`exam-score`}
        itemTitle={{
          name: "nameOfApplicant",
          type: "text",
          collection: "student",
        }}
        shortName={`Exam Score`}
        formMode={`single`}
        surfaceTheme={"district"}
        // viewMode="table"
        attributes={attributes}
        {...props}
        addPrivilege={false}
        delPrivilege={true}
        printPrivilege={false}
        exportPrivilege={true}
      ></ListTable>
    </ElementContainer>
  );
};

export default Layout(MarkEntry);
