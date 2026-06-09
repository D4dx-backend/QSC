import React, { useEffect, useState } from "react";
import FormInput from "../../input";
import { Footer, Form, Page, Overlay, ErrorMessage } from "./styles";
import { useTranslation } from "react-i18next";
import { CloseButton } from "../popup/styles";
import { DwonlaodIcon, GetIcon } from "../../../../icons";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../manage/styles";
import { customValidations } from "../../../project/form/validation";
import ExcelJS from 'exceljs';
import { AddButton, ButtonPanel, FileButton, TableView, TdView, ThView, TrView } from "../styles";
import { addSelectObject } from "../../../../store/actions/select";
import { bulkUploadData, getData } from "../../../../backend/api";
import { RowContainer } from "../../../styles/containers/styles";
import { NoBulkDataSelected } from "../nodata";
import { IconButton } from "../../elements";
import Loader from "../../loader";
import { useToast } from "../../toast";
// import { TableView } from "../styles";
const BulkUplaodForm = React.memo((props) => {
  // Use the useTranslation hook from react-i18next to handle translations
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [selectedLanguage] = useState(i18n.language || "de");
  const [errorCount, setErrorCount] = useState(0);
  const dispatch = useDispatch();
  const toast = useToast();
  const { setMessage, currentApi } = props;
  const [loaderBox, setLoaderBox] = useState(false);
  const [formBulkErrors, setBulkFormErrors] = useState([]);
  // State to store the form input fields
  const [formState] = useState(props.formInput);
  // State to store the submit button's disabled status
  const [submitDisabled, setSubmitDisabled] = useState(true);
  // const [selectData, setSelectData] = useState(null);
  // State to store the validation messages
  // const [formErrors, setFormErrors] = useState(props.formErrors);
  const themeColors = useSelector((state) => state.themeColors);
  /**
   * fieldValidation is a callback function to validate a form field based on its properties
   *
   * @param {object} field - The field to be validated
   * @param {string} value - The value of the field
   *
   * @returns {number} flags - The number of validation errors for the field
   */

  useEffect(() => {
    const selects = formState.filter((item) => item.type === "select" && item.apiType === "API");
    const selectDatas = async () => {
      const datas = {};
      selects.map(async (select) => {
        const data = await getData(select.selectApi);
        datas[select.name] = data.response;
      });
      // setSelectData(datas);
    };
    selectDatas();
  }, [formState]);

  const validation = (fields, udpatedValue, formErrors, agreement, useCheckbox, useCaptcha) => {
    const tempformErrors = { ...formErrors };
    let flags = 0;
    fields.forEach((item) => {
      if (item.name !== "_id") {
        if (item.type === "multiple") {
          item.forms.forEach((form, multipleIndex) => {
            form.forEach((inputs, index) => {
              const res = fieldValidation(inputs, typeof udpatedValue[item.name][multipleIndex][inputs.name] === "undefined" ? "" : udpatedValue[item.name][multipleIndex][inputs.name], null, udpatedValue);
              tempformErrors[item.name][multipleIndex][inputs.name] = res.tempformError;
              flags += res.flag; //?res.flag:0;
            });
          });
        } else if (item.validation === "greater") {
          const res = fieldValidation(item, typeof udpatedValue[item.name] === "undefined" ? "" : udpatedValue[item.name], typeof udpatedValue[item.reference] === "undefined" ? new Date() : udpatedValue[item.reference], udpatedValue);
          tempformErrors[item.name] = res.tempformError;
          flags += res.flag; //?res.flag:0;
        } else {
          const res = fieldValidation(item, typeof udpatedValue[item.name] === "undefined" ? "" : udpatedValue[item.name], null, udpatedValue);
          tempformErrors[item.name] = res.tempformError;
          flags += res.flag; //?res.flag:0;
        }
      }
    });

    // setFormErrors(tempformErrors);
    setSubmitDisabled(flags > 0 ? true : false);
    if (flags === 0) {
      return true;
    } else {
      return false;
    }
  };

  const fieldValidation = (field, value, ref = new Date(), udpatedValue = {}) => {
    let flag = 0;
    let tempformError = "";

    if (!field.update && props.formType === "put") {
      return { flag, tempformError };
    }
    if (!field.add && props.formType === "post") {
      return { flag, tempformError };
    }

    if (!field.required && (value.length ?? 0) === 0) {
      return { flag, tempformError };
    }
    if (field.condition) {
      let conditionStatus = false;
      if (Array.isArray(field.condition.if)) {
        // Code to execute if field.condition.if is an array
        conditionStatus = field.condition.if.some((item) => item === udpatedValue[field.condition.item]);
      } else {
        // Code to execute if field.condition.if is not an array
        conditionStatus = udpatedValue[field.condition.item] === field.condition.if;
      }
      if (conditionStatus) {
        if (field.condition.then === "disabled") {
          return { flag, tempformError };
        }
      } else {
        if (field.condition.else === "disabled") {
          return { flag, tempformError };
        }
      }
    }
    switch (field?.validation) {
      case "email":
        const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!regex.test(value)) {
          if ((value.length ?? 0) > 0) {
            tempformError = t("validContent", { label: t(field.label) });
          } else {
            tempformError = "";
          }
          flag += 1;
        }
        break;
      case "qt":
        const qtRegex = /^\d{8}$|^$/;
        if (!qtRegex.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "number":
        const numberRegex = /^\d+$/;
        if (!numberRegex.test(value) || isNaN(value) || value === null || typeof value === "undefined") {
          if ((value.length ?? 0) > 0) {
            tempformError = t("validContent", { label: t(field.label) });
          }
          flag += 1;
        }
        break;
      case "mobileNumber":
        const phoneRegex = new RegExp(`^[1-9]\\d{${(udpatedValue.PhoneNumberLength ?? 10) - 1}}$`);
        if (!phoneRegex.test(value)) {
          if ((value.length ?? 0) > 0) {
            tempformError = `Please provide a valid ${udpatedValue.PhoneNumberLength ?? 10}-digit WhatsApp Number`;
          }

          flag += 1;
        }
        break;
      case "cvv":
        if (!/^[0-9]{3}$/.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        } // German credit cards typically have a 3-digit CVV
        break;
      case "ccn":
        if (!/^[0-9]{16}$/.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        let sum = 0;
        for (let i = 0; i < (value.length ?? 0); i++) {
          let digit = parseInt(value[i]);
          if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          sum += digit;
        }
        if (sum % 10 !== 0) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "expiry":
        if (!validateExpiry(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "true":
        if (value !== true) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "fileNumber":
        const fileNumber = /[A-Z0-9-]/;
        if (!fileNumber.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "licensePlate":
        const german = /^[A-Z]{3}[ -]?[A-Z0-9]{2}[ -]?[A-Z0-9]{3,5}$/i;
        if (!german.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "url":
        const url = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!url.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "name":
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(value)) {
          if ((value.length ?? 0) > 0) {
            tempformError = "Only English characters and spaces are supported";
          }
          flag += 1;
        }
        break;
      case "slug":
        const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slug.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;

      case "greater":
        const referedDate = new Date(ref);
        if (new Date(value) < referedDate) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "amount":
        const amount = /^\d+([.,]\d{1,2})?$/;
        if (!amount.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "datetime":
      case "time":
        const date = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!date.test(value)) {
          if ((value.length ?? 0) > 0) {
            tempformError = t("validContent", { label: t(field.label) });
          }
          flag += 1;
        }
        break;
      case "password-match":
        const passwordMatchRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@.$!%*?&]{8,}$/;
        const newPassword = udpatedValue["newPassword"];
        const confirmPassword = udpatedValue["confirmPassword"];
        if (newPassword !== confirmPassword) {
          tempformError = "Passwords are not match!";
          flag += 1;
        } else {
          if (!passwordMatchRegex.test(value)) {
            tempformError = t("validContent", { label: t(field.label) });
            flag += 1;
          }
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$.!%*?&]{8,}$/;
        // Explanation of the regex:
        // - At least one uppercase letter (A-Z)
        // - At least one lowercase letter (a-z)
        // - At least one digit (0-9)
        // - At least one special character (@, $, !, %, *, ?, &)
        // - Minimum length of 8 characters

        if (!passwordRegex.test(value)) {
          if ((value.length ?? 0) > 0) {
            tempformError = t("validContent", { label: t(field.label) });
          }
          flag += 1;
        }
        break;
      case "text":
        break;
      default:
        break;
    }
    const customStatus = customValidations(field, tempformError, value, flag, t);
    tempformError = customStatus.tempformError;
    flag = customStatus.flag;

    if ((field.type === "image" || field.type === "file") && props.formType === "post") {
      if ((value.length ?? 0) === 0) {
        tempformError = t("validImage", { label: t(field.label) });
        flag += 1;
      }
    } else if ((field.type === "image" || field.type === "file") && props.formType === "put") {
      return { flag, tempformError };
    } else {
      if (field.required && (value.length ?? 0) === 0) {
        tempformError = t("required", { label: t(field.label) });
        flag += 1;
      } else if ((field.minimum ?? 0) > (value.length ?? 0)) {
        tempformError = t("requiredMinimum", {
          minimum: field.minimum ?? 0,
          label: t(field.label),
        });

        flag += 1;
      } else if ((field.maximum ?? 2000) < (value.length ?? 0)) {
        tempformError = t("maxLimit", {
          maximum: field.maximum ?? 2000,
          label: t(field.label),
        });
        flag += 1;
      }
    }
    return { flag, tempformError };
  };
  function validateExpiry(expiry) {
    let month = parseInt(expiry.substring(0, 2));
    let year = parseInt("20" + expiry.substring(3));
    let now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // JavaScript months are 0-11
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expiry date is in the past
    }
    if (month < 1 || month > 12) {
      return false; // Invalid month
    }
    return true;
  }

  // const handleBulkChange = (data = {}) => {
  //   return true;
  // };
  // bulk uplaod format
  const [jsonData, setJsonData] = useState(null);
  const uploadData = async (event) => {
    setLoaderBox(true);
    const file = event.target.files?.[0];
    if (file) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error('No worksheet found in the Excel file');
        }

        const json = [];
        const headers = {};
        
        // Get headers from first row
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          headers[colNumber] = cell.value;
        });

        // Get data from remaining rows (skip fully empty rows)
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber];
            if (header) {
              // Trim string values to avoid trailing-space issues (e.g. "A " → "A")
              rowData[header] = typeof cell.value === "string" ? cell.value.trim() : cell.value;
            }
          });
          // Skip rows where every value is empty/null
          if (Object.keys(rowData).length > 0 && Object.values(rowData).some(v => v !== null && v !== undefined && v !== "")) {
            json.push(rowData);
          }
        });

        const errorData = [];
        const selectData = {};
        
        const finalData = await Promise.all(
          json.map(async (item, itemIndex) => {
            const formErrorItem = {};
            const temp = {};
            let date = new Date();

            await Promise.all(
              formState.map(async (attribute) => {
                if (attribute.add) {
                  const itemValue = item[attribute.label];
                  let val = "";

                  if (attribute.type === "checkbox") {
                    let bool = JSON.parse(attribute.default === "false" || attribute.default === "true" ? attribute.default : "false");
                    val = bool;
                  } else if (attribute.type === "multiSelect") {
                    val = [];
                  } else if (attribute.type === "text") {
                    val = "";
                  } else if (attribute.type === "datetime" || attribute.type === "date" || attribute.type === "time") {
                    if (attribute.default === "0") {
                      date.setUTCHours(0, 0, 0, 0);
                      val = date.toISOString();
                    } else if (attribute.default === "1") {
                      date.setUTCHours(23, 59, 0, 0);
                      val = date.toISOString();
                    } else {
                      val = date.toISOString();
                    }
                    if (attribute.add) {
                      val = attribute.default === "empty" ? "" : date.toISOString();
                    }
                  } else if (attribute.type === "image" || attribute.type === "file") {
                    val = "";
                  } else {
                    val = attribute.default ?? "";
                    if (attribute.type === "select") {
                      val = attribute.default ?? "";
                    }
                  }
                  temp[attribute.name] = val;
                  if (attribute.add) {
                    temp[attribute.name] = itemValue ?? val;
                    formErrorItem[attribute.name] = "";
                    if (attribute.apiType === "API") {
                      if (!selectData[attribute.selectApi]) {
                        const response = await getData({}, `${attribute.selectApi}`);
                        selectData[attribute.selectApi] = response.data;
                        if (response.status === 200) {
                          dispatch(addSelectObject(response.data, attribute.selectApi));
                        }
                      }
                      const name = attribute.displayValue ? attribute.displayValue : attribute.showItem === "locale" ? selectedLanguage : (attribute.showItem || "value");
                      const foundItem = selectData[attribute.selectApi].find((option) => option[name] === itemValue || option["value"] === itemValue);
                      if (foundItem) {
                        temp[attribute.name] = foundItem.id;
                      }
                    }
                  }
                }
              })
            );
            errorData.push(formErrorItem);
            return temp;
          })
        );

        let isValidate = 0;
        finalData.forEach((data, index) => {
          const errorItem = validation(formState, data, errorData[index], false, false, index);
          errorData[index] = errorItem.tempformErrors;
          isValidate += errorItem.flags;
        });

        setErrorCount(isValidate);
        setSubmitDisabled(isValidate > 0);
        setBulkFormErrors(errorData);
        setJsonData(finalData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Error processing Excel file: ' + error.message);
      } finally {
        setLoaderBox(false);
      }
    }
  };

  const bulkUplaodFormat = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(t("report"));

      // Add headers
      const headers = formState
        .filter(attribute => attribute.add)
        .map(attribute => attribute.label);

      worksheet.addRow(headers);

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F5F5F5' }
      };

      // Auto-fit columns
      worksheet.columns = headers.map(header => ({
        header,
        key: header,
        width: Math.max(15, header.length + 5)
      }));

      // Generate buffer and create download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${props.shortName}-template.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Error creating template: ' + error.message);
    }
  };
  const bulkUploadHandler = async (event) => {
    setLoaderBox(true);

    // Convert your array/data to JSON string
    const jsonDataString = JSON.stringify(jsonData);

    // Creating a blob from JSON string
    const blob = new Blob([jsonDataString], { type: "application/json" });
    const file = new File([blob], "bulkUploadData.json", { type: "application/json" });

    // Create form data and append file
    const formData = new FormData();
    formData.append("file", file); // Adjust the append key based on your API expectation
    console.log(props.parents);
    if (props.parents && typeof props.parents === "object" && !Array.isArray(props.parents)) {
      Object.keys(props.parents).forEach((key) => {
        // Append each key-value pair in the FormData
        formData.append(key, props.parents[key]);
      });
    }

    try {
      const response = await bulkUploadData(formData, `${currentApi}/bulk-upload`);

      if (response.status === 200) {
        const added = response.data.newRegistrations?.length ?? 0;
        const exist = response.data.alreadyExist?.length ?? 0;
        toast.success(`${added} ${props.shortName}(s) uploaded successfully.${exist > 0 ? ` ${exist} already exist.` : ""}`);
        props.submitHandler();
      } else if (response.status === 404) {
        toast.error(response.data ?? "Not found.");
      } else {
        toast.error(response.data ?? "Upload failed.");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoaderBox(false);
    }
  };

  const closeModal = () => {
    props.isOpenHandler(false);
  };

  return (
    <Overlay key={props.referenceId} className={`form-container ${props.css ?? ""}`}>
      <Page className={`${props.css ?? ""} ${props.formMode ?? "single"} ${props.bulkUpload ? "bulk" : ""}`}>
        <Header className={`${props.css ?? ""} form`}>
          <div>
            <span dangerouslySetInnerHTML={{ __html: props.header ? props.header : "Login" }}></span>
          </div>
          {(props.css ?? "") === "" && (
            <CloseButton theme={themeColors} onClick={closeModal}>
              <GetIcon icon={"Close"} />
            </CloseButton>
          )}
        </Header>

        <Form className="list bulk" action="#">
          {jsonData?.length > 0 && (
            <ButtonPanel>
              <AddButton onClick={() => bulkUplaodFormat()}>
                <DwonlaodIcon></DwonlaodIcon>
                <span>{t("Download Template")}</span>
              </AddButton>
              <FileButton type="file" accept=".xlsx, .xls" onChange={uploadData}></FileButton>
            </ButtonPanel>
          )}
          <RowContainer className=" bulk">
            {jsonData?.length > 0 ? (
              <TableView className="small">
                <thead>
                  <tr>
                    <ThView>Action</ThView>
                    {formState &&
                      formState.map((attribute, index) => {
                        return (attribute.add ?? false) === true ? <ThView key={props.shortName + attribute.name + index}>{t(attribute.label)}</ThView> : null;
                      })}
                  </tr>
                </thead>
                <tbody>
                  {jsonData?.map((data, rowIndex) => (
                    <TrView key={`${props.shortName}-${rowIndex}-${rowIndex}`} className={"no-border bulk"}>
                      <TdView className="bulk">
                        <IconButton icon="edit"></IconButton>
                      </TdView>
                      {formState &&
                        formState.map((attribute, index) => {
                          const itemValue = data[attribute.name];
                          if (attribute.upload ?? false) {
                          } // ? data[t(attribute.label)] : data[t(attribute.label, { lng: selectedLanguage === "en" ? "de" : "en" })];
                          return (attribute.add ?? false) === true && attribute.type !== "hidden" ? (
                            <TdView className="bulk" key={index}>
                              {/* <div>s */}
                              {itemValue}
                              {/* {errorValue?.length > 0 && <div>{errorValue}</div>} */}
                              {/* <FormInput bulkUpload={true} formValues={formValues} updateValue={{}} dynamicClass={"textarea"} placeholder={attribute.placeholder} key={`input` + index} id={index} index={rowIndex} error={formErrors[attribute.name]} value={itemValue} {...attribute} onChange={handleBulkChange} /> */}
                              {formBulkErrors[rowIndex]?.[attribute.name] && <p>{formBulkErrors[rowIndex][attribute.name]}</p>}
                              {/* </div> */}
                            </TdView>
                          ) : null;
                        })}
                    </TrView>
                  ))}
                </tbody>
              </TableView>
            ) : (
              <NoBulkDataSelected upload={uploadData} download={bulkUplaodFormat} icon={props.icon} shortName={props.shortName}></NoBulkDataSelected>
            )}
            {errorCount > 0 && <ErrorMessage style={{ marginTop: "10px" }}>{t("errorCount", { count: errorCount })}</ErrorMessage>}
          </RowContainer>
        </Form>

        <Footer className={`${props.css ?? ""} ${submitDisabled ? "disabled" : ""}`}>
          {(props.css ?? "") === "" && <FormInput type="close" value={"Cancel"} onChange={closeModal} />}
          <FormInput disabled={submitDisabled} type="submit" name="submit" value={props.button ? props.button : "Uplaod Data"} onChange={bulkUploadHandler} />
        </Footer>
        {loaderBox && <Loader className="absolute"></Loader>}
      </Page>
    </Overlay>
  );
});

export default BulkUplaodForm;
