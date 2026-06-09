import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import { getData, patchJson, postJson } from "../../../../backend/api";
import { Document, Page, Text, View, StyleSheet, pdf, PDFViewer } from "@react-pdf/renderer";
import { ArrowRight, Building2, Download, MapPinned, Printer, RefreshCcw, Users, X } from "lucide-react";
import {
  ActionButton,
  BulkBody,
  BulkMetaRow,
  BulkTable,
  BulkTableWrap,
  CloseButton,
  DistrictContextBanner,
  DistrictOverviewCards,
  DistrictPageHeader,
  EmptyRow,
  Field,
  GridForm,
  ModalBackdrop,
  ModalCard,
  ModalFooter,
  ModalHeader,
  PageWrap,
  PdfBody,
} from "../shared/districtSurface";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file

const onChange1 = (nameOfCenter, updateValue) => {
  const { studentsCountMale, studentsCountFemale, centerType } = updateValue;
  const male = parseFloat(studentsCountMale) || 0;
  const female = parseFloat(studentsCountFemale) || 0;
  const total = centerType === "Mixed" ? male + female : 0;
  updateValue["studentsCountTotal"] = total.toFixed(0);
  return updateValue;
};

const CenterRegistration = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const linkedDistrictId = useMemo(() => new URLSearchParams(location.search).get("district") || "", [location.search]);
  const linkedDistrictName = useMemo(() => new URLSearchParams(location.search).get("districtName") || "", [location.search]);
  const linkedAreaId = useMemo(() => new URLSearchParams(location.search).get("area") || "", [location.search]);
  const linkedAreaName = useMemo(() => new URLSearchParams(location.search).get("areaName") || "", [location.search]);
  const activePreFilter = useMemo(
    () => ({
      ...(linkedDistrictId ? { district: linkedDistrictId } : {}),
      ...(linkedAreaId ? { area: linkedAreaId } : {}),
    }),
    [linkedDistrictId, linkedAreaId]
  );

  // Page-level export PDF controls (do not modify core)
  const [exporting, setExporting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfRows, setPdfRows] = useState([]);
  // Bulk-reassign district UI state
  const [showBulk, setShowBulk] = useState(false);
  const [bulkSourceDistrict, setBulkSourceDistrict] = useState("");
  const [bulkTargetDistrict, setBulkTargetDistrict] = useState("");
  const [bulkCenters, setBulkCenters] = useState([]); // centers in source district
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkSearch, setBulkSearch] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  // Use the same key convention as core list to read currently filtered data
  // Core list stores data under key: `${api}-${name + '-' + referenceId}`
  // Here we didn't pass `name`, so default name is "" and referenceId is 0 => key becomes `center-registration--0`
  const pageStore = useSelector((state) => state.pages?.["center-registration--0"]);
  const getCountValue = (key) => Number(pageStore?.counts?.[key]?.count || 0);
  const activeFilterLabel = linkedAreaName || linkedDistrictName || "All Districts";
  const overviewCards = useMemo(
    () => [
      {
        key: "centres",
        label: linkedDistrictId || linkedAreaId ? "Filtered Centres" : "All Centres",
        value: getCountValue("Total Centers") || Number(pageStore?.filterCount || 0),
        meta: linkedAreaName ? `${linkedAreaName} in ${linkedDistrictName || "selected district"}` : linkedDistrictName || "Across all districts",
        icon: <Building2 size={16} />,
      },
      {
        key: "students",
        label: "Total Students",
        value: getCountValue("Total Students"),
        meta: `${getCountValue("Male Students")} male • ${getCountValue("Female Students")} female`,
        icon: <Users size={16} />,
      },
      {
        key: "male",
        label: "Male Centres",
        value: getCountValue("Male Centers"),
        meta: "Male-only study centres",
        icon: <ArrowRight size={16} />,
      },
      {
        key: "female",
        label: "Female Centres",
        value: getCountValue("Female Centers"),
        meta: "Female-only study centres",
        icon: <ArrowRight size={16} />,
      },
      {
        key: "mixed",
        label: "Mixed Centres",
        value: getCountValue("Mixed Centers"),
        meta: `Current scope: ${activeFilterLabel}`,
        icon: <MapPinned size={16} />,
      },
      {
        key: "male-students",
        label: "Total Male Students",
        value: getCountValue("Male Students"),
        meta: "Male students across all centres",
        icon: <Users size={16} />,
      },
      {
        key: "female-students",
        label: "Total Female Students",
        value: getCountValue("Female Students"),
        meta: "Female students across all centres",
        icon: <Users size={16} />,
      },
    ],
    [activeFilterLabel, linkedAreaId, linkedAreaName, linkedDistrictId, linkedDistrictName, pageStore]
  );

  useEffect(() => {
    // Load districts for export filter
    (async () => {
      try {
        const res = await getData({}, "district/select");
        setDistricts(res?.data?.response || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const pdfStyles = useMemo(
    () =>
      StyleSheet.create({
        page: { flexDirection: "column", backgroundColor: "#fff", padding: 12 },
        title: { fontSize: 14, textAlign: "center", marginBottom: 8 },
        table: { display: "table", width: "100%", borderStyle: "solid", borderColor: "#bfbfbf", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
        tr: { flexDirection: "row", borderWidth: 1, borderColor: "#bfbfbf", borderTopWidth: 0 },
        th: { padding: 4, fontSize: 10, fontWeight: "bold", textAlign: "left", borderRightWidth: 1, borderRightColor: "#bfbfbf" },
        td: { padding: 4, fontSize: 9, textAlign: "left", borderRightWidth: 1, borderRightColor: "#bfbfbf" },
        thSl: { padding: 4, fontSize: 10, fontWeight: "bold", textAlign: "left", width: 26, flexGrow: 0, flexShrink: 0, borderRightWidth: 1, borderRightColor: "#bfbfbf" },
        tdSl: { padding: 4, fontSize: 9, textAlign: "left", width: 26, flexGrow: 0, flexShrink: 0, borderRightWidth: 1, borderRightColor: "#bfbfbf" },
        thWName: { width: 120, flexGrow: 0, flexShrink: 0 },
        thWAff: { width: 70, flexGrow: 0, flexShrink: 0 },
        thWType: { width: 50, flexGrow: 0, flexShrink: 0 },
        thWArea: { width: 70, flexGrow: 0, flexShrink: 0 },
        thWHalqa: { width: 90, flexGrow: 0, flexShrink: 0 },
        thWMale: { width: 40, flexGrow: 0, flexShrink: 0 },
        thWFemale: { width: 50, flexGrow: 0, flexShrink: 0 },
        thWTotal: { width: 50, flexGrow: 0, flexShrink: 0 },
      }),
    []
  );

  const buildPdfDoc = (rows = [], title = "Centre Affiliation") => (
    <Document author="Tecnocorp Solutions" subject={title} title={title}>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{`Print Page : ${title}`}</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tr}>
            <View style={pdfStyles.thSl}>
              <Text>Sl No</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWName]}>
              <Text>Name of Centre</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWAff]}>
              <Text>Affiliation number</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWType]}>
              <Text>Centre Type</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWArea]}>
              <Text>Area</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWHalqa]}>
              <Text>Halqa</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWMale]}>
              <Text>Male</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWFemale]}>
              <Text>Female</Text>
            </View>
            <View style={[pdfStyles.th, pdfStyles.thWTotal]}>
              <Text>Total</Text>
            </View>
          </View>
          {rows.map((r, idx) => (
            <View style={pdfStyles.tr} key={`row-${r._id || idx}`}>
              <View style={pdfStyles.tdSl}>
                <Text>{String(idx + 1)}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWName]}>
                <Text>{r?.nameOfCenter || ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWAff]}>
                <Text>{r?.affiliationNo || ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWType]}>
                <Text>{r?.centerType || ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWArea]}>
                <Text>{r?.area?.area || ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWHalqa]}>
                <Text>{r?.halqaName || ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWMale]}>
                <Text>{r?.studentsCountMale ?? ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWFemale]}>
                <Text>{r?.studentsCountFemale ?? ""}</Text>
              </View>
              <View style={[pdfStyles.td, pdfStyles.thWTotal]}>
                <Text>{r?.studentsCountTotal ?? ""}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const onOpenPdfModal = async () => {
    try {
      setExporting(true);
      props.setLoaderBox?.(true);
      // Prefer current filtered/paged rows from store (matches UI filters)
      const rowsFromStore = pageStore?.response || [];
      if (rowsFromStore.length > 0) {
        // Derive current filters from visible rows
        const first = rowsFromStore[0] || {};
        const districtId = first?.district?._id || undefined;
        // Only include area if all visible rows share the same area (i.e., area is actually filtered)
        const uniqueAreaIds = Array.from(new Set(rowsFromStore.map((r) => r?.area?._id).filter(Boolean)));
        const areaId = uniqueAreaIds.length === 1 ? uniqueAreaIds[0] : undefined;
        // If no district in visible data or multiple districts present, require selection
        const uniqueDistricts = Array.from(new Set(rowsFromStore.map((r) => r?.district?._id).filter(Boolean)));
        if (!districtId || uniqueDistricts.length !== 1) {
          props.setMessage?.({ type: 1, content: "Please select a district." });
          return;
        }
        // Determine centerType only if all rows share same value
        const uniqueTypes = Array.from(new Set(rowsFromStore.map((r) => r?.centerType).filter(Boolean)));
        const centerType = uniqueTypes.length === 1 ? uniqueTypes[0] : undefined;
        const query = {
          ...(districtId ? { district: districtId } : {}),
          ...(areaId ? { area: areaId } : {}),
          ...(centerType ? { centerType } : {}),
          skip: 0,
          limit: 0,
        };
        const res = await getData(query, "center-registration");
        const rows = res?.data?.response || rowsFromStore;
        // Sort by area name
        const sortedRows = [...rows].sort((a, b) => {
          const areaA = a?.area?.area || "";
          const areaB = b?.area?.area || "";
          return areaA.localeCompare(areaB);
        });
        setPdfRows(sortedRows);
      } else {
        // No visible data; require selecting a district first
        props.setMessage?.({ type: 1, content: "Please select a district." });
        return;
      }
      setShowPdf(true);
    } catch (e) {
      props.setMessage?.({ type: 1, content: "Failed to load PDF preview." });
    } finally {
      props.setLoaderBox?.(false);
      setExporting(false);
    }
  };
  //to update the page title
  useEffect(() => {
    document.title = "Centre Affiliation - QSC Automation";
  }, []);

  const [attributes] = useState([
    {
      type: "title",
      title: "Center Details",
      add: true,
      print: false,
    },
    {
      type: "number",
      placeholder: "Sl No",
      name: "slNo",
      validation: "",
      default: "",
      label: "Sl No",
      required: true,
      add: false,
      update: false,
      view: true,
      print: true,
    },
    {
      type: "text",
      placeholder: "Name Of Center",
      name: "nameOfCenter",
      validation: "",
      default: "",
      tag: true,
      label: "Name Of Center",
      required: true,
      add: true,
      update: true,
      view: true,
    },
    {
      type: "text",
      placeholder: "Affiliation No",
      name: "affiliationNo",
      validation: "",
      default: "",
      label: "Affiliation No",
      add: false,
      view: true,
      tag: true,
      update: true,
      search: true,
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
      tag: true,
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
      // Ensure core print resolves nested object value correctly
      collection: "district",
      showItem: "district",
      validation: "",
      default: "",
      tag: true,
      label: "District",
      required: true,
      view: true,
      add: true,
      update: true,
      search: true,
      filter: true,
      export: true,
      print: false,
    },
    {
      type: "select",
      apiType: "API",
      selectApi: "area/get-area-by-district",
      placeholder: "Area",
      updateOn: "district",
      name: "area",
      validation: "",
      // Ensure core print resolves nested object value correctly
      collection: "area",
      showItem: "area",
      default: "",
      tag: true,
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
      update: true,
    },
    {
      type: "title",
      title: "Students Details",
      add: true,
      print: false,
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
      customClass: "half",
      update: true,
      tag: true,
      view: true,
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
      customClass: "half",
      update: true,
      tag: true,
      view: true,
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
      tag: true,
      view: true,
    },
    // {
    //   type: "title",
    //   title: "Co Ordinator Details",
    //   add: true,
    //   print: false,
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
    //   update: true,
    //   view: true,
    //   print: false,
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
    //   update: true,
    //   view: true,
    //   print: false,
    // },
  ]);

  const [actions] = useState([
    {
      element: "button",
      type: "callback",
      callback: (item, data, refreshView) => {
        // Set the data for the clicked item and open the SetupMenu popup
        console.log(data);
        // setUserId(data._id)
        getApproved(data._id, refreshView);
      },
      icon: "center-registration",
      title: "Download Application Certificate",
      params: {
        api: ``,
        parentReference: "",
        itemTitle: {
          name: "user",
          type: "text",
          collection: "",
        },
        shortName: "Download Affiliation",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "medium",
      },
      actionType: "button",
    },
  ]);

  const loadBulkCenters = async (districtId) => {
    if (!districtId) {
      setBulkCenters([]);
      return;
    }
    setBulkLoading(true);
    try {
      const res = await getData({ district: districtId, skip: 0, limit: 0 }, "center-registration");
      const rows = (res?.data?.response || []).sort((a, b) => (a?.area?.area || "").localeCompare(b?.area?.area || ""));
      setBulkCenters(rows);
      setBulkSelected(new Set());
    } catch (e) {
      props.setMessage?.({ type: 1, content: "Failed to load centers." });
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleBulkSelected = (id) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submitBulkReassign = async () => {
    if (!bulkTargetDistrict || bulkSelected.size === 0) {
      props.setMessage?.({ type: 1, content: "Select target district and at least one centre." });
      return;
    }
    setBulkLoading(true);
    try {
      const res = await patchJson(
        { ids: Array.from(bulkSelected), district: bulkTargetDistrict },
        "center-registration/bulk-district"
      );
      if (res?.data?.success) {
        props.setMessage?.({ type: 2, content: `Reassigned ${res.data.modifiedCount} centre(s).`, proceed: "Okay" });
        setShowBulk(false);
        setBulkCenters([]);
        setBulkSelected(new Set());
        setBulkSourceDistrict("");
        setBulkTargetDistrict("");
        setLastUpdatedDate(new Date().toISOString());
      } else {
        props.setMessage?.({ type: 1, content: res?.data?.message || "Bulk reassign failed." });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: "Bulk reassign failed." });
    } finally {
      setBulkLoading(false);
    }
  };

  const syncFromAreas = async () => {
    setBulkLoading(true);
    try {
      const res = await postJson({}, `center-registration/sync-district-from-area${bulkSourceDistrict ? `?district=${bulkSourceDistrict}` : ""}`);
      if (res?.data?.success) {
        props.setMessage?.({ type: 2, content: res.data.message, proceed: "Okay" });
        if (bulkSourceDistrict) await loadBulkCenters(bulkSourceDistrict);
        setLastUpdatedDate(new Date().toISOString());
      } else {
        props.setMessage?.({ type: 1, content: res?.data?.message || "Sync failed." });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: "Sync failed." });
    } finally {
      setBulkLoading(false);
    }
  };

  const getApproved = (id, refreshView) => {
    props.setLoaderBox(true);
    getData({ id }, "center-registration/download-affiliation")
      .then((response) => {
        console.log(response.data.url);
        props.setLoaderBox(false);
        console.log(response);
        if (response.data) {
          props.setMessage({ content: response.data.message });
          window.open(import.meta.env.VITE_APP_CDN + response.data.url, "_blank");
          refreshView();
        } else {
          // Handle the case where response.data is undefined
          console.error("Response data is undefined.");
        }
      })
      .catch((error) => {
        props.setLoaderBox(false);
        // Handle any errors that occur during the API request
        console.error("API request error:", error);
      });
  };

  return (
    <Container className="noshadow">
      <PageWrap>
        <DistrictPageHeader
          title="Centre Affiliation"
          description="Manage study centres, certificates, bulk district changes, and filter-scoped views from one district-style workspace."
          actions={
            <>
            <ActionButton className="secondary" onClick={onOpenPdfModal} disabled={exporting}>
              <Printer size={16} />
              <span>{exporting ? "Loading..." : "Preview PDF"}</span>
            </ActionButton>
            <ActionButton className="ghost" onClick={() => setShowBulk(true)}>
              <RefreshCcw size={16} />
              <span>Bulk Reassign District</span>
            </ActionButton>
            {(linkedDistrictId || linkedAreaId) && (
              <ActionButton className="ghost" onClick={() => navigate("/center-registration")}>
                <span>Clear Filter</span>
              </ActionButton>
            )}
            </>
          }
        />

        <DistrictOverviewCards cards={overviewCards} />

        {(linkedDistrictId || linkedAreaId) && (
          <DistrictContextBanner
            action={
              <ActionButton className="ghost" onClick={() => navigate("/center-registration")}>
                Reset to full list
              </ActionButton>
            }
          >
              Showing study centres for <strong>{linkedAreaName || linkedDistrictName || "selected filter"}</strong>
              {linkedAreaName && linkedDistrictName ? ` in ${linkedDistrictName}` : ""}.
              <span>The overview and table below are recalculated from this active filter.</span>
          </DistrictContextBanner>
        )}

      {showPdf && (
        <ModalBackdrop onClick={() => setShowPdf(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()} style={{ width: "min(100%, 1100px)", minHeight: "85dvh", overflow: "hidden" }}>
            <ModalHeader>
              <div>
                <h3>Centre Affiliation PDF Preview</h3>
                <p>Print the currently selected district scope using the same filtered data shown in the admin table.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ActionButton
                  className="secondary"
                  onClick={async () => {
                    const districtName = pdfRows[0]?.district?.district || "centre-affiliation";
                    const safeName = districtName.replace(/[^a-zA-Z0-9\u0D00-\u0D7F\s-]/g, "").trim().replace(/\s+/g, "-");
                    const blob = await pdf(buildPdfDoc(pdfRows, "Centre Affiliation")).toBlob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${safeName}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </ActionButton>
                <CloseButton aria-label="Close" onClick={() => setShowPdf(false)}>
                  <X size={16} />
                </CloseButton>
              </div>
            </ModalHeader>
            <PdfBody>
              <PDFViewer style={{ width: "100%", flex: 1, minHeight: 0 }}>{buildPdfDoc(pdfRows, "Centre Affiliation")}</PDFViewer>
            </PdfBody>
          </ModalCard>
        </ModalBackdrop>
      )}
      {showBulk && (
        <ModalBackdrop onClick={() => setShowBulk(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()} style={{ width: "min(100%, 900px)", minHeight: "85dvh", overflow: "hidden" }}>
            <ModalHeader>
              <div>
                <h3>Bulk Reassign District</h3>
                <p>Move filtered centres between districts or sync each centre with the district configured on its area.</p>
              </div>
              <CloseButton aria-label="Close" onClick={() => setShowBulk(false)}>
                <X size={16} />
              </CloseButton>
            </ModalHeader>
            <BulkBody>
              <GridForm>
                <Field>
                  <span>Source District</span>
                  <select
                    value={bulkSourceDistrict}
                    onChange={(e) => {
                      setBulkSourceDistrict(e.target.value);
                      loadBulkCenters(e.target.value);
                    }}
                  >
                    <option value="">Select...</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.value}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <span>Target District</span>
                  <select value={bulkTargetDistrict} onChange={(e) => setBulkTargetDistrict(e.target.value)}>
                    <option value="">Select...</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.value}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <span>Search Centres</span>
                  <input value={bulkSearch} onChange={(e) => setBulkSearch(e.target.value)} placeholder="Filter by centre or area name" />
                </Field>
              </GridForm>

              <BulkMetaRow>
                <ActionButton
                  type="button"
                  className="ghost"
                  disabled={bulkLoading || bulkCenters.length === 0}
                  onClick={() => {
                    const filtered = bulkCenters.filter((c) => {
                      const hay = `${c.nameOfCenter || ""} ${c?.area?.area || ""}`.toLowerCase();
                      return !bulkSearch || hay.includes(bulkSearch.toLowerCase());
                    });
                    if (bulkSelected.size === filtered.length) setBulkSelected(new Set());
                    else setBulkSelected(new Set(filtered.map((c) => c._id)));
                  }}
                >
                  Toggle Visible
                </ActionButton>
                <span>{bulkSelected.size}</span>
                <div>selected out of {bulkCenters.length}</div>
                <ActionButton type="button" className="secondary" disabled={bulkLoading} onClick={syncFromAreas}>
                  Sync District From Area
                </ActionButton>
              </BulkMetaRow>

              <BulkTableWrap>
                <BulkTable>
                  <thead>
                    <tr>
                      <th style={{ width: 52 }}></th>
                      <th>Centre</th>
                      <th>Area</th>
                      <th>Affiliation No</th>
                      <th>Current District</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkCenters
                      .filter((c) => {
                        const hay = `${c.nameOfCenter || ""} ${c?.area?.area || ""}`.toLowerCase();
                        return !bulkSearch || hay.includes(bulkSearch.toLowerCase());
                      })
                      .map((c) => (
                        <tr key={c._id}>
                          <td>
                            <input type="checkbox" checked={bulkSelected.has(c._id)} onChange={() => toggleBulkSelected(c._id)} />
                          </td>
                          <td>{c.nameOfCenter}</td>
                          <td>{c?.area?.area || "-"}</td>
                          <td>{c.affiliationNo || "-"}</td>
                          <td>{c?.district?.district || "-"}</td>
                        </tr>
                      ))}
                    {bulkCenters.length === 0 && <tr><EmptyRow colSpan={5}>{bulkLoading ? "Loading..." : "Select a source district to view centres"}</EmptyRow></tr>}
                  </tbody>
                </BulkTable>
              </BulkTableWrap>
            </BulkBody>
            <ModalFooter>
              <ActionButton className="ghost" onClick={() => setShowBulk(false)}>
                Cancel
              </ActionButton>
              <ActionButton className="primary" disabled={bulkLoading || !bulkTargetDistrict || bulkSelected.size === 0} onClick={submitBulkReassign}>
                Reassign {bulkSelected.size} Centre(s)
              </ActionButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
      <ListTable
        key={`center-registration-${linkedDistrictId || "all"}-${linkedAreaId || "all"}`}
        actions={actions}
        api={"center-registration"}
        itemTitle={{ name: "nameOfCenter", type: "text", collection: "" }}
        showTitle={false}
        shortName={"Centre Affiliation"}
        exportPrivilege={true}
        additionalButtons={[]}
        formMode={"single"}
        preFilter={activePreFilter}
        labels={[]}
        surfaceTheme={"district"}
        lastUpdateDate={lastUpdatedDate}
        {...props}
        attributes={attributes}
      ></ListTable>
      </PageWrap>
    </Container>
  );
};

export default Layout(CenterRegistration);
