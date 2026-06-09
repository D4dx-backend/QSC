import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getData } from "../../../../backend/api";
import CustomSelect from "../../../core/select";

const QuestionPacking = (props) => {
  useEffect(() => {
    document.title = `Question Packing List - QSC Automation`;
  }, []);

  const [packingData, setPackingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examCenter, setExamCenter] = useState("");
  const [centers] = useState([]);

  const fetchPackingData = async (centerId) => {
    try {
      const response = await getData({ examCenter: centerId }, "exam-registration/list");
      if (response?.data?.success) {
        setPackingData(response.data.response || []);
      } else {
        setPackingData([]);
        props.setMessage({
          type: 1,
          content: "No data found for the selected exam center",
          proceed: "Okay",
        });
      }
    } catch (error) {
      setPackingData([]);
      props.setMessage({
        type: 1,
        content: "Error fetching data. Please try again.",
        proceed: "Okay",
      });
    }
  };

  const handleCenterChange = (selectedOption) => {
    const centerId = selectedOption?.id || "";
    setExamCenter(centerId);
    if (centerId) fetchPackingData(centerId);
  };

  const groupDataByExamCenterAndExamName = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const center = item.examCenter || "Unknown Center";
      const examName = item.examName || "Unknown Exam";

      if (!grouped[center]) {
        grouped[center] = {};
      }
      if (!grouped[center][examName]) {
        grouped[center][examName] = [];
      }
      grouped[center][examName].push({
        "Reg No": item.regno,
        "Name Of Applicant": item.nameOfApplicant,
        "Exam Name": examName,
        "Exam Center": center,
      });
    });
    return grouped;
  };

  const generateExcelFile = (data, fileName) => {
    const sanitizeSheetName = (name) => {
      return name.replace(/[:\\/?*[\]]/g, "").substring(0, 31);
    };

    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(fileName));
      return XLSX.write(wb, { type: "array", bookType: "xlsx" });
    } catch (error) {
      return null;
    }
  };

  const handleDownload = async () => {
    if (!examCenter) {
      props.setMessage({
        type: 1,
        content: "Please select an Exam Center first",
        proceed: "Okay",
      });
      return;
    }

    if (!packingData || packingData.length === 0) {
      props.setMessage({
        type: 1,
        content: "No data to download",
        proceed: "Okay",
      });
      return;
    }

    setLoading(true);

    try {
      const zip = new JSZip();
      const groupedData = groupDataByExamCenterAndExamName(packingData);

      if (Object.keys(groupedData).length === 0) {
        throw new Error("No data available after grouping");
      }

      // Create exam center folders and exam name Excel files
      Object.entries(groupedData).forEach(([center, exams]) => {
        const centerFolder = zip.folder(center);

        Object.entries(exams).forEach(([examName, data]) => {
          const excelBuffer = generateExcelFile(data, examName);

          if (!excelBuffer) {
            console.error(`Failed to generate Excel for ${examName}`);
            return;
          }

          centerFolder.file(`${examName}.xlsx`, excelBuffer);
        });
      });

      // Generate and download zip file
      const content = await zip.generateAsync({ type: "blob" });
      const selectedCenterName = centers.find((c) => c.id === examCenter)?.centerName || "ExamCenter";
      saveAs(content, `Question Packing - ${selectedCenterName}.zip`);
    } catch (error) {
      console.error("Error generating zip:", error);
      props.setMessage({
        type: 1,
        content: `Error generating question packing sheet: ${error.message}`,
        proceed: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  const [attributes] = useState([
    {
      type: "text",
      name: "regno",
      label: "Reg No",
      tag: true,
      view: true,
      filter: true,
      export: true,
    },
    {
      type: "text",
      name: "nameOfApplicant",
      label: "Name Of Applicant",
      tag: true,
      view: true,
      export: true,
    },
    {
      type: "text",
      name: "examName",
      label: "Exam Name",
      tag: true,
      view: true,
      export: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "exam-center-registration/select",
      placeholder: "Select Exam Center",
      name: "examCenter",
      validation: "",
      showItem: "centerName",
      search: false,
      default: "",
      tag: true,
      label: "Exam Center",
      required: true,
      view: true,
      filter: true,
      export: true,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "Select District",
      name: "district",
      validation: "",
      showItem: "district",
      search: false,
      default: "",
      tag: true,
      label: "District",
      required: true,
      view: true,
      filter: false,
      export: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <div className="p-4  w-full ">
        <div className="flex   w-full  justify-between items-center mb-6">
          <h6 className="text-2xl font-bold">Question Packing List</h6>
          <div className="flex   items-center gap-4">
            <CustomSelect
              options={centers}
              value={examCenter}
              onChange={handleCenterChange}
              placeholder="Select Exam Center"
              selectApi="exam-center-registration/select"
              apiType="API"
              showItem="centerName"
              onSelect={(selected) => {
                handleCenterChange(selected);
              }}
            />
            <button
              onClick={handleDownload}
              disabled={!examCenter || packingData.length === 0 || loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              <Download size={16} />
              {loading ? "Generating..." : "Download"}
            </button>
          </div>
        </div>
        {examCenter && (
          <ListTable
            api={`exam-registration?examCenter=${examCenter}`}
            itemTitle={{ name: "nameOfApplicant", type: "text" }}
            shortName="Question Packing List"
            showTitle={false}
            formMode="double"
            surfaceTheme={"district"}
            {...props}
            attributes={attributes}
          />
        )}
      </div>
    </Container>
  );
};

export default Layout(QuestionPacking);



