import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import { getData } from "../../../../backend/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const ExamRegistration = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Exam Registration - QSC Automation`;
  }, []);

  const [verifyLoading, setVerifyLoading] = useState(false);
  // Tracks the current filter state from the ListTable so the download respects applied filters
  const currentFilterRef = useRef({});

  // Phase 2.4 — Registered students verification PDF.
  // Uses /exam-registration/registered-list which respects district scoping and active filters.
  const downloadVerificationPdf = async () => {
    if (verifyLoading) return;
    setVerifyLoading(true);
    try {
      // Pass current filters so only the visible (filtered) students are exported
      const activeFilter = currentFilterRef.current || {};
      const r = await getData({ ...activeFilter }, "exam-registration/registered-list");
      const rows = r?.data?.response || [];
      if (!rows.length) {
        props.setMessage?.({ type: 1, content: "No registered students to export.", proceed: "Okay" });
        return;
      }

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Build a clean district label from the actual result rows
      const districtSet = new Set(rows.map((r) => r.district).filter(Boolean));
      const districtName = districtSet.size === 1 ? [...districtSet][0] : "All Districts";

      const today = new Date().toLocaleDateString("en-GB");

      doc.setFontSize(14);
      doc.text("Registered Students — Verification Sheet", pageWidth / 2, 30, { align: "center" });
      doc.setFontSize(11);
      doc.text(`${districtName}  |  Total: ${rows.length}  |  Printed: ${today}`, pageWidth / 2, 48, {
        align: "center",
      });

      doc.autoTable({
        startY: 60,
        head: [["Sl", "Reg No", "Name", "Mobile", "Study Centre", "Area", "P/R", "Exam Centre", "Exam"]],
        body: rows.map((r) => [
          r.sl,
          r.regno,
          r.name,
          r.mobile,
          r.studyCentre || "-",
          r.area || "-",
          r.status ? r.status.charAt(0).toUpperCase() : "-",
          r.examCentre || "-",
          r.examType || "-",
        ]),
        styles: { fontSize: 8, cellPadding: 3, lineColor: 0, lineWidth: 0.2, textColor: 0 },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
        theme: "grid",
        columnStyles: {
          0: { halign: "center", cellWidth: 26 },
          1: { cellWidth: 70 },
          6: { halign: "center", cellWidth: 24 },
        },
        didDrawPage: (d) => {
          doc.setFontSize(9);
          doc.text(`Page ${d.pageNumber}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 12, {
            align: "right",
          });
        },
      });

      // Per-exam-type summary at the end.
      const byExam = rows.reduce((acc, r) => {
        const k = r.examType || "Unknown";
        acc[k] = acc[k] || { total: 0, male: 0, female: 0, private: 0, regular: 0 };
        acc[k].total += 1;
        if (r.gender === "Male") acc[k].male += 1;
        if (r.gender === "Female") acc[k].female += 1;
        if (r.status === "Private") acc[k].private += 1;
        if (r.status === "Regular") acc[k].regular += 1;
        return acc;
      }, {});
      const entries = Object.entries(byExam).sort((a, b) => a[0].localeCompare(b[0]));
      const totals = entries.reduce(
        (acc, [, v]) => ({
          total: acc.total + v.total,
          male: acc.male + v.male,
          female: acc.female + v.female,
          private: acc.private + v.private,
          regular: acc.regular + v.regular,
        }),
        { total: 0, male: 0, female: 0, private: 0, regular: 0 }
      );

      doc.addPage("landscape");
      doc.setFontSize(14);
      doc.text("Summary by Exam Type", pageWidth / 2, 30, { align: "center" });
      doc.autoTable({
        startY: 50,
        head: [["Exam Type", "Total", "Male", "Female", "Private", "Regular"]],
        body: [
          ...entries.map(([k, v]) => [k, v.total, v.male, v.female, v.private, v.regular]),
          ["Total", totals.total, totals.male, totals.female, totals.private, totals.regular],
        ],
        styles: { fontSize: 10, cellPadding: 4, lineColor: 0, lineWidth: 0.2 },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
        theme: "grid",
        columnStyles: { 1: { halign: "center" }, 2: { halign: "center" }, 3: { halign: "center" }, 4: { halign: "center" }, 5: { halign: "center" } },
      });

      const filename = `Registered-Students-${districtName.replace(/\s+/g, "-")}-${today.replace(/\//g, "-")}.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error(e);
      props.setMessage?.({
        type: 1,
        content: e?.response?.data?.message || e.message || "Failed to generate verification PDF.",
        proceed: "Okay",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const additionalButtons = [
    {
      label: verifyLoading ? "Generating..." : "Verification PDF",
      icon: "print",
      onClick: downloadVerificationPdf,
    },
  ];

  const [attributes] = useState([
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
      validation: "",
      default: "",
      label: "Mobile Number",
      tag: true,
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "number",
      placeholder: "Whatsapp Number",
      name: "whatsappNumber",
      validation: "",
      default: "",
      label: "Whatsapp Number",
      tag: false,
      required: true,
      add: true,
      view: true,
      update: true,
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
      type: "textarea",
      placeholder: "Qualification in Islamic Education",
      name: "religiousEducationalQualification",
      validation: "",
      default: "",
      label: "Qualification in Islamic Education",
      tag: false,
      required: false,
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
      export: true,
      customClass: "full",
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
      customClass: "full",
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
    },
    {
      type: "info",
      content: "ഖുർആൻ സ്റ്റഡി സെന്റർ കേരളയിൽ അഫിലിയേറ്റ് ചെയ്തിട്ടുള്ള പ്രാദേശിക സെന്ററുകളിൽ പഠിക്കുന്നവർ Regular വിഭാഗത്തിലും അല്ലാത്തവർ Private വിഭാഗത്തിലും ഉൾപ്പെടുന്നു.",
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
      customClass: "full",
      tag: true,
      label: "Mode of Study",
      showItem: "",
      required: true,
      view: true,
      filter: true,
      add: true,
      update: true,
      apiType: "CSV",
      selectApi: "Private,Regular",
    },
    {
      type: "info",
      content: "റെഗുലർ സെന്ററുകളിൽ പഠിക്കുന്നവർ തങ്ങളുടെ സ്റ്റഡി സെന്റർ തന്നെയാണ് പരീക്ഷ കേന്ദ്രമായി തെരഞ്ഞെടുക്കേണ്ടത്.",
      add: true,
      update: true,
      customClass: "full",
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
      content: "നിങ്ങളുടെ ഏറ്റവും അടുത്തുള്ള സ്റ്റഡി സെന്റർ പരീക്ഷ കേന്ദ്രമായി തിരഞ്ഞെടുക്കുക.",
      add: true,
      update: true,
      customClass: "full",
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
      placeholder: "Exam Center",
      customClass: "full",
      updateOn: "area",
      name: "centerRegistration",
      validation: "",
      showItem: "nameOfCenter",
      default: "",
      tag: false,
      label: "Exam Center",
      required: true,
      view: true,
      add: true,
      update: true,
      filter: true,
      search: false,
      export: true,
    },
    
    {
      type: "title",
      title: "Payment Information",
      add: true,
      export: false,
    },
    {
      type: "info",
      content: "Regular വിഭാഗത്തിന് 100 രൂപയും Private വിഭാഗത്തിന് 150 രൂപയുമാണ് രജിസ്ട്രേഷൻ ഫീസ്. തുക 7994162608 നമ്പറിൽ ഗൂഗിൾ പേ ചെയ്യുക. ഏത് നമ്പറിൽ നിന്നാണോ ഗൂഗിൾ പേ ചെയ്തത്, ആ നമ്പർ ഇവിടെ നൽകുക.",
      add: true,
      update: true,
      export: false,
    },
    {
      type: "number",
      placeholder: "Gpay Number",
      name: "feeDetails",
      validation: "",
      default: "",
      info: "Regular വിഭാഗത്തിന് 100 രൂപയും Private വിഭാഗത്തിന് 150 രൂപയുമാണ് രജിസ്ട്രേഷൻ ഫീസ്. തുക 7994162608 നമ്പറിൽ ഗൂഗിൾ പേ ചെയ്യുക. ഏത് നമ്പറിൽ നിന്നാണോ ഗൂഗിൾ പേ ചെയ്തത്, ആ നമ്പർ ഇവിടെ നൽകുക.",
      label: "Gpay Number",
      required: true,
      add: true,
      update: true,
      view: true,
      export: true,
    },
    {
      type: "text",
      placeholder: "Register Number",
      name: "regno",
      validation: "",
      default: "",
      label: "Register Number",
      required: false,
      add: false,
      update: true,
      view: true,
      export: true,
      search: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`exam-registration`}
        itemTitle={{ name: "nameOfApplicant", type: "text", collection: "" }}
        shortName={`Exam Registration`}
        showTitle={false}
        formMode={`single`}
        surfaceTheme={"district"}
        labels={[
          {
            key: "Male Students",
            title: "MALE STUDENTS",
            icon: "male",
            backgroundColor: "rgba(0, 200, 81, 0.15)", // Light green
            color: "#006B27", // Dark green
          },
          {
            key: "Female Students",
            title: "FEMALE STUDENTS",
            icon: "female",
            backgroundColor: "rgba(0, 122, 255, 0.15)", // Light blue
            color: "#004999", // Dark blue
          },
          {
            key: "Total Students",
            title: "TOTAL STUDENTS",
            icon: "total-center",
            backgroundColor: "rgba(88, 86, 214, 0.15)", // Light purple
            color: "#2B2A69", // Dark purple
          },
        ]}
        onFilterChange={(filter) => {
          currentFilterRef.current = filter;
        }}
        {...props}
        attributes={attributes}
        additionalButtons={additionalButtons}
      ></ListTable>
    </Container>
  );
};

export default Layout(ExamRegistration);
