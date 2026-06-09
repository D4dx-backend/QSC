import React, { useState, useEffect, useRef } from "react";
import FormInput from "../../input";
import { Footer, Form, Page, Overlay, ErrorMessage, Record, PageLayout, Round, Navigation } from "./styles";
import { useTranslation } from "react-i18next";
import { DwonlaodIcon, GetIcon } from "../../../../icons";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../manage/styles";
import { customValidations } from "../../../project/form/validation";
import Captcha from "../../captcha";
import moment from "moment";
import ExcelJS from "exceljs";
import { AddButton, ButtonPanel, FileButton, Table, Td, Tr } from "../styles";
import { addSelectObject } from "../../../../store/actions/select";
import { bulkUploadData, getData, postData } from "../../../../backend/api";
import { RowContainer } from "../../../styles/containers/styles";
import { NoBulkDataSelected } from "../nodata";
import { IconButton, TabMenu } from "../../elements";
import { FootNote } from "../../input/styles";
import { ArrowLeft, Loader } from "lucide-react";
import { useMessage } from "../../message/useMessage.jsx";

const CrudForm = React.memo((props) => {
  // Use the useTranslation hook from react-i18next to handle translations
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [selectedLanguage] = useState(i18n.language || "in");
  const [errorCount, setErrorCount] = useState(0);
  const dispatch = useDispatch();
  const { setLoaderBox, currentApi, audioCapture = false, colors } = props;
  const { showMessage } = useMessage();
  // Optionally, you can expose a setMessage function that uses showMessage
  const setMessage = (msg) => showMessage(msg);
  const [formBulkErrors, setBulkFormErrors] = useState([]);
  // State to store the form input fields
  const [formStateGroup, setFormStateGroup] = useState(null);
  const [tabCount, setTabCount] = useState(0);
  const [formTabTheme] = useState(props.formTabTheme ?? "normal");
  const [formState] = useState(props.formInput);

  // State to store the submit button's disabled status
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [groupValidation, setGroupValidations] = useState({});
  const { autoUpdate = false, liveData = false } = props;
  // State to store the form values
  const [formValues, setFormValues] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { formValues: tempFormValues } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (!formValues && !lastUpdated) {
      setFormValues(JSON.parse(JSON.stringify(tempFormValues))); // Deep copy
      setLastUpdated(JSON.parse(JSON.stringify(tempFormValues))); // Deep copy
    }
  }, [tempFormValues, formValues, lastUpdated]);

  useEffect(() => {
    const groupedInputs = props.formInput.reduce((acc, item, index) => {
      const group = props.noTabView ? "Other" : item.group || "Other"; // Default to "Other" if group is undefined
      if ((props.formType === "post" && item.add) || (props.formType === "put" && item.update)) {
        if (!acc[group]) {
          acc[group] = { key: group, selected: false, inputs: [] };
        }
        // Store both the item and its original index
        acc[group].inputs.push({ ...item, index });
      }
      return acc;
    }, {});
    setTabCount(Object.keys(groupedInputs).length);
    setFormStateGroup(groupedInputs);
    setSelectedTab(Object.keys(groupedInputs)?.[0]);
  }, [props.formInput, props.formType, props.noTabView]);

  //State to store Captcha Status Validations Status
  const [captchaStatus, setCaptchaStatus] = useState(false);

  // State to store the validation messages
  const [formErrors, setFormErrors] = useState(props.formErrors);
  const themeColors = useSelector((state) => state.themeColors);
  /**
   * fieldValidation is a callback function to validate a form field based on its properties
   *
   * @param {object} field - The field to be validated
   * @param {string} value - The value of the field
   *
   * @returns {number} flags - The number of validation errors for the field
   */

  // voice recorder
  const [recording, setRecording] = useState(false);
  const [fillingForm, setFillingForm] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        console.log("Recording stopped due to page close/component unmount");
      }
    };
  }, []);

  const handleStartRecording = () => {
    setRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStopRecording;
      mediaRecorderRef.current.start();
    });
  };

  const handleStopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
    // Stop all tracks to release the microphone
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/ogg; codecs=opus",
    });

    // Convert Blob to ArrayBuffer
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const audioFile = new File([arrayBuffer], "audio.ogg", {
        type: "audio/ogg",
        lastModified: new Date().getTime(),
      });
      console.log("Audio File size: ", audioFile.size); // Log the file size for debugging
      setAudioFile(audioFile);
    };
    reader.readAsArrayBuffer(audioBlob);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    const handleSubmit = async (event) => {
      if (audioFile) {
        setFillingForm(true);
        const fields = {
          title: props.header.replace("Add a", "").trim(),
          audio: [audioFile], // Wrapping the audio file in an array to mimic FileList structure
          formValues: JSON.stringify(
            [...formState].reduce((acc, item) => {
              if (item.add) {
                acc[item.name] = ""; // Replace the value of each form field with an empty string
              }
              return acc;
            }, {})
          ),
        };
        setAudioFile(null);
        const response = await postData(fields, "user/transcribeAudio");
        if (response.status === 200) {
          console.log(response.data.output);
          let udpateValue = {
            ...formValues,
            ...Object.keys(response.data.output).reduce((acc, key) => {
              if (response.data.output[key]?.length > 0) {
                acc[key] = response.data.output[key];
              }
              return acc;
            }, {}),
          };
          setFillingForm(false);
          setFormValues(udpateValue);
        } else {
          setFillingForm(false);
          console.error("Failed to upload audio");
        }
      }
    };
    handleSubmit(audioFile);
  }, [audioFile, fillingForm, formValues, props.header, formState]);
  //---
  const catchaValidation = (captchaStatus, useCaptcha) => {
    let flag = 0;
    let tempformError = "";
    if (captchaStatus === false && useCaptcha === true) {
      tempformError = t("required", { label: t("captcha") });
      flag += 1;
    }
    return { flag, tempformError };
  };

  const validation = (fields, tempudpatedValue, formErrors, agreement, useCheckbox, useCaptcha) => {
    const group = {};
    const tempformErrors = { ...formErrors };
    const udpatedValue = { ...tempudpatedValue };
    let flags = 0;
    fields.forEach((item) => {
      if (item.name !== "_id") {
        if (item.validation === "greater") {
          const res = fieldValidation(item, typeof udpatedValue[item.name] === "undefined" ? "" : udpatedValue[item.name], typeof udpatedValue[item.reference] === "undefined" ? new Date() : udpatedValue[item.reference], udpatedValue);
          tempformErrors[item.name] = res.tempformError;
          flags += res.flag; //?res.flag:0;
          const groupName = item.group ?? "Other";
          group[groupName] = (group[groupName] ?? 0) + res.flag;
        } else {
          const res = fieldValidation(item, typeof udpatedValue[item.name] === "undefined" ? "" : udpatedValue[item.name], null, udpatedValue);
          tempformErrors[item.name] = res.tempformError;
          flags += res.flag; //?res.flag:0;
          const groupName = item.group ?? "Other";
          group[groupName] = (group[groupName] ?? 0) + res.flag;
        }
      }
    });

    const captchaRes = catchaValidation(agreement, useCaptcha);
    tempformErrors["captchaError"] = captchaRes.tempformError;
    flags += captchaRes.flag;
    setFormErrors(tempformErrors);
    setSubmitDisabled(flags > 0 ? true : false);
    setGroupValidations(group);
    if (flags === 0) {
      return true;
    } else {
      return false;
    }
  }; // Function to check if the image format is valid

  const isValidImageFormat = (file) => {
    const validFormats = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/tiff"];
    return validFormats.includes(file.type);
  };

  const fieldValidation = (field, value, ref = new Date(), udpatedValue = {}) => {
    let flag = 0;
    let tempformError = "";
    if (field.name === "bmr") {
      console.log("BMR field validation:", {
        value: value,
        ref: ref,
        udpatedValue: udpatedValue,
      });
    }
    if (!field.update && props.formType === "put") {
      return { flag, tempformError };
    }
    if (!field.add && props.formType === "post") {
      return { flag, tempformError };
    }
    if (field.type === "title") {
      return { flag, tempformError };
    }
    if (field.type !== "number" && !field.required && (value?.length ?? 0) === 0) {
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
    if (field.type === "element" && field.required) {
      console.log({ value });
      if (value === undefined || value === null) {
        flag += 1;
        tempformError = t("required", { label: t(field.label) });
        return { flag, tempformError };
      }
    }
    switch (field?.validation) {
      case "slug":
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
        break;
      case "email":
        const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!regex.test(value)) {
          if ((value?.length ?? 0) > 0) {
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
        if (field.required && (value?.toString().length ?? 0) === 0) {
          flag += 1;
          return { flag, tempformError };
        } else {
          let numberRegex;
          let decimalPlaces = field.decimalPlaces ?? 0;
          if (decimalPlaces === 0) {
            numberRegex = /^\d+$/; // Integer only
          } else if (decimalPlaces === -1) {
            numberRegex = /^\d+(\.\d+)?$/; // Supports unlimited decimal places
          } else if (decimalPlaces === 1) {
            numberRegex = /^\d+(\.\d{0,1})?$/; // Up to 1 decimal place
          } else if (field.decimalPlaces === 2) {
            numberRegex = /^\d+(\.\d{0,2})?$/; // Up to 2 decimal places
          } else {
            numberRegex = /^\d+(\.\d*)?$/; // Any number of decimal places
          }

          if (value === null || typeof value === "undefined" || !numberRegex.test(value?.toString())) {
            tempformError = t("validContent", { label: t(field.label) });
            return { flag: 1, tempformError };
          }
        }

        // If value exists, validate number format and range
        if (value !== null && value !== undefined && value.toString().length > 0) {
          const numValue = parseFloat(value);

          // Validate minimum if set
          if (field.minimum !== undefined && numValue < field.minimum) {
            flag += 1;
            return {
              flag,
              tempformError: t("requiredMinimumNumber", {
                minimum: field.minimum ?? 0,
                label: t(field.label),
              }),
            };
          }

          // Validate maximum if set
          if (field.maximum !== undefined && numValue > field.maximum) {
            flag += 1;
            return {
              flag,
              tempformError: t("maxNumberLimit", {
                maximum: field.maximum ?? 2000,
                label: t(field.label),
              }),
            };
          }
        }
        break;
      case "mobilenumber":
        console.log({ value });
        const phoneRegex = new RegExp(`^[1-9]\\d{${(value.numberLength ?? 10) - 1}}$`);
        if (!phoneRegex.test(value)) {
          if ((value?.number?.length ?? 0) > 0) {
            tempformError = `Please provide a valid ${value.numberLength ?? 10}-digit WhatsApp Number`;
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
        for (let i = 0; i < (value?.length ?? 0); i++) {
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
          if ((value?.length ?? 0) > 0) {
            tempformError = "Only English characters and spaces are supported";
          }
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
          if ((value?.length ?? 0) > 0) {
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
          if ((value?.length ?? 0) > 0) {
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
      if ((value?.length ?? 0) === 0) {
        // Handle empty value case
        // tempformError = t("validImage", { label: t(field.label) });
        flag += 1;
      } else {
        if (field.type === "image") {
          // Check if the image format is valid
          const isValidFormat = isValidImageFormat(value[0]); // Assuming value is an array of file paths
          if (!isValidFormat) {
            // Handle invalid format case
            tempformError = t("invalidImageFormat", { label: t(field.label) });
            flag += 1;
          }
        } else {
          const allowedTypes = (field.allowedFileTypes || []).map((type) => type.toLowerCase());
          const isFileTypeAllowed = (file) => {
            // Get file MIME type
            const fileType = file.type.toLowerCase();

            // Check if type matches exactly or matches wildcard
            return allowedTypes.some((allowedType) => {
              if (allowedType.endsWith("/*")) {
                // Handle wildcard MIME types (e.g., "image/*")
                const mainType = allowedType.split("/")[0];
                return fileType.startsWith(mainType);
              }
              return fileType === allowedType;
            });
          };
          if (!isFileTypeAllowed(value[0])) {
            tempformError = t("fileType", {
              label: t(field.label),
            });
            flag += 1;
          }
        }
      }
    } else if (field.type === "mobilenumber") {
      const phoneRegex = new RegExp(`^[1-9]\\d{${value.numberLength - 1}}$`);
      console.log(value);
      if (!phoneRegex.test(value?.number)) {
        if ((value?.number?.length ?? 0) > 0) {
          tempformError = `Please provide a valid ${value.numberLength}-digit WhatsApp Number`;
        }
        flag += 1;
      }
    } else if ((field.type === "image" || field.type === "file") && props.formType === "put") {
      return { flag, tempformError };
    } else if (field.type === "checkbox" || field.type === "toggle") {
      return { flag, tempformError };
    } else if (field.type === "number") {
      if (field.required && (value?.toString().length ?? 0) === 0) {
        flag += 1;
        return { flag, tempformError };
      } else {
        let numberRegex;
        let decimalPlaces = field.decimalPlaces ?? 0;
        if (decimalPlaces === 0) {
          numberRegex = /^\d+$/; // Integer only
        } else if (decimalPlaces === -1) {
          numberRegex = /^\d+(\.\d+)?$/; // Supports unlimited decimal places
        } else if (decimalPlaces === 1) {
          numberRegex = /^\d+(\.\d{0,1})?$/; // Up to 1 decimal place
        } else if (field.decimalPlaces === 2) {
          numberRegex = /^\d+(\.\d{0,2})?$/; // Up to 2 decimal places
        } else {
          numberRegex = /^\d+(\.\d*)?$/; // Any number of decimal places
        }

        if (value === null || typeof value === "undefined" || !numberRegex.test(value?.toString())) {
          tempformError = t("validContent", { label: t(field.label) });
          return { flag: 1, tempformError };
        }
      }

      // If value exists, validate number format and range
      if (value !== null && value !== undefined && value.toString().length > 0) {
        const numValue = parseFloat(value);

        // Validate minimum if set
        if (field.minimum !== undefined && numValue < field.minimum) {
          flag += 1;
          return {
            flag,
            tempformError: t("requiredMinimumNumber", {
              minimum: field.minimum ?? 0,
              label: t(field.label),
            }),
          };
        }

        // Validate maximum if set
        if (field.maximum !== undefined && numValue > field.maximum) {
          flag += 1;
          return {
            flag,
            tempformError: t("maxNumberLimit", {
              maximum: field.maximum ?? 2000,
              label: t(field.label),
            }),
          };
        }
      }
    } else {
      if (field.required && (value?.toString()?.length ?? 0) === 0) {
        // tempformError = t("required", { label: t(field.label) });
        // console.log(field.label, field.type, { field });
        flag += 1;
      } else if ((field.minimum ?? 0) > (value?.length ?? 0)) {
        tempformError = t("requiredMinimum", {
          minimum: field.minimum ?? 0,
          label: t(field.label),
        });

        flag += 1;
      } else if ((field.maximum ?? 10000) < (value?.length ?? 0)) {
        tempformError = t("maxLimit", {
          maximum: field.maximum ?? 10000,
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

  useEffect(() => {}, [formState]);

  const handleBulkChange = (sl = 0, event, id, type = "text", sub = null, data = {}) => {
    data = jsonData[sl];
    // console.log(data);
    const fullData = [...jsonData];
    const field = formState[id];
    let value = "";
    if (type === "checkbox") {
      value = event;
    } else if (type === "select") {
      value = event.id;
    } else if (type === "multiSelect") {
      const items = data[field.name];
      const index = items.findIndex((item) => item === event.id);

      if (index === -1) {
        // If event._id doesn't exist, push it to the items array
        items.push(event.id);
      } else {
        // If event._id already exists, remove it from the items array
        items.splice(index, 1);
      }
      value = items;
    } else if (type === "text" || type === "number" || type === "password" || type === "color") {
      value = event.target.value;
    } else if (type === "search") {
      value = JSON.stringify(event);
    } else if (type === "image" || type === "file") {
      value = event.target.files;
    } else if (type === "datetime" || type === "time") {
      if (event) {
        value = event.toISOString();
      } else {
        value = "";
      }
    } else if (type === "date") {
      if (event) {
        event.setHours(14, 0, 0, 0); // Set time to 14:00 (2:00 PM)
        value = event.toISOString();
      } else {
        value = "";
      }
    } else {
      value = event.target.getAttribute("value");
    }

    const udpateValue = {
      ...data,
      [field.name]: value,
    };
    fullData[sl] = udpateValue;
    setJsonData(fullData);
    let isValidate = 0;
    const formErrorTemp = [...formBulkErrors];
    fullData.map((data, index) => {
      const errorItem = validation(formState, data, formErrorTemp[index], false, false, sl);
      formErrorTemp[index] = errorItem.tempformErrors;
      isValidate += errorItem.flags;
      return true;
    });
    setBulkFormErrors(formErrorTemp);
    setErrorCount(isValidate);
    if (isValidate > 0) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
    return isValidate;
  };
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
          throw new Error("No worksheet found in the Excel file");
        }

        const json = [];
        const headers = {};

        // Get headers from first row
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          headers[colNumber] = cell.value;
        });

        // Get data from remaining rows
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row

          const rowData = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber];
            if (header) {
              // Handle different cell types
              let value = cell.value;
              if (cell.type === ExcelJS.ValueType.Date) {
                value = cell.value.toISOString();
              } else if (cell.type === ExcelJS.ValueType.Hyperlink) {
                value = cell.value.text;
              } else if (cell.type === ExcelJS.ValueType.RichText) {
                value = cell.value.richText.map((t) => t.text).join("");
              }
              rowData[header] = value;
            }
          });
          if (Object.keys(rowData).length > 0) {
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

                  switch (attribute.type) {
                    case "checkbox":
                      val = JSON.parse(attribute.default === "false" || attribute.default === "true" ? attribute.default : "false");
                      break;
                    case "multiSelect":
                      val = [];
                      break;
                    case "datetime":
                    case "date":
                    case "time":
                      if (itemValue) {
                        val = new Date(itemValue).toISOString();
                      } else {
                        if (attribute.default === "0") {
                          date.setUTCHours(0, 0, 0, 0);
                        } else if (attribute.default === "1") {
                          date.setUTCHours(23, 59, 0, 0);
                        }
                        val = attribute.default === "empty" ? "" : date.toISOString();
                      }
                      break;
                    case "image":
                    case "file":
                      val = "";
                      break;
                    case "select":
                      if (attribute.apiType === "API" && itemValue) {
                        if (!selectData[attribute.selectApi]) {
                          const response = await getData({}, `${attribute.selectApi}`);
                          selectData[attribute.selectApi] = response.data;
                          if (response.status === 200) {
                            dispatch(addSelectObject(response.data, attribute.selectApi));
                          }
                        }
                        const name = attribute.displayValue || (attribute.showItem === "locale" ? selectedLanguage : "value");
                        const foundItem = selectData[attribute.selectApi].find((option) => option[name]?.toString() === itemValue?.toString());
                        val = foundItem?.id || attribute.default || "";
                      } else {
                        val = itemValue || attribute.default || "";
                      }
                      break;
                    default:
                      val = itemValue || attribute.default || "";
                  }

                  temp[attribute.name] = val;
                  formErrorItem[attribute.name] = "";
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
        console.error("Error processing Excel file:", error);
        setMessage({
          type: 1,
          content: "Error processing Excel file: " + error.message,
          proceed: "Okay",
        });
      } finally {
        setLoaderBox(false);
      }
    }
  };

  const bulkUplaodFormat = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(t("report"));

      // Get exportable fields
      const exportFields = formState.filter((attribute) => attribute.add);

      // Define columns with proper formatting
      worksheet.columns = exportFields.map((field) => ({
        header: field.label,
        key: field.name,
        width: Math.max(15, field.label.length + 5),
        style: {
          alignment: { vertical: "middle", horizontal: "left" },
          font: { name: "Arial", size: 11 },
        },
      }));

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F5F5F5" },
      };
      headerRow.border = {
        bottom: { style: "thin", color: { argb: "CCCCCC" } },
      };

      // Add validation and notes where appropriate
      exportFields.forEach((field, index) => {
        const col = index + 1;
        const cell = worksheet.getCell(1, col);

        // Add data validation based on field type
        if (field.type === "select" && field.apiType === "JSON" && field.selectApi) {
          const validValues = field.selectApi.map((item) => item.value);
          worksheet.getColumn(col).dataValidation = {
            type: "list",
            allowBlank: !field.required,
            formulae: [`"${validValues.join(",")}"`],
          };
        }

        // Add notes for required fields
        if (field.required) {
          cell.note = {
            texts: [
              {
                text: t("required", { label: field.label }),
                font: { bold: true, size: 11 },
              },
            ],
          };
          cell.font = { bold: true, color: { argb: "FF0000" } };
        }
      });

      // Generate buffer and create download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${props.shortName}-template.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);

      setMessage({
        type: 0,
        content: t("templateDownloaded"),
        proceed: "Okay",
      });
    } catch (error) {
      console.error("Error creating template:", error);
      setMessage({
        type: 1,
        content: "Error creating template: " + error.message,
        proceed: "Okay",
      });
    }
  };

  const bulkUploadHandler = async (event) => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const blob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
        const file = new File([blob], "bulkUploadData.json", { type: "application/json" });
        const formData = new FormData();
        formData.append("file", file);
        const response = await bulkUploadData(formData, `${currentApi}/bulk-upload`);
        if (response.status === 200) {
          setJsonData(response.data.alreadyExist);
          setMessage({
            type: 1,
            content: t("bulkUploadMessage", {
              exist: response.data.alreadyExist.length,
              added: response.data.added.length,
            }),
            proceed: "Okay",
          });
          if (response.data.alreadyExist.length === 0) {
            await submitChange(event);
          }
        } else if (response.status === 404) {
          setMessage({ type: 1, content: t(response.data), proceed: "Okay" });
        } else {
          setMessage({ type: 1, content: t(response.data), proceed: "Okay" });
        }
      } catch (error) {
        console.error("Bulk upload error:", error);
        setMessage({
          type: 1,
          content: "Error during bulk upload: " + error.message,
          proceed: "Okay",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (event, id, type = "text", selectType = null, country = null) => {
    // Getting current field

    const field = formState[id];
    const tempFormValues = { ...formValues };

    let value = "";

    if (type === "checkbox" || type === "toggle" || type === "htmleditor" || type === "element") {
      value = event;
    } else if (type === "select") {
      value = event.id;
      if ((field.arrayOut ?? false) === true && type !== "multiSelect") {
        tempFormValues[field.name + "Array"] = event;
      }
    } else if (type === "multiSelect") {
      // if (selectType === "dropdown") {
      if ((field.arrayOut ?? false) === true) {
        tempFormValues[field.name + "Array"] = event;
      }
      value = event.map((item) => item.id);
      // } else {
      //   if ((field.arrayOut ?? false) === true) {
      //     let items = tempFormValues[field.name + "Array"];
      //     if (!items) {
      //       items = [];
      //     }
      //     const index = items.findIndex((item) => item.id === event.id);

      //     if (index === -1) {
      //       // If event._id doesn't exist, push it to the items array
      //       items.push(event);
      //     } else {
      //       // If event._id already exists, remove it from the items array
      //       items.splice(index, 1);
      //     }
      //     tempFormValues[field.name + "Array"] = items;
      //   }
      //   const items = tempFormValues[field.name];
      //   const index = items.findIndex((item) => item === event.id);

      //   if (index === -1) {
      //     // If event._id doesn't exist, push it to the items array
      //     items.push(event.id);
      //   } else {
      //     // If event._id already exists, remove it from the items array
      //     items.splice(index, 1);
      //   }

      //   value = items;
      // }
    } else if (type === "email" || type === "text" || type === "number" || type === "password") {
      value = event.target.value;
    } else if (type === "mobilenumber") {
      const phoneNumberLength = parseInt(country.PhoneNumberLength) ?? 10;
      const trimmedValue = event.target.value?.slice(0, phoneNumberLength);
      value = { number: trimmedValue ?? "", country: parseInt(country.phoneCode), numberLength: phoneNumberLength };
    } else if (type === "search") {
      value = JSON.stringify(event);
    } else if (type === "image" || type === "file" || type === "video") {
      value = event.target.files;
    } else if (type === "datetime" || type === "time") {
      value = event ? event.toISOString() : null;
    } else if (type === "date") {
      value = event ? moment(event).set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toISOString() : null;
    } else if (type === "textarea") {
      value = event;
    } else if (type === "options") {
      value = event;
    } else {
      value = event.target.getAttribute("value");
    }
    if (field.maximum && typeof value === "string") {
      value = value.slice(0, field.maximum);
    }
    if (type === "number") {
      value = value?.replace(/\D/g, "");
    }
    if (field.format) {
      switch (field.format) {
        case "uppercase":
          value = value.toUpperCase();
          break;
        case "lowercase":
          value = value.toLowerCase();
          break;
        case "camelcase":
          value = value.replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to camelCase
          break;
        case "propercase":
          value = value.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase()); // Convert to Proper Case
          break;
        case "sentence":
          // value = correctCapitalization(value);
          break;
        default:
          break;
      }
    }

    let udpateValue = {
      ...tempFormValues,
      [field.name]: value,
    };
    if (type === "mobilenumber") {
      udpateValue = {
        ...tempFormValues,
        [field.name]: value,
        phoneCode: country.phoneCode,
        PhoneNumberLength: country.PhoneNumberLength,
      };
    }

    // if (["gender", "presentWeight", "userActivenessStatus", "dateOfBirth", "height", "age", "wrist", "waist", "hip", "forearm"].includes(field.name)) {
    //   updateHealthDetails(udpateValue);
    // }
    // if (["calories"].includes(field.name)) {
    //   updateCaloriDetails(udpateValue);
    // }

    // if (["proposedCalorie"].includes(field.name)) {
    //   updateDailyCaloric(udpateValue);
    // }

    if (type === "select") {
      if (field.updateFields) {
        field.updateFields?.forEach((element) => {
          udpateValue[element.id] = element.collection ? event[element.collection]?.[element.value] : event[element.value];
        });
      }
    }
    if (typeof field.onChange === "function") {
      udpateValue = field.onChange(field.name, udpateValue, props.formType);
    }
    // Creating an updated field
    // updating the formm values
    setFormValues(udpateValue);
    console.log({udpateValue});
    // Validating the fields
    if (validation(formState, udpateValue, formErrors, captchaStatus, props.useCheckbox, props.useCaptcha)) {
      if (autoUpdate) {
        props.submitHandler(udpateValue, true);
      }
    } else {
      if (autoUpdate) {
        // console.log({ autoUpdate: false });
        props.submitHandler(liveData ? udpateValue : null, false);
      }
    }
  };
  const setCaptchaStatusHandler = (status) => {
    setCaptchaStatus(status);
    validation(formState, formValues, formErrors, status, props.useCheckbox, props.useCaptcha);
  };
  const submitChange = async (event) => {
    event.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      if (validation(formState, formValues, formErrors, captchaStatus, props.useCheckbox, props.useCaptcha)) {
        if (await props.submitHandler(formValues, formState, lastUpdated)) {
          setLastUpdated({ ...formValues });
          setSubmitDisabled(true);
          setIsProcessing(false);
        }
        else{
          setIsProcessing(false);
        }
      }
    }
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(formValues) !== JSON.stringify(lastUpdated);
  };

  const closeModal = () => {
    if (hasUnsavedChanges()) {
      setMessage({
        type: 2, // Using type 2 for confirmation
        content: t("unsavedChanges", { defaultValue: "You have unsaved changes. Are you sure you want to discard them?" }),
        proceed: "Discard",
        cancel: "Cancel",
        onProceed: async () => {
          await props.isOpenHandler(false);
          return true;
        },
      });
    } else {
      props.isOpenHandler(false);
    }
  };

  const discardChanges = () => {
    setFormValues(lastUpdated);
    setSubmitDisabled(true);
  };

  const [activeStages, setSctiveStages] = useState(0);
  const [selectedTab, setSelectedTab] = useState();
  const [formMode] = useState(props.formMode ?? "single");
  return (
    formState &&
    formValues && (
      <Overlay key={props.referenceId} className={`form-container ${props.css ?? ""} ${props.formLayout} ${props.formStyle ?? ""}`}>
        <Page className={`${props.css ?? ""} ${formMode} ${props.bulkUpload ? "bulk" : ""} ${props.formLayout}  ${props.formStyle ?? ""}`}>
          {props.header?.trim().length > 0 && (
            <Header className={`${props.css ?? ""} ${props.formStyle ?? ""} form`}>
              <div className="flex items-center justify-between">
                {props.formStyle === "page" ? (
                  <button className="flex gap-2 align-center justify-center items-center" onClick={closeModal}>
                    <ArrowLeft size={20} />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: props.header ? props.header : "Login",
                      }}
                    ></span>
                  </button>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: props.header ? props.header : "Login",
                    }}
                  ></span>
                )}

                {formTabTheme === "steps" && (
                  <Navigation className={props.formType}>
                    {Object.keys(formStateGroup).map((group, index) => {
                      // const item = formStateGroup[group];
                      const isActive = activeStages === index;
                      const isDone = groupValidation[group] === 0 && activeStages >= index;
                      const statusClass = isActive ? "active" : isDone ? "done" : "upcoming";

                      return (
                        <React.Fragment key={group}>
                          {index > 0 && <GetIcon icon={"arrowRight"} />}
                          <Round className={statusClass}>{isDone ? <GetIcon icon={"tick"}></GetIcon> : index + 1}</Round>
                          <span className={statusClass}>{group}</span>
                        </React.Fragment>
                      );
                    })}
                  </Navigation>
                )}
                {(props.css ?? "") === "" && props.formStyle !== "page" && <IconButton icon="close" theme={themeColors} ClickEvent={closeModal}></IconButton>}
              </div>
              <span>{props.description}</span>
            </Header>
          )}
          {props.bulkUpload ? (
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
                  <Table className="small">
                    {jsonData?.map((data, rowIndex) => (
                      <Tr key={`${props.shortName}-${rowIndex}-${rowIndex}`} className={"no-border bulk"}>
                        {formState &&
                          formState.map((attribute, index) => {
                            const itemValue = data[attribute.name];
                            if (attribute.upload ?? false) {
                            } // ? data[t(attribute.label)] : data[t(attribute.label, { lng: selectedLanguage === "en" ? "de" : "en" })];
                            return (attribute.add ?? false) === true && attribute.type !== "hidden" ? (
                              <Td className="bulk" key={index}>
                                {/* <div>s */}
                                {/* {itemValue} */}
                                {/* {errorValue?.length > 0 && <div>{errorValue}</div>} */}
                                <FormInput bulkUpload={true} formValues={formValues} updateValue={{}} dynamicClass={"textarea"} placeholder={attribute.placeholder} key={`input` + index} id={index} index={rowIndex} error={formErrors[attribute.name]} value={itemValue} {...attribute} onChange={handleBulkChange} />
                                {formBulkErrors[rowIndex]?.[attribute.name] && <p>{formBulkErrors[rowIndex][attribute.name]}</p>}
                                {/* </div> */}
                              </Td>
                            ) : null;
                          })}
                      </Tr>
                    ))}
                  </Table>
                ) : (
                  <NoBulkDataSelected upload={uploadData} download={bulkUplaodFormat} icon={props.icon} shortName={props.shortName}></NoBulkDataSelected>
                )}
                {errorCount > 0 && <ErrorMessage style={{ marginTop: "10px" }}>{t("errorCount", { count: errorCount })}</ErrorMessage>}
              </RowContainer>
            </Form>
          ) : (
            <PageLayout className={`${props.css ?? ""} ${tabCount > 1 ? "tabs" : ""} ${formTabTheme}`}>
              {tabCount > 1 &&
                (formTabTheme === "normal" ? (
                  <TabMenu
                    selectedTab={selectedTab}
                    selectedChange={(key) => setSelectedTab(key)}
                    tabs={Object.keys(formStateGroup).map((group) => ({
                      key: group,
                      icon: group,
                      title: group,
                    }))}
                  ></TabMenu>
                ) : // <div>
                //   {Object.keys(formStateGroup).map((groupKey) => (
                //     <div>{groupKey}</div>
                //   ))}
                // </div>
                null)}
              <Form
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className={`${tabCount > 1 ? "SubPage" : ""} ${props.css ?? ""} ${formMode} ${formTabTheme}`}
              >
                {/* <FormInput type="info" content="All fields marked with (*) are mandatory! "></FormInput> */}
                {audioCapture && fillingForm === true ? (
                  <Record>Filling your form..</Record>
                ) : (
                  audioCapture && (
                    <Record className={`record-button ${recording && "recording"}`}>
                      <button id="record-button" className={`record-button`} onClick={recording ? handleStopRecording : handleStartRecording}>
                        {recording ? (
                          <>
                            <GetIcon icon={"mic"}></GetIcon> Stop Recording
                          </>
                        ) : (
                          <>
                            <GetIcon icon={"mic"}></GetIcon> Record Audio
                          </>
                        )}
                      </button>
                      {recording && (
                        <p>
                          Tell us about the
                          <span
                            dangerouslySetInnerHTML={{
                              __html: props.header.replace("Add a", "").trim(),
                            }}
                          />
                          you want to add. For example,
                          {
                            <span>
                              {formState
                                .filter((item) => item.add && !["select", "multiSelect", "file", "image"].includes(item.type))
                                .map((item) => item.label)
                                .join(", ")}
                            </span>
                          }
                          . You can speak in any language.
                        </p>
                      )}
                      <span className="info">Tired of Typing? Just talk and AI will do the rest!</span>
                    </Record>
                  )
                )}
                {Object.keys(formStateGroup).map((groupKey) => (
                  <React.Fragment key={groupKey}>
                    {formStateGroup[groupKey].inputs.map((item, index) => {
                      let dynamicClass = "";
                      let disabled = false;

                      // Existing condition logic
                      if (item.condition) {
                        let conditionStatus = false;
                        if (Array.isArray(item.condition.if)) {
                          conditionStatus = item.condition.if.some((checkitem) => checkitem.toString() === formValues[item.condition.item]?.toString());
                        } else {
                          conditionStatus = item.condition.if.toString() === formValues[item.condition.item]?.toString();
                        }
                        dynamicClass = conditionStatus ? item.condition.then : item.condition.else;
                      }

                      if (props.formType === "put" && !item.update && item.view) {
                        disabled = true;
                      }

                      let updateValue = {};
                      if (item.type === "select" || item.type === "multiSelect") {
                        if (Array.isArray(item.updateOn)) {
                          updateValue = {};
                          item.updateOn.forEach((itemName) => {
                            updateValue[itemName] = formValues[itemName];
                          });
                        } else {
                          updateValue = {
                            [item.updateOn]: formValues[item.updateOn],
                          };
                        }
                      }
                      const params = [
                        ...(item.params
                          ? item.params.map((item) => ({
                              ...item,
                              value: item.value || formValues?.[item.name] || "",
                            }))
                          : []),
                        ...(props.referenceId
                          ? [
                              {
                                name: props.parentReference,
                                value: props.referenceId,
                              },
                            ]
                          : []),
                      ];
                      dynamicClass += selectedTab === groupKey ? "" : " disabled";
                      if ((props.formType === "put" && (item.update || item.view)) || (props.formType === "post" && item.add)) {
                        return <FormInput parentReference={props.parentReference} referenceId={props.referenceId} setMessage={setMessage} setLoaderBox={setLoaderBox} formType={props.formType} disabled={disabled} dynamicClass={formMode + " " + dynamicClass} formValues={formValues} updateValue={updateValue} placeholder={item.placeHolder} key={`input-${groupKey}-${item.index}`} id={item.index} error={formErrors[formState[item.index].name]} value={formValues[formState[item.index].name]} {...item} params={params} onChange={handleChange} />;
                      } else {
                        return null;
                      }
                    })}
                  </React.Fragment>
                ))}
                {props.useCaptcha === true && <Captcha error={formErrors["captchaError"]} label={t("captcha")} key="1" setCaptchaStatus={setCaptchaStatusHandler}></Captcha>}
              </Form>
            </PageLayout>
          )}
          {props.consent && <FootNote className="consent">{props.consent}</FootNote>}
          <React.Fragment>
            {!autoUpdate && (
              <Footer className={`${props.formLayout} ${props.formType ?? ""} ${props.css ?? ""} ${submitDisabled ? "disabled" : ""} ${props.css ?? ""}`}>
                {formTabTheme === "steps" ? (
                  <React.Fragment>
                    {(props.css ?? "") === "" && <FormInput type="close" value={"Cancel"} onChange={closeModal} />}
                    {activeStages > 0 && (
                      <FormInput
                        css={props.css}
                        type="submit"
                        name="submit"
                        value={"Back"}
                        onChange={() => {
                          setSctiveStages((prev) => {
                            const stage = prev - 1;
                            setSelectedTab(Object.keys(formStateGroup)[stage]);
                            return stage;
                          });
                        }}
                      />
                    )}
                    {tabCount > 1 && activeStages + 1 < tabCount && (
                      <FormInput
                        css={props.css}
                        disabled={Object.keys(groupValidation).length > 0 ? groupValidation[Object.keys(formStateGroup)[activeStages]] > 0 : true}
                        type="submit"
                        name="submit"
                        value={"Next"}
                        onChange={() => {
                          setSctiveStages((prev) => {
                            const stage = prev + 1;
                            setSelectedTab(Object.keys(formStateGroup)[stage]);
                            return stage;
                          });
                        }}
                      />
                    )}

                    {activeStages + 1 === tabCount && <FormInput css={props.css} disabled={submitDisabled} type="submit" name="submit" value={props.button ? props.button : "Submit"} onChange={props.bulkUpload ? bulkUploadHandler : submitChange} />}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {(props.css ?? "") === "" && <FormInput type="close" value={"Cancel"} onChange={closeModal} />}
                    {props.formType.toLowerCase() === "put" && !props.bulkUpload && !submitDisabled && <FormInput type="close" value={"Discard"} onChange={discardChanges} />}
                    <FormInput
                      css={`
                        ${props.css} ${isProcessing ? "processing" : ""}
                      `}
                      colors={colors}
                      disabled={submitDisabled || isProcessing}
                      type="submit"
                      name="submit"
                      icon={isProcessing ? "loading" : ""}
                      value={isProcessing ? "" : props.button ? props.button : "Submit"}
                      onChange={props.bulkUpload ? bulkUploadHandler : submitChange}
                    />
                  </React.Fragment>
                )}
              </Footer>
            )}
          </React.Fragment>
        </Page>
      </Overlay>
    )
  );
});

export default CrudForm;
