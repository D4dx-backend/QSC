import { useEffect, useState } from "react";
import CrudForm from "../list/create";
import moment from "moment";

const AutoForm = ({ formStyle = "", consent, colors, autoUpdate = false, liveData = false, header, api, formType = "post", formMode, formInput: tempFormInput, formValues: tempFormValues, submitHandler, isOpenHandler, isCreating, useCaptcha, css = "", description = "", button = "Submit", formTabTheme = "normal", formLayout }) => {
  const [formValues, setFormValues] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [formInput] = useState(tempFormInput);
  useEffect(() => {
    // Form default value is validating using Use Effect
    const formVal = {};
    const tempFormErrors = {};
    let date = new Date();
    tempFormInput.forEach((item) => {
      tempFormErrors[item.name] = "";
      if (item.type === "checkbox" || item.type === "toggle") {
        // let bool = JSON.parse("false");
        // formVal[item.name] = bool;
        formVal[item.name] = item.default ? JSON.parse(item.default) : false;
      } else if (item.type === "datetime" || item.type === "time") {
        item.default ? (date = new Date(item.default)) : (date = new Date());
        formVal[item.name] = date.toISOString();
      } else if (item.type === "image" || item.type === "file") {
        formVal[item.name] = [];
      } else if (item.type === "multiSelect") {
        formVal[item.name] = item.default?.length > 0 ? item.default : [];
        if (item.defaultArray) {
          formVal[item.name + "Array"] = item.defaultArray;
        }
      } else if (item.type === "mobilenumber") {
        formVal[item.name] = { number: "", country: "", numberLength: "" };
      } else if (item.type === "select") {
        formVal[item.name] = item.default?.toString()?.length > 0 ? item.default : "";
        if (item.defaultArray) {
          formVal[item.name + "Array"] = item.defaultArray;
        }
      } else if (item.type === "date") {
        formVal[item.name] = item.default === "empty" ? "" : moment(item.default).isValid() ? moment(item.default).set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toISOString() : moment(date).set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toISOString();
      } else if (item.type === "multiple") {
        formVal[item.name] = [];
        tempFormErrors[item.name] = [];
        item.forms.forEach((multiple) => {
          formVal[item.name].push(
            multiple.reduce((acc, item) => {
              return { ...acc, [item.name]: "" };
            }, {})
          );
          tempFormErrors[item.name].push(
            multiple.reduce((acc, item) => {
              return { ...acc, [item.name]: "" };
            }, {})
          );
        });
      } else {
        formVal[item.name] = item.default;
        if (item.type === "select") {
          formVal[item.name] = "";
        }
      }
    });
    tempFormErrors["captchaError"] = "";
    tempFormErrors["agreementAccept"] = "";
    if (tempFormValues) {
      Object.keys(formVal).forEach((key) => {
        const item = tempFormInput.find((item) => item.name === key);
        if (item && item.type === "mobilenumber") {
          formVal[key].number = tempFormValues[key]?.number?.replace(/\D/g, "");
          formVal[key].country = tempFormValues[key]?.country ?? "";
          formVal[key].numberLength = tempFormValues[key]?.numberLength;
        } else if (tempFormValues[key]) {
          formVal[key] = tempFormValues[key] ?? formVal[key];
        }
      });
    }
    setFormValues(formVal);
    setFormErrors(tempFormErrors);
    // validation(props.formInput, formVal);
  }, [tempFormInput, tempFormValues]);
  return formInput?.length > 0 && Object.keys(formValues).length > 0 && formErrors && <CrudForm formLayout={formLayout} formStyle={formStyle} colors={colors} consent={consent} liveData={liveData} autoUpdate={autoUpdate} api={api} formMode={formMode ?? (formInput.length > 4 ? "double" : "single")} formType={formType} header={header} description={description} formInput={formInput} formValues={formValues} formErrors={formErrors} submitHandler={submitHandler} isOpenHandler={isOpenHandler} useCaptcha={useCaptcha} isOpen={isCreating} button={button} css={css} formTabTheme={formTabTheme}></CrudForm>;
};
export default AutoForm;
