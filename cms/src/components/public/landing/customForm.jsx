import React from "react";
import {
  // TextBox,
  ElementContainer,
  // Button,
  // Select,
  // TextArea,
} from "../../core/elements";
import { postData } from "../../../backend/api";
// import { RowContainer } from "../../styles/containers/styles";
// import { FormContainer } from "./custom/styles";
import AutoForm from "../../core/form";

const CustomForm = (props) => {
  

  const formInput = [
    {
      type: "text",
      placeholder: "Name Of Applicant",
      name: "nameOfApplicant",
      validation: "",
      default: "",
      label: "Name Of Applicant",
      required: true,
      add: true,
      customClass: "full",
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "District",
      name: "district",
      validation: "",
      showItem: "userDisplayName",
      default: "",
      tag: false,
      label: "District",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "area/select",
      placeholder: "Area",
      updateOn: "district",
      name: "area",
      validation: "",
      showItem: "userDisplayName",
      default: "",
      tag: false,
      label: "Area",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      type: "textarea",
      placeholder: "Address",
      name: "address",
      validation: "",
      default: "",
      label: "Address",
      required: true,
      add: true,
    },
    {
      type: "Number",
      placeholder: "Age",
      name: "age",
      validation: "",
      default: "",
      label: "Age",
      required: true,
      add: true,
    },
    {
      type: "Number",
      placeholder: "Mobile Number",
      name: "mobileNumber",
      validation: "",
      default: "",
      label: "Mobile Number",
      required: true,
      add: true,
    },
    {
      type: "textarea",
      placeholder: "Educational Qualification",
      name: "educationalQualification",
      validation: "",
      default: "",
      label: "Educational Qualification",
      required: true,
      add: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-type/select",
      placeholder: "Name of Exam Appearing Now",
      updateOn: "",
      name: "nameOfExamAppearingNow",
      validation: "",
      showItem: "",
      default: "",
      tag: false,
      label: "Name of Exam Appearing Now",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
    {
      type: "info",
      content: "താങ്കൾ എഴുതുന്ന പരീക്ഷയുടെ പേര് തെരഞ്ഞെടുക്കുക",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "center-registration/select",
      placeholder: "Center",
      updateOn: "",
      name: "CenterRegistration",
      validation: "",
      showItem: "",
      default: "",
      condition: {
        item: "status",
        if: "Regular",
        then: "enabled",
        else: "disabled",
      },
      tag: false,
      label: "Center",
      required: false,
      view: false,
      add: false,
      update: false,
      filter: false,
    },
    {
      type: "select",
      placeholder: "Status",
      name: "status",
      validation: "",
      default: "",
      tag: true,
      label: "Status",
      showItem: "status",
      required: false,
      view: true,
      filter: true,
      add: true,
      update: true,
      apiType: "CSV",
      selectApi: "Private,Regular",
    },
  ];

  const isCreatingHandler = (value, callback) => {};
  const submitChange = async (post) => {
    postData({ ...post }, "exam-registration").then((response) => {
      if (response.data.success === true) {
        // props.setMessage({
        //   type: 1,
        //   content: "Submitted Successfully",
        //   proceed: "Okay",
        // });
      }
    });
  };

  return (
    <ElementContainer className="column" style={{ padding: 20 }}>
      <AutoForm
        useCaptcha={false}
        key={"form"}
        formType={"post"}
        // header={"IPH REPORT 2023-24"}
        // description={
        //   "2023 ഏപ്രിൽ മുതൽ 2024 മാറ്ച്ച് 31 വരെയുള്ള റിപ്പോറ്ട്ട് നൽകുക"
        // }
        formInput={formInput}
        submitHandler={submitChange}
        button={"Save"}
        isOpenHandler={isCreatingHandler}
        isOpen={true}
        plainForm={true}
        formMode={"single"}
        
      ></AutoForm>
      {/* <Button
        align="right"
        icon={"checked"}
        ClickEvent={handleSave}
        value="Save"
      ></Button> */}
    </ElementContainer>
  );
};

export default CustomForm;
