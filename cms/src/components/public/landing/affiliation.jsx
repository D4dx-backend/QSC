import React from "react";
import { ElementContainer } from "../../core/elements";
import { postData } from "../../../backend/api";
import AutoForm from "../../core/form";
import { useState } from "react";

const Affiliation = (props) => {
  const formInput = [
    {
      type: "text",
      placeholder: "Name Of Center",
      name: "nameOfCenter",
      validation: "",
      default: "",
      label: "Name Of Center",
      required: true,
      add: true,
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
      type: "text",
      placeholder: "Students Count Male",
      name: "studentsCountMale",
      validation: "",
      default: "",
      label: "Students Count Male",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Students Count Female",
      name: "studentsCountFemale",
      validation: "",
      default: "",
      label: "Students Count Female",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Students Count Total",
      name: "studentsCountTotal",
      validation: "",
      default: "",
      label: "Students Count Total",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Halqa Name",
      name: "halqaName",
      validation: "",
      default: "",
      label: "Halqa Name",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Area Qsc Co Ordinator Name",
      name: "AreaQscCoOrdinatorName",
      validation: "",
      default: "",
      label: "Area Qsc Co Ordinator Name",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Mobile Number Of Co Ordinator",
      name: "mobNumberOfAreaQscCoOrdinator",
      validation: "",
      default: "",
      label: "Mobile Number Of Co Ordinator",
      required: true,
      add: true,
    },
    {
      type: "text",
      placeholder: "Affiliation No",
      name: "affiliationNo",
      validation: "",
      default: "",
      label: "Affiliation No",
      required: true,
      add: true,
    },
  ];

  const [formOpen, setFormOpen] = useState(true);

  const isCreatingHandler = (value, callback) => {};
  const submitChange = async (post) => {
    setFormOpen(false);
    postData({ ...post }, "center-registration").then((response) => {
      if (response.data.success === true) {
        props.setMessage({
          type: 1,
          content: "Submitted Successfully",
          proceed: "Okay",
        });
      }
    });
  };

  return formOpen ? (
    <ElementContainer className="column" style={{ padding: 20 }}>
      <AutoForm useCaptcha={false} key={"form"} formType={"post"} formInput={formInput} submitHandler={submitChange} button={"Save"} isOpenHandler={isCreatingHandler} isOpen={true} plainForm={true} formMode={"double"}></AutoForm>
    </ElementContainer>
  ) : null;
};

export default Affiliation;
