import React, { useEffect, useState } from "react";
import "./style.css";
import { Container } from "../../core/layout/styels"; // Corrected "styels" to "styles"
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseFill } from "react-icons/ri";
import { motion } from "framer-motion";
import AutoForm from "../../core/form";
import { getData, postData } from "../../../backend/api";
import styled from "styled-components";
import logo from "../../../components/project/brand/logo.png";
// import { tr } from "date-fns/locale";

const RegisterBtn = styled.button`
  background: linear-gradient(135deg, #153f7a, #245fb4);
  color: white;
  border-radius: 999px;
  border: none;
  padding: 14px 20px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 18px 36px rgba(21, 63, 122, 0.24);

  &.float {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 16px;
    z-index: 1002;
  }

  @media (max-width: 768px) {
    &.float {
      width: calc(100% - 32px);
    }
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  .form-group {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  .form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 8px;
  }

  /* Override AutoForm specific styles */
  .plain.embed {
    width: 100% !important;

    .form-row {
      display: block !important;
      width: 100% !important;
    }

    .form-group {
      width: 100% !important;
      min-width: 100% !important;
      flex: 0 0 100% !important;
      padding: 0 !important;
      margin-bottom: 20px !important;
    }

    .form-input {
      width: 100% !important;
      min-width: 100% !important;
    }

    input,
    select,
    textarea {
      width: 100% !important;
      min-width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Target specific fields */
    [name="nameOfApplicant"],
    [name="mobileNumber"],
    [name="whatsappNumber"],
    [name="address"],
    [name="gender"],
    [name="age"],
    [name="educationalQualification"],
    [name="nameOfExamAppearingNow"],
    [name="district"],
    [name="area"],
    [name="status"],
    [name="CenterRegistration"],
    [name="affiliation"] {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    }

    /* Remove any column layouts */
    .col,
    [class*="col-"] {
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
      padding: 0 !important;
    }

    /* Override any grid systems */
    .row {
      display: block !important;
      margin: 0 !important;
    }

    /* Ensure labels are also full width */
    label {
      width: 100% !important;
      display: block !important;
      margin-bottom: 8px !important;
    }

    /* Override any custom classes */
    .full,
    .half,
    .quarter {
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }
  }

  /* Style for form title */
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    width: 100%;
  }

  /* Style for form description */
  p {
    margin-bottom: 30px;
    color: #666;
    width: 100%;
  }

  /* Style for required field asterisk */
  .required {
    color: red;
    margin-left: 4px;
  }

  /* Style for info text */
  .info-text {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
    width: 100%;
  }

  /* Make submit button full width */
  button[type="submit"] {
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const onChange1 = (nameOfCenter, updateValue) => {
  const { studentsCountMale, studentsCountFemale, centerType } = updateValue;
  const male = parseFloat(studentsCountMale) || 0;
  const female = parseFloat(studentsCountFemale) || 0;
  const total = centerType === "Mixed" ? male + female : 0;
  updateValue["studentsCountTotal"] = total.toFixed(0);
  return updateValue;
};

// Add number validation function
const validatePhoneNumber = (value) => {
  // Remove any non-digit characters
  value = value.replace(/\D/g, "");
  if (value.length > 10) {
    return value.slice(0, 10);
  }
  return value;
};

function Header(props) {
  const [openMenuSetup, setOpenMenuSetup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openAffiliation, setOpenAffiliation] = useState(false);
  const [openHallTicket, setOpenHallTicket] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [isFloating, setIsFloating] = useState(window.matchMedia("(max-width: 600px)").matches);

  useEffect(() => {
    const handleResize = () => {
      setIsFloating(window.matchMedia("(max-width: 600px)").matches);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const toggleHelpPopup = () => {
    setShowHelpPopup(!showHelpPopup);
    setShowMenu(false);
  };

  const openActionPanel = (action) => {
    setShowMenu(false);
    setOpenMenuSetup(false);
    setOpenAffiliation(false);
    setOpenHallTicket(false);
    setShowHelpPopup(false);

    if (action === "examRegistration") setOpenMenuSetup(true);
    if (action === "centerRegistration") setOpenAffiliation(true);
    if (action === "hallTicket") setOpenHallTicket(true);
    if (action === "examInstructions") setShowHelpPopup(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formInput = [
    {
      type: "title",
      title: "Center Details",
      add: true,
    },
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
      apiType: "CSV",
      selectApi: "Male,Female,Mixed",
      placeholder: "Center Type",
      updateOn: "centerType",
      name: "centerType",
      validation: "",
      showItem: "userDisplayName",
      default: "",
      tag: false,
      label: "Center Type",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
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
      search: true,
      filter: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "area/get-area-by-district",
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
      search: true,
      filter: true,
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
      type: "title",
      title: "Students Details",
      add: true,
    },
    {
      type: "number",
      placeholder: "Male Students",
      name: "studentsCountMale",
      validation: "",
      default: 0,
      label: "Male Students",
      required: true,
      add: true,
      onChange: onChange1,
      condition: {
        item: "centerType",
        if: "Female",
        then: "disabled",
        else: "enabled",
      },
    },
    {
      type: "number",
      placeholder: "Female Students",
      name: "studentsCountFemale",
      validation: "",
      default: 0,
      label: "Female Students",
      required: true,
      add: true,
      onChange: onChange1,
      condition: {
        item: "centerType",
        if: "Male",
        then: "disabled",
        else: "enabled",
      },
    },
    {
      type: "number",
      placeholder: "Total Students",
      name: "studentsCountTotal",
      validation: "",
      default: 0,
      label: "Total Students",
      required: true,
      add: true,
      onChange: onChange1,
      condition: {
        item: "centerType",
        if: "Mixed",
        then: "enabled",
        else: "disabled",
      },
      update: true,
    },
    // {
    //   type: "title",
    //   title: "Co Ordinator Details",
    //   add: true,
    // },
    // {
    //   type: "text",
    //   placeholder: "Area Qsc Co Ordinator Name",
    //   name: "AreaQscCoOrdinatorName",
    //   validation: "",
    //   default: "",
    //   label: "Area Qsc Co Ordinator Name",
    //   required: true,
    //   add: true,
    // },
    // {
    //   type: "text",
    //   placeholder: "Mobile Number Of Co Ordinator",
    //   name: "mobNumberOfAreaQscCoOrdinator",
    //   validation: "",
    //   default: "",
    //   label: "Mobile Number Of Co Ordinator",
    //   required: true,
    //   add: true,
    // },
  ];

  const formReg = [
    {
      type: "title",
      title: "Basic Information",
      add: true,
      export: false,
    },
    {
      type: "text",
      placeholder: "Name Of Applicant",
      name: "nameOfApplicant",
      validation: "",
      default: "",
      label: "Name Of Applicant",
      tag: true,
      required: true,
      view: true,
      add: true,
      update: true,
      customClass: "full",
    },
    {
      type: "info",
      content: "നിങ്ങളുടെ 10 അക്ക മൊബൈൽ നമ്പർ ടൈപ്പ് ചെയ്യുക,ഹാൾ ടിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യുന്ന സമയത്ത് നൽകേണ്ടതിനാൽ ഈ നമ്പർ നോട്ട് ചെയ്തു വെക്കുക. (ഒരാൾ നൽകിയ മൊബൈൽ നമ്പർ പിന്നീട് മറ്റൊരാൾക്ക് നൽകാൻ കഴിയുന്നതല്ല.)",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "number",
      placeholder: "Mobile Number",
      name: "mobileNumber",
      validation: "^[0-9]{10}$",
      default: "",
      label: "Mobile Number",
      tag: true,
      required: true,
      view: true,
      add: true,
      update: true,
      maxLength: 10,
      onKeyUp: (e) => {
        e.target.value = validatePhoneNumber(e.target.value);
      },
    },
    {
      type: "number",
      placeholder: "Whatsapp Number",
      name: "whatsappNumber",
      validation: "^[0-9]{10}$",
      default: "",
      label: "Whatsapp Number",
      tag: false,
      required: true,
      add: true,
      view: true,
      update: true,
      maxLength: 10,
      onKeyUp: (e) => {
        e.target.value = validatePhoneNumber(e.target.value);
      },
    },
    {
      type: "select",
      placeholder: "Gender",
      name: "gender",
      validation: "",
      default: "",
      tag: false,
      label: "Gender",
      showItem: "Gender",
      required: true,
      view: true,
      filter: true,
      add: true,
      update: true,
      apiType: "CSV",
      selectApi: "Male,Female",
      customClass: "quarter",
    },

    {
      type: "textarea",
      placeholder: "Address",
      name: "address",
      validation: "",
      default: "",
      label: "Address",
      tag: false,
      required: true,
      add: true,
      view: true,
      update: true,
    },
    {
      type: "number",
      placeholder: "Age",
      name: "age",
      validation: "",
      default: "",
      label: "Age",
      tag: false,
      required: true,
      add: true,
      view: true,
    },
    {
      type: "title",
      title: "Qualification Details",
      add: true,
      export: false,
    },
    {
      type: "textarea",
      placeholder: "Educational Qualification",
      name: "educationalQualification",
      validation: "",
      default: "",
      label: "Educational Qualification",
      tag: true,
      required: true,
      add: true,
      view: true,
      update: true,
    },
    {
      type: "title",
      title: "Exam Details",
      add: true,
      export: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-type/select",
      placeholder: "Name of Exam Appearing Now",
      updateOn: "",
      name: "nameOfExamAppearingNow",
      // collection: "nameOfExamAppearingNow",
      validation: "",
      showItem: "examType",
      search: false,
      default: "",
      tag: true,
      label: "Name of Exam Appearing Now",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      export: false,
      // customClass: "full",
    },
    {
      type: "info",
      content: "താങ്കൾ എഴുതുന്ന പരീക്ഷയുടെ പേര് തെരഞ്ഞെടുക്കുക",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "line",
      add: false,
      update: true,
      export: false,
    },
    {
      type: "hidden",
      name: "examName",
      label: "Exam Name",
      tag: false,
      add: false,
      update: false,
      view: false,
      export: true,
    },
    {
      type: "hidden",
      name: "examSyllabus",
      label: "Exam Syllabus",
      tag: false,
      add: false,
      update: false,
      view: false,
      export: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "District",
      name: "district",
      // collection: "district",
      validation: "",
      showItem: "district",
      default: "",
      tag: true,
      label: "District",
      search: false,
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      // customClass: "half",
    },
    {
      type: "line",
      add: false,
      update: true,
      export: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "area/get-area-by-district",
      placeholder: "Area",
      updateOn: "district",
      name: "area",
      // collection: "area",
      search: false,
      validation: "",
      showItem: "area",
      default: "",
      tag: true,
      label: "Area",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      // customClass: "half",
    },
    {
      type: "info",
      content: "ഖുർആൻ സ്റ്റഡി സെന്റർ കേരളയിൽ അഫിലിയേറ്റ് ചെയ്തിട്ടുള്ള പ്രാദേശിക സെന്ററുകളിൽ പഠിക്കുന്നവർ Regular വിഭാഗത്തിലും അല്ലാത്തവർ Private വിഭാഗത്തിലും ഉൾപ്പെടുന്നു.(ഈ രണ്ട് വിഭാഗങ്ങളിലും വെവ്വേറെ റാങ്ക് ലിസ്റ്റ് പ്രസിദ്ധീകരിക്കുന്നതാണ്)",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "select",
      placeholder: "Mode of Study",
      name: "status",
      validation: "",
      default: "",
      tag: true,
      label: "Mode of Study",
      showItem: "",
      required: true,
      view: true,
      info: "ഖുർആൻ സ്റ്റഡി സെന്റർ കേരളയിൽ അഫിലിയേറ്റ് ചെയ്തിട്ടുള്ള പ്രാദേശിക സെന്ററുകളിൽ പഠിക്കുന്നവർ Regular വിഭാഗത്തിലും അല്ലാത്തവർ Private വിഭാഗത്തിലും ഉൾപ്പെടുന്നു.",
      filter: true,
      add: true,
      update: true,
      apiType: "CSV",
      selectApi: "Private,Regular",
      export: true,
      customClass: "full",
    },
    {
      type: "line",
      add: false,
      update: true,
      export: false,
    },
    {
      type: "info",
      content: "റെഗുലർ സെന്ററുകളിൽ പഠിക്കുന്നവർ തങ്ങളുടെ സ്റ്റഡി സെന്റർ തന്നെയാണ് പരീക്ഷ കേന്ദ്രമായി തെരഞ്ഞെടുക്കേണ്ടത്.",
      add: true,
      update: true,
      condition: {
        item: "status",
        if: "Regular",
        then: "enabled",
        else: "disabled",
      },
      export: false,
    },
    {
      type: "info",
      content: " താങ്കളുട ഏറ്റവും അടുത്തുള്ള സ്റ്റഡി സെന്റർ പരീക്ഷ കേന്ദ്രമായി തിരഞ്ഞെടുക്കുക.",
      add: true,
      update: true,
      condition: {
        item: "status",
        if: "Private",
        then: "enabled",
        else: "disabled",
      },
      export: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "center-registration/area",
      placeholder: "Study Center",
      customClass: "full",
      updateOn: "area",
      name: "centerRegistration",
      // collection: "centerRegistration",
      validation: "",
      showItem: "nameOfCenter",
      default: "",
      tag: false,
      label: "Study Center (പരീക്ഷാ കേന്ദ്രം കൂടിയാണിത്)",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      search: false,
      export: true,
    },
    {
      type: "info",
      content:
        "പരീക്ഷാ കേന്ദ്രം: സ്റ്റഡി സെന്ററുകൾ തന്നെ പരീക്ഷാ കേന്ദ്രങ്ങളാണ്. " +
        "ഒരു സ്റ്റഡി സെന്ററിൽ 5-ൽ താഴെ ആളുകൾ മാത്രമാണെങ്കിൽ, സമീപത്തെ സ്റ്റഡി സെന്ററുമായി ചേർത്ത് സംഘടിപ്പിക്കും. " +
        "അന്തിമ പരീക്ഷാ കേന്ദ്രം ഹാൾടിക്കറ്റിൽ ലഭ്യമാകും.",
      add: true,
      update: false,
      export: false,
    },
    {
      type: "title",
      title: "Payment Information",
      add: true,
      export: false,
    },
    {
      type: "info",
      content: "രജിസ്ട്രേഷൻ അറിയിപ്പിൻ്റെ കൂടെയുള്ള പോസ്റ്ററിലെ QR കോഡിലേക്ക് പരീക്ഷാ ഫീസ് 100 രൂപ അയക്കുക. ഏത് നമ്പറിൽ നിന്നാണോ അയച്ചത് പ്രസ്തുത നമ്പർ ഇവിടെ നൽകുക.(ഒരു നമ്പറിൽ നിന്ന് ഒരുമിച്ച് അയക്കുന്നവർ എല്ലാവരും പ്രസ്തുത നമ്പർ ആണ് കൊടുക്കേണ്ടത്)",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "number",
      placeholder: "Gpay Number",
      name: "feeDetails",
      validation: "^[0-9]{10}$",
      default: "",
      info: "Regular വിഭാഗത്തിന് 100 രൂപയും Private വിഭാഗത്തിന് 150 രൂപയുമാണ് രജിസ്ട്രേഷൻ ഫീസ്. തുക 7994162608 നമ്പറിൽ ഗൂഗിൾ പേ ചെയ്യുക. ഏത് നമ്പറിൽ നിന്നാണോ ഗൂഗിൾ പേ ചെയ്തത്, ആ നമ്പർ ഇവിടെ നൽകുക.",
      label: "Gpay Number",
      required: true,
      add: true,
      view: true,
      export: true,
      maxLength: 10,
      onKeyUp: (e) => {
        e.target.value = validatePhoneNumber(e.target.value);
      },
    },
  ];

  const hallTicket = [
    {
      type: "info",
      content: "Enter Mobile Number to download Hall Ticket",
    },
    {
      type: "number",
      placeholder: "Mobile Number",
      name: "mobileNumber",
      validation: "",
      default: "",
      label: "Mobile Number",
      required: true,
      add: true,
    },
  ];

  const isCreatingHandler = (value, callback) => {
    setOpenMenuSetup(false);
    setOpenAffiliation(false);
    setOpenHallTicket(false);
  };

  const submitHallticket = async (post) => {
    props.setLoaderBox(true);
    try {
      const response = await postData({ ...post }, "hall-ticket/download");

      if (response && (response.data?.success || response.success === true)) {
        setOpenHallTicket(false);
        props.setLoaderBox(false);
        props.setMessage({
          type: 3,
          content: "Downloaded Successfully",
          proceed: "Okay",
        });
        window.open(response.data.url, "_blank");
      } else {
        props.setLoaderBox(false);
        props.setMessage({
          type: 3,
          content: "User not registered for the exam",
          proceed: "Okay",
        });
      }
    } catch (error) {
      props.setLoaderBox(false);
      props.setMessage({
        type: 3,
        content: "An error occurred while submitting the hall ticket",
        proceed: "Okay",
      });
    }
  };

  const submitChange = async (post) => {
    postData({ ...post }, "center-registration").then((response) => {
      if (response.data.success === true) {
        setOpenAffiliation(false);
        props.setMessage({
          type: 1,
          content: "Submitted Successfully",
          proceed: "Okay",
        });
      }
    });
  };

  const submitReg = async (post) => {
    postData({ ...post }, "exam-registration")
      .then((response) => {
        if (response.data.success === true) {
          props.setMessage({
            type: 2,
            content: "Submitted Successfully",
            proceed: "Okay",
            okay: "Cancel",
            onClose: async () => {
              try {
                setOpenMenuSetup(false);
              } catch (error) {}
            },
            onProceed: async () => {
              try {
                setOpenMenuSetup(false);
              } catch (error) {}
            },
            data: { id: 1 },
          });
        } else {
          // Handle error case with customMessage
          props.setMessage({
            type: 3, // Using type 3 for error messages
            content: response.data.customMessage || "An error occurred during registration",
            proceed: "Okay",
          });
        }
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        props.setMessage({
          type: 3,
          content: error.response?.data?.customMessage || "An error occurred during registration",
          proceed: "Okay",
        });
      });
  };

  const [showCenterRegistration, setCenterRegistration] = useState(false);
  const [showHallTicket, setHallTicket] = useState(false);
  const [showExamRegistration, setExamRegistration] = useState(false);
  const [showDownloads, setDownloads] = useState(false);
  const [showAboutUs, setAboutUs] = useState(false);
  const [showResult, setResult] = useState(false);
  const [showExamInstructions, setExamInstructions] = useState(false);

  useEffect(() => {
    getData({}, "floating-menu-settings").then((response) => {
      const settings = response?.data?.response?.[0] || {
        downloads: true,
        about: true,
      };

      setCenterRegistration(!!settings.centerRegistration);
      setHallTicket(!!settings.hallTicket);
      setExamRegistration(!!settings.examRegistration);
      setDownloads(!!settings.downloads);
      setAboutUs(!!settings.about);
      setResult(!!settings.result);
      setExamInstructions(!!settings.examInstruction);
    });
  }, []);

  useEffect(() => {
    const handleLandingAction = (event) => {
      const action =
        typeof event.detail === "string" ? event.detail : event.detail?.action;

      if (action) {
        openActionPanel(action);
      }
    };

    window.addEventListener("qsc:landing-action", handleLandingAction);

    return () => {
      window.removeEventListener("qsc:landing-action", handleLandingAction);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    showDownloads ? { label: "Downloads", href: "/question-papers" } : null,
    showAboutUs ? { label: "About QSC", href: "/about-us" } : null,
    showResult ? { label: "Result", href: "/result" } : null,
  ].filter(Boolean);

  const renderModal = (content) => (
    <div className="landing-modal-backdrop" onClick={() => isCreatingHandler()}>
      <div
        className="landing-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );

  return (
    <>
      <header className="landing-site-header">
        <div className="landing-header-shell">
          <a href="/" className="landing-brand">
            <img src={logo} alt="QSC logo" />
            <div className="landing-brand-copy">
              <span>Public portal</span>
              <strong>QSC Kerala</strong>
            </div>
          </a>

          <div className="landing-navbar">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
            {showExamInstructions && (
              <button
                type="button"
                className="landing-nav-btn"
                onClick={() => openActionPanel("examInstructions")}
              >
                Instructions
              </button>
            )}
            {showCenterRegistration && (
              <button
                type="button"
                className="landing-nav-btn"
                onClick={() => openActionPanel("centerRegistration")}
              >
                Centre Affiliation
              </button>
            )}
          </div>

          <div className="landing-header-actions">
            {showHallTicket && (
              <button
                type="button"
                className="landing-header-btn secondary"
                onClick={() => openActionPanel("hallTicket")}
              >
                Hall Ticket
              </button>
            )}
            <button
              type="button"
              className="landing-header-btn primary landing-register-highlight"
              onClick={() => openActionPanel("examRegistration")}
            >
              Exam Registration
            </button>
            <a href="/student" className="landing-header-btn subtle">
              Student Login
            </a>
            <a href="/admin" className="landing-header-btn subtle">
              Admin Login
            </a>
            {showMenu ? (
              <RiCloseFill className="landing-hamburger" onClick={handleMenu} />
            ) : (
              <GiHamburgerMenu className="landing-hamburger" onClick={handleMenu} />
            )}
          </div>
        </div>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="landing-mobile-nav"
          >
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setShowMenu(false)}>
                {item.label}
              </a>
            ))}
            {showExamInstructions && (
              <button
                type="button"
                className="landing-nav-btn"
                onClick={() => openActionPanel("examInstructions")}
              >
                Exam Instructions
              </button>
            )}
            {showCenterRegistration && (
              <button
                type="button"
                className="landing-nav-btn"
                onClick={() => openActionPanel("centerRegistration")}
              >
                Centre Affiliation
              </button>
            )}
            {showHallTicket && (
              <button
                type="button"
                className="landing-nav-btn"
                onClick={() => openActionPanel("hallTicket")}
              >
                Hall Ticket
              </button>
            )}
            <button
              type="button"
              className="landing-mob-register-btn landing-register-highlight"
              onClick={() => openActionPanel("examRegistration")}
            >
              Exam Registration
            </button>
          </motion.div>
        )}
      </header>

      {isFloating && !showMenu && !openMenuSetup && (
        <RegisterBtn
          className="float"
          onClick={(event) => {
            event.preventDefault();
            openActionPanel("examRegistration");
          }}
        >
          Exam Registration
        </RegisterBtn>
      )}

      <Container className="noshadow landing-modal-layer">
        {openMenuSetup &&
          renderModal(
            <FormContainer>
              <AutoForm
                useCaptcha={false}
                key={"form"}
                formType={"post"}
                header={"Registration"}
                description={"ഖുർആൻ സ്റ്റഡി സെന്റർ കേരള വാർഷിക പരീക്ഷയ്ക്ക് രജിസ്റ്റർ ചെയ്യാനുള്ള ഫോം ആണിത്. ഇംഗ്ലീഷിൽ ടൈപ്പ് ചെയ്താൽ മാത്രമേ സബ്മിറ്റ് ആവുകയുള്ളൂ എന്നത് പ്രത്യേകം ശ്രദ്ധിക്കുക."}
                css="plain embed"
                formInput={formReg}
                submitHandler={submitReg}
                button={"Submit"}
                isOpenHandler={isCreatingHandler}
                isOpen={true}
                plainForm={false}
                formMode={"single"}
              />
            </FormContainer>
          )}

        {openAffiliation &&
          renderModal(
            <FormContainer>
              <AutoForm
                useCaptcha={false}
                key={"form"}
                formType={"post"}
                header={"Centre Affiliation"}
                description={"പ്രാദേശിക തലങ്ങളിൽ പ്രവർത്തിക്കുന്ന ഖുർആൻ പഠന വേദികൾ, ഖുർആൻ സ്റ്റഡി സെന്റർ കേരളയിൽ അഫിലിയേറ്റ് ചെയ്യുന്നതിനുള്ള ഫോം."}
                css="plain embed"
                formInput={formInput}
                submitHandler={submitChange}
                button={"Submit"}
                isOpenHandler={isCreatingHandler}
                isOpen={true}
                plainForm={false}
                formMode={"single"}
              />
            </FormContainer>
          )}

        {openHallTicket &&
          renderModal(
            <FormContainer>
              <AutoForm
                useCaptcha={false}
                key={"form"}
                formType={"post"}
                header={"Hall Ticket Download"}
                description={"രജിസ്ട്രേഷൻ സമയത്ത് നൽകിയ മൊബൈൽ നമ്പർ താഴെ നൽകി സബ്മിറ്റ് ചെയ്യുക."}
                css="plain embed"
                formInput={hallTicket}
                submitHandler={submitHallticket}
                button={"Submit"}
                isOpenHandler={isCreatingHandler}
                isOpen={true}
                plainForm={false}
                formMode={"single"}
              />
            </FormContainer>
          )}

        {showHelpPopup && (
          <div className="help-popup" onClick={toggleHelpPopup}>
            <div className="help-content" onClick={(event) => event.stopPropagation()}>
              <h3>നിര്‍ദ്ദേശങ്ങള്‍</h3>
              <p>
                ഖുർആൻ സ്റ്റഡി സെന്റർ കേരള വാർഷിക പരീക്ഷയുടെ രജിസ്ട്രേഷൻ ഫോം
                പൂരിപ്പിക്കുന്നതിന് മുമ്പ് താഴെ നൽകിയ നിർദേശങ്ങൾ ശ്രദ്ധിച്ച്
                വായിക്കുക.
              </p>
              <p>
                1. ഖുർആൻ സ്റ്റഡി സെന്റർ കേരളയിൽ അഫിലിയേറ്റ് ചെയ്തിട്ടുള്ള
                പ്രാദേശിക സ്റ്റഡി സെന്ററുകളിൽ പഠിച്ചു പരീക്ഷ എഴുതുന്നവർ റഗുലർ
                വിഭാഗത്തിലും സ്വന്തമായി പഠിച്ചു പരീക്ഷ എഴുതുന്നവർ പ്രൈവറ്റ്
                വിഭാഗത്തിലുമാണ് രജിസ്റ്റർ ചെയ്യേണ്ടത്. ഫോമിൽ Mode of Study എന്ന
                ഓപ്ഷനിൽ Private അല്ലെങ്കിൽ Regular തെരഞ്ഞെടുക്കുക.
              </p>
              <p>
                2. നിശ്ചിത കോളത്തിൽ, ലഭ്യമായ പരീക്ഷകളുടെ ലിസ്റ്റിൽ നിന്ന് നിങ്ങൾ
                എഴുതുന്നത് കൃത്യമായി തെരഞ്ഞെടുക്കണം.
              </p>
              <p>
                3. റഗുലർ വിഭാഗത്തിൽ ഉള്ളവർ തങ്ങൾ പഠിക്കുന്ന സെന്ററിന്റെ പേര് Study
                Centre ഓപ്ഷനിലെ ലിസ്റ്റിൽ നിന്ന് തെരഞ്ഞെടുക്കുക. അഫിലിയേഷൻ നമ്പറും
                ചേർക്കണം.
              </p>
              <p>
                4. നിങ്ങൾ പഠിക്കുന്ന പ്രാദേശിക സെന്ററിന്റെ പേര് ലിസ്റ്റിൽ ഇല്ലെങ്കിൽ
                Area QSC കോഡിനേറ്ററെ അറിയിക്കേണ്ടതാണ്. അവർ മുഖേന അഫിലിയേഷൻ
                വിവരങ്ങൾ ലഭ്യമാകുന്നതാണ്.
              </p>
              <p>
                5. രജിസ്ട്രേഷൻ ഫീസ് ഏത് വിഭാഗത്തിലാണോ ബാധകമാകുന്നത്, ആ തുക
                നിർദേശിച്ച നമ്പറിലേക്ക് അടച്ച ശേഷം ഗൂഗിൾ പേ ചെയ്ത നമ്പർ തന്നെയാണ്
                ഫോമിൽ നൽകേണ്ടത്.
              </p>
              <button className="landing-help-close" onClick={toggleHelpPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default Header;
