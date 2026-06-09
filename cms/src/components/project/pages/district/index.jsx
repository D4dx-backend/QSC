import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { ArrowRight, Building2, MapPinned, PencilLine, Plus, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, postData, putData } from "../../../../backend/api";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";

const emptyStats = {
  studyCenterCount: 0,
  maleCenterCount: 0,
  femaleCenterCount: 0,
  mixedCenterCount: 0,
  maleStudentCount: 0,
  femaleStudentCount: 0,
  totalStudents: 0,
};

const createEmptyStats = () => ({ ...emptyStats });

const toNumber = (value) => Number.parseInt(value || 0, 10) || 0;

const normalizeObjectId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const applyCenterToStats = (stats, center) => {
  const maleStudents = toNumber(center.studentsCountMale);
  const femaleStudents = toNumber(center.studentsCountFemale);

  stats.studyCenterCount += 1;
  if (center.centerType === "Male") stats.maleCenterCount += 1;
  if (center.centerType === "Female") stats.femaleCenterCount += 1;
  if (center.centerType === "Mixed") stats.mixedCenterCount += 1;
  stats.maleStudentCount += maleStudents;
  stats.femaleStudentCount += femaleStudents;
  stats.totalStudents += maleStudents + femaleStudents;

  return stats;
};

const buildCenterSummary = (centers = []) => centers.reduce((acc, center) => applyCenterToStats(acc, center), createEmptyStats());

const buildAreaSummaries = (areas = [], centers = []) => {
  const areaMap = new Map();

  areas.forEach((area) => {
    const areaId = normalizeObjectId(area);
    areaMap.set(areaId, {
      _id: area._id,
      area: area.area || "Unnamed Area",
      district: area.district,
      ...createEmptyStats(),
    });
  });

  centers.forEach((center) => {
    const areaId = normalizeObjectId(center.area);
    if (!areaId) return;

    const areaName = typeof center.area === "object" ? center.area?.area : "";
    const current =
      areaMap.get(areaId) ||
      {
        _id: areaId,
        area: areaName || "Unnamed Area",
        district: center.district,
        ...createEmptyStats(),
      };

    applyCenterToStats(current, center);
    areaMap.set(areaId, current);
  });

  return Array.from(areaMap.values()).sort((left, right) => String(left.area || "").localeCompare(String(right.area || "")));
};

const DETAIL_PAGE_SIZE = 10;

const areaSortOptions = [
  { value: "area:asc", label: "Area A-Z" },
  { value: "area:desc", label: "Area Z-A" },
  { value: "studyCenterCount:desc", label: "Most Centres" },
  { value: "totalStudents:desc", label: "Most Students" },
];

const centerSortOptions = [
  { value: "nameOfCenter:asc", label: "Centre A-Z" },
  { value: "nameOfCenter:desc", label: "Centre Z-A" },
  { value: "centerType:asc", label: "Centre Type" },
  { value: "affiliationNo:asc", label: "Affiliation No" },
  { value: "centerCode:asc", label: "Center Code" },
  { value: "_id:desc", label: "Newest First" },
];

const parseSortValue = (value, fallbackBy, fallbackOrder = "asc") => {
  const [sortBy = fallbackBy, sortOrder = fallbackOrder] = String(value || "").split(":");
  return {
    sortBy,
    sortOrder: sortOrder === "desc" ? "desc" : "asc",
  };
};

const buildCenterSummaryFromCounts = (counts = {}) => ({
  studyCenterCount: Number(counts?.["Total Centers"]?.count || 0),
  maleCenterCount: Number(counts?.["Male Centers"]?.count || 0),
  femaleCenterCount: Number(counts?.["Female Centers"]?.count || 0),
  mixedCenterCount: Number(counts?.["Mixed Centers"]?.count || 0),
  maleStudentCount: Number(counts?.["Male Students"]?.count || 0),
  femaleStudentCount: Number(counts?.["Female Students"]?.count || 0),
  totalStudents: Number(counts?.["Total Students"]?.count || 0),
});

const escapeCsvCell = (value) => {
  const safeValue = value ?? "";
  const stringValue = String(safeValue).replace(/"/g, '""');
  return `"${stringValue}"`;
};

const downloadCsvFile = (fileName, rows = []) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const PageWrap = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderCopy = styled.div`
  h2 {
    margin: 0;
    color: #142749;
    font-size: 24px;
    line-height: 1.1;
  }

  p {
    margin: 6px 0 0;
    color: #6b7d9e;
    font-size: 14px;
    line-height: 1.45;
  }
`;

const ActionButton = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 10px 14px;
  min-height: 42px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  &.primary {
    background: #1a4993;
    color: #fff;
    box-shadow: 0 10px 18px rgba(26, 73, 147, 0.18);
  }

  &.secondary {
    background: #eef4ff;
    color: #1a4993;
  }

  &.ghost {
    background: #fff;
    color: #4f6488;
    border: 1px solid #dbe3f1;
  }

  &.danger {
    background: #fff5f4;
    color: #b42318;
    border: 1px solid #f3c3bc;
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  background: #fff;
  border: 1px solid #e6ebf3;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OverviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #607292;
  font-size: 12px;
  font-weight: 600;
`;

const OverviewValue = styled.div`
  color: #142749;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
`;

const OverviewMeta = styled.div`
  color: #6d7f9e;
  font-size: 12px;
  line-height: 1.45;
`;

const TableWrap = styled.div`
  background: #fff;
  border: 1px solid #e6ebf3;
  border-radius: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1.1fr) minmax(160px, 0.95fr) minmax(220px, 1.2fr) minmax(220px, 1.2fr) minmax(200px, 0.95fr);
  min-width: 960px;
  gap: 12px;
  padding: 14px 16px;
  background: #f8faff;
  border-bottom: 1px solid #e6ebf3;
  color: #607292;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  @media (max-width: 1160px) {
    display: none;
  }
`;

const DistrictRow = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1.1fr) minmax(160px, 0.95fr) minmax(220px, 1.2fr) minmax(220px, 1.2fr) minmax(200px, 0.95fr);
  min-width: 960px;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f8;
  align-items: start;

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 1160px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: #fbfcff;
`;

const CellTitle = styled.div`
  display: none;
  color: #6d7f9e;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  @media (max-width: 1160px) {
    display: block;
  }
`;

const DistrictName = styled.div`
  color: #102447;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
`;

const DistrictMetaText = styled.div`
  color: #7082a2;
  font-size: 12px;
  line-height: 1.45;
  word-break: break-word;
`;

const BadgeWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  background: #f4f7fc;
  color: #49607f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
`;

const InteractiveBadge = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  background: #f4f7fc;
  color: #49607f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;

  &:hover {
    background: #e9f1ff;
    color: #1a4993;
    transform: translateY(-1px);
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const MetricBox = styled.div`
  border-radius: 14px;
  background: #f1f6ff;
  padding: 10px 12px;
  min-width: 0;
`;

const MetricLabel = styled.div`
  color: #6c7e9d;
  font-size: 11px;
  margin-bottom: 4px;
  line-height: 1.35;
`;

const MetricValue = styled.div`
  color: #13284a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1160px) {
    button {
      flex: 1 1 160px;
    }
  }

  @media (max-width: 520px) {
    button {
      width: 100%;
    }
  }
`;

const WarningBox = styled.div`
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
  font-size: 12px;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 4px;
  }
`;

const EmptyState = styled.div`
  background: #fff;
  border: 1px dashed #d4ddeb;
  border-radius: 16px;
  padding: 28px 18px;
  text-align: center;
  color: #6d7f9e;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 18, 40, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ModalCard = styled.div`
  width: min(100%, 480px);
  max-height: calc(100dvh - 32px);
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e6ebf3;
  padding: 18px;
  box-shadow: 0 22px 60px rgba(11, 24, 52, 0.18);
  overflow-y: auto;

  @media (max-width: 768px) {
    max-height: calc(100dvh - 24px);
  }
`;

const ModalTitle = styled.div`
  margin-bottom: 14px;

  h3 {
    margin: 0;
    font-size: 20px;
    color: #13284a;
  }

  p {
    margin: 6px 0 0;
    color: #6b7d9e;
    font-size: 13px;
    line-height: 1.5;
  }
`;

const FormGrid = styled.form`
  display: grid;
  gap: 14px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #4d607f;
  font-size: 13px;
  font-weight: 600;

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid #d9e2ef;
    background: #f9fbff;
    border-radius: 12px;
    padding: 11px 13px;
    color: #142749;
    font-size: 15px;
    outline: 0;
    font-family: inherit;
  }

  input {
    min-height: 44px;
  }

  textarea {
    min-height: 110px;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: #1a4993;
    background: #fff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const PreviewToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
`;

const PreviewHeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const PreviewFilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const PreviewFilterGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1 1 560px;
`;

const PreviewFilterField = styled.label`
  min-width: 180px;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #607292;
  font-size: 12px;
  font-weight: 500;

  input,
  select {
    width: 100%;
    min-height: 42px;
    border: 1px solid #d9e2ef;
    border-radius: 12px;
    background: #fff;
    padding: 10px 12px;
    color: #142749;
    font-size: 14px;
    outline: 0;
    font-family: inherit;
  }

  input:focus,
  select:focus {
    border-color: #1a4993;
  }
`;

const PreviewPaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const PreviewPaginationMeta = styled.div`
  color: #6d7f9e;
  font-size: 12px;
  line-height: 1.5;
`;

const PreviewSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewStatCard = styled.div`
  border: 1px solid #e6ebf3;
  background: #f8faff;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PreviewStatLabel = styled.div`
  color: #6d7f9e;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const PreviewStatValue = styled.div`
  color: #13284a;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
`;

const PreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(280px, 1.3fr) auto;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  background: #fbfcff;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewIdentity = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewName = styled.div`
  color: #102447;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
`;

const PreviewSubline = styled.div`
  color: #7082a2;
  font-size: 12px;
  line-height: 1.45;
  word-break: break-word;
`;

const PreviewMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PreviewRowActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }

  @media (max-width: 520px) {
    button {
      width: 100%;
    }
  }
`;

const PreviewModalCard = styled(ModalCard)`
  width: min(100%, 1100px);
`;

const District = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [formValues, setFormValues] = useState({ id: "", district: "", code: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [detailModal, setDetailModal] = useState(null);
  const [detailExporting, setDetailExporting] = useState(false);
  const [detailSaving, setDetailSaving] = useState(false);
  const [detailDeleting, setDetailDeleting] = useState(false);
  const [quickModal, setQuickModal] = useState(null);
  const [quickDeleteModal, setQuickDeleteModal] = useState(null);
  const [quickAreaName, setQuickAreaName] = useState("");
  const [quickCenterForm, setQuickCenterForm] = useState({
    nameOfCenter: "",
    centerType: "Male",
    halqaName: "",
    studentsCountMale: "0",
    studentsCountFemale: "0",
  });
  const loaderBoxRef = useRef(props.setLoaderBox);
  const messageRef = useRef(props.setMessage);
  const detailRequestRef = useRef(0);

  useEffect(() => {
    document.title = "District - QSC Automation";
  }, []);

  useEffect(() => {
    loaderBoxRef.current = props.setLoaderBox;
    messageRef.current = props.setMessage;
  }, [props.setLoaderBox, props.setMessage]);

  const showMessage = useCallback((message) => {
    messageRef.current?.(message);
  }, []);

  const loadDistricts = useCallback(async () => {
    setLoading(true);
    loaderBoxRef.current?.(true);

    try {
      const res = await getData({ skip: 0, limit: 500 }, "district");
      if (res?.status === 200) {
        setRows(res?.data?.response || []);
      } else {
        setRows([]);
        showMessage({
          type: 1,
          content: res?.data?.message || res?.customMessage || "Failed to load district summaries.",
        });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to load district summaries." });
    } finally {
      setLoading(false);
      loaderBoxRef.current?.(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  const overview = useMemo(
    () =>
      rows.reduce(
        (acc, item) => {
          acc.districts += 1;
          acc.areas += Number(item.areaCount || 0);
          acc.centres += Number(item.studyCenterCount || 0);
          acc.maleCentres += Number(item.maleCenterCount || 0);
          acc.femaleCentres += Number(item.femaleCenterCount || 0);
          acc.mixedCentres += Number(item.mixedCenterCount || 0);
          acc.maleStudents += Number(item.maleStudentCount || 0);
          acc.femaleStudents += Number(item.femaleStudentCount || 0);
          acc.students += Number(item.maleStudentCount || 0) + Number(item.femaleStudentCount || 0);
          return acc;
        },
        {
          districts: 0,
          areas: 0,
          centres: 0,
          maleCentres: 0,
          femaleCentres: 0,
          mixedCentres: 0,
          maleStudents: 0,
          femaleStudents: 0,
          students: 0,
        }
      ),
    [rows]
  );

  const getTotalStudents = (item) => Number(item.maleStudentCount || 0) + Number(item.femaleStudentCount || 0);

  const loadAreaPreview = useCallback(
    async (district, config = {}) => {
      const page = Number(config.page || 1);
      const search = config.search ?? "";
      const sortBy = config.sortBy || "area";
      const sortOrder = config.sortOrder || "asc";
      const requestId = detailRequestRef.current + 1;
      detailRequestRef.current = requestId;

      setDetailModal((prev) => ({
        type: "areas",
        district,
        area: null,
        items: prev?.type === "areas" ? prev.items || [] : [],
        summary: prev?.type === "areas" ? prev.summary || createEmptyStats() : createEmptyStats(),
        loading: true,
        title: `${district.district} Areas`,
        description: `Area-wise centre and student totals inside ${district.district}.`,
        page,
        pageSize: DETAIL_PAGE_SIZE,
        totalItems: prev?.type === "areas" ? prev.totalItems || 0 : 0,
        search,
        sortBy,
        sortOrder,
      }));

      try {
        const response = await getData(
          {
            district: district._id,
            skip: (page - 1) * DETAIL_PAGE_SIZE,
            limit: DETAIL_PAGE_SIZE,
            ...(search ? { searchkey: search } : {}),
            sortBy,
            sortOrder,
          },
          "area"
        );

        if (detailRequestRef.current !== requestId) return;

        if (response?.status !== 200) {
          setDetailModal(null);
          showMessage({
            type: 1,
            content: response?.data?.message || response?.data || response?.customMessage || "Failed to load area preview.",
          });
          return;
        }

        const items = response?.data?.response || [];
        const totalItems = Number(response?.data?.filterCount || 0);

        if (!items.length && totalItems > 0 && page > 1) {
          await loadAreaPreview(district, { page: page - 1, search, sortBy, sortOrder });
          return;
        }

        setDetailModal({
          type: "areas",
          district,
          area: null,
          items,
          summary: { ...createEmptyStats(), ...(response?.data?.summary || {}) },
          loading: false,
          title: `${district.district} Areas`,
          description: `Area-wise centre and student totals inside ${district.district}.`,
          page,
          pageSize: DETAIL_PAGE_SIZE,
          totalItems,
          search,
          sortBy,
          sortOrder,
        });
      } catch (error) {
        if (detailRequestRef.current !== requestId) return;
        setDetailModal(null);
        showMessage({ type: 1, content: "Failed to load area preview." });
      }
    },
    [showMessage]
  );

  const loadCenterPreview = useCallback(
    async (district, area = null, config = {}) => {
      const page = Number(config.page || 1);
      const search = config.search ?? "";
      const sortBy = config.sortBy || "nameOfCenter";
      const sortOrder = config.sortOrder || "asc";
      const requestId = detailRequestRef.current + 1;
      detailRequestRef.current = requestId;

      setDetailModal((prev) => ({
        type: "centres",
        district,
        area,
        items: prev?.type === "centres" ? prev.items || [] : [],
        summary: prev?.type === "centres" ? prev.summary || createEmptyStats() : createEmptyStats(),
        loading: true,
        title: area ? `${area.area} Centres` : `${district.district} Centres`,
        description: area ? `Study centres inside ${area.area}.` : `Study centres inside ${district.district}.`,
        page,
        pageSize: DETAIL_PAGE_SIZE,
        totalItems: prev?.type === "centres" ? prev.totalItems || 0 : 0,
        search,
        sortBy,
        sortOrder,
      }));

      try {
        const response = await getData(
          {
            district: district._id,
            ...(area?._id ? { area: area._id } : {}),
            skip: (page - 1) * DETAIL_PAGE_SIZE,
            limit: DETAIL_PAGE_SIZE,
            ...(search ? { searchkey: search } : {}),
            sortBy,
            sortOrder,
          },
          "center-registration"
        );

        if (detailRequestRef.current !== requestId) return;

        if (response?.status !== 200) {
          setDetailModal(null);
          showMessage({
            type: 1,
            content: response?.data?.message || response?.data || response?.customMessage || "Failed to load centre preview.",
          });
          return;
        }

        const items = response?.data?.response || [];
        const totalItems = Number(response?.data?.filterCount || 0);

        if (!items.length && totalItems > 0 && page > 1) {
          await loadCenterPreview(district, area, { page: page - 1, search, sortBy, sortOrder });
          return;
        }

        setDetailModal({
          type: "centres",
          district,
          area,
          items,
          summary: buildCenterSummaryFromCounts(response?.data?.counts || {}),
          loading: false,
          title: area ? `${area.area} Centres` : `${district.district} Centres`,
          description: area ? `Study centres inside ${area.area}.` : `Study centres inside ${district.district}.`,
          page,
          pageSize: DETAIL_PAGE_SIZE,
          totalItems,
          search,
          sortBy,
          sortOrder,
        });
      } catch (error) {
        if (detailRequestRef.current !== requestId) return;
        setDetailModal(null);
        showMessage({ type: 1, content: "Failed to load centre preview." });
      }
    },
    [showMessage]
  );

  const applyDetailFilters = useCallback(() => {
    if (!detailModal) return;
    if (detailModal.type === "areas") {
      loadAreaPreview(detailModal.district, {
        page: 1,
        search: detailModal.search,
        sortBy: detailModal.sortBy,
        sortOrder: detailModal.sortOrder,
      });
      return;
    }

    loadCenterPreview(detailModal.district, detailModal.area, {
      page: 1,
      search: detailModal.search,
      sortBy: detailModal.sortBy,
      sortOrder: detailModal.sortOrder,
    });
  }, [detailModal, loadAreaPreview, loadCenterPreview]);

  const changeDetailPage = useCallback(
    (page) => {
      if (!detailModal) return;
      if (detailModal.type === "areas") {
        loadAreaPreview(detailModal.district, {
          page,
          search: detailModal.search,
          sortBy: detailModal.sortBy,
          sortOrder: detailModal.sortOrder,
        });
        return;
      }

      loadCenterPreview(detailModal.district, detailModal.area, {
        page,
        search: detailModal.search,
        sortBy: detailModal.sortBy,
        sortOrder: detailModal.sortOrder,
      });
    },
    [detailModal, loadAreaPreview, loadCenterPreview]
  );

  const refreshActiveDetailModal = useCallback(async () => {
    if (!detailModal) return;
    if (detailModal.type === "areas") {
      await loadAreaPreview(detailModal.district, {
        page: detailModal.page,
        search: detailModal.search,
        sortBy: detailModal.sortBy,
        sortOrder: detailModal.sortOrder,
      });
      return;
    }

    await loadCenterPreview(detailModal.district, detailModal.area, {
      page: detailModal.page,
      search: detailModal.search,
      sortBy: detailModal.sortBy,
      sortOrder: detailModal.sortOrder,
    });
  }, [detailModal, loadAreaPreview, loadCenterPreview]);

  const exportDetailRows = useCallback(async () => {
    if (!detailModal || detailExporting) return;

    setDetailExporting(true);
    try {
      if (detailModal.type === "areas") {
        const response = await getData(
          {
            district: detailModal.district._id,
            skip: 0,
            limit: Math.max(detailModal.totalItems || 0, DETAIL_PAGE_SIZE),
            ...(detailModal.search ? { searchkey: detailModal.search } : {}),
            sortBy: detailModal.sortBy,
            sortOrder: detailModal.sortOrder,
          },
          "area"
        );

        if (response?.status !== 200) {
          showMessage({ type: 1, content: response?.data?.message || response?.data || response?.customMessage || "Failed to export areas." });
          return;
        }

        const items = response?.data?.response || [];
        if (!items.length) {
          showMessage({ type: 1, content: "No area data available for export." });
          return;
        }

        downloadCsvFile(
          `${detailModal.district.district || "district"}-areas.csv`,
          items.map((item) => ({
            Area: item.area || "",
            TotalCentres: item.studyCenterCount || 0,
            MaleCentres: item.maleCenterCount || 0,
            FemaleCentres: item.femaleCenterCount || 0,
            MixedCentres: item.mixedCenterCount || 0,
            MaleStudents: item.maleStudentCount || 0,
            FemaleStudents: item.femaleStudentCount || 0,
            TotalStudents: item.totalStudents || 0,
          }))
        );
        return;
      }

      const response = await getData(
        {
          district: detailModal.district._id,
          ...(detailModal.area?._id ? { area: detailModal.area._id } : {}),
          skip: 0,
          limit: Math.max(detailModal.totalItems || 0, DETAIL_PAGE_SIZE),
          ...(detailModal.search ? { searchkey: detailModal.search } : {}),
          sortBy: detailModal.sortBy,
          sortOrder: detailModal.sortOrder,
        },
        "center-registration"
      );

      if (response?.status !== 200) {
        showMessage({ type: 1, content: response?.data?.message || response?.data || response?.customMessage || "Failed to export centres." });
        return;
      }

      const items = response?.data?.response || [];
      if (!items.length) {
        showMessage({ type: 1, content: "No centre data available for export." });
        return;
      }

      downloadCsvFile(
        `${detailModal.area?.area || detailModal.district.district || "centres"}-centres.csv`,
        items.map((item) => ({
          Centre: item.nameOfCenter || "",
          Type: item.centerType || "",
          AffiliationNo: item.affiliationNo || "",
          CenterCode: item.centerCode || "",
          Area: item.area?.area || detailModal.area?.area || "",
          Halqa: item.halqaName || "",
          MaleStudents: toNumber(item.studentsCountMale),
          FemaleStudents: toNumber(item.studentsCountFemale),
          TotalStudents: toNumber(item.studentsCountMale) + toNumber(item.studentsCountFemale),
        }))
      );
    } catch (error) {
      showMessage({ type: 1, content: "Failed to export preview data." });
    } finally {
      setDetailExporting(false);
    }
  }, [detailExporting, detailModal, showMessage]);

  const downloadApplicationCertificate = useCallback(
    async (centerItem) => {
      loaderBoxRef.current?.(true);
      try {
        const response = await getData({ id: centerItem._id }, "center-registration/download-affiliation");
        if (response?.status === 200 && response?.data?.url) {
          showMessage({ type: 2, content: response?.data?.message || "Application certificate ready.", proceed: "Okay" });
          window.open(`${import.meta.env.VITE_APP_CDN}${response.data.url}`, "_blank");
        } else {
          showMessage({
            type: 1,
            content: response?.data?.message || response?.data || response?.customMessage || "Failed to download application certificate.",
          });
        }
      } catch (error) {
        showMessage({ type: 1, content: "Failed to download application certificate." });
      } finally {
        loaderBoxRef.current?.(false);
      }
    },
    [showMessage]
  );

  const closeDetailModal = useCallback(() => {
    detailRequestRef.current += 1;
    setDetailModal(null);
    setQuickModal(null);
    setQuickDeleteModal(null);
    setQuickAreaName("");
    setQuickCenterForm({
      nameOfCenter: "",
      centerType: "Male",
      halqaName: "",
      studentsCountMale: "0",
      studentsCountFemale: "0",
    });
  }, []);

  const openAreaPreview = useCallback((district) => loadAreaPreview(district), [loadAreaPreview]);

  const openCenterPreview = useCallback((district, area = null) => loadCenterPreview(district, area), [loadCenterPreview]);

  const openQuickAreaModal = () => {
    if (!detailModal?.district) return;
    setQuickAreaName("");
    setQuickModal({ type: "area", district: detailModal.district });
  };

  const openQuickCenterModal = () => {
    if (!detailModal?.district || !detailModal?.area) return;
    setQuickCenterForm({
      nameOfCenter: "",
      centerType: "Male",
      halqaName: "",
      studentsCountMale: "0",
      studentsCountFemale: "0",
    });
    setQuickModal({ type: "center", district: detailModal.district, area: detailModal.area });
  };

  const closeQuickModal = () => {
    if (detailSaving) return;
    setQuickModal(null);
  };

  const openQuickDeleteModal = (type, item) => {
    setQuickDeleteModal({ type, item, district: detailModal?.district, area: detailModal?.area });
  };

  const closeQuickDeleteModal = () => {
    if (detailDeleting) return;
    setQuickDeleteModal(null);
  };

  const submitQuickArea = async (event) => {
    event.preventDefault();
    if (!quickModal?.district) return;

    const areaName = quickAreaName.trim();
    if (!areaName) {
      showMessage({ type: 1, content: "Area name is required." });
      return;
    }

    setDetailSaving(true);
    loaderBoxRef.current?.(true);

    try {
      const response = await postData({ area: areaName, district: quickModal.district._id }, "area");
      if (response?.status === 200) {
        showMessage({ type: 2, content: "Area added successfully.", proceed: "Okay" });
        setQuickModal(null);
        setQuickAreaName("");
        await Promise.all([
          loadDistricts(),
          loadAreaPreview(quickModal.district, {
            page: 1,
            search: detailModal?.search || "",
            sortBy: detailModal?.sortBy || "area",
            sortOrder: detailModal?.sortOrder || "asc",
          }),
        ]);
      } else {
        showMessage({ type: 1, content: response?.data?.message || response?.customMessage || "Failed to add area." });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to add area." });
    } finally {
      setDetailSaving(false);
      loaderBoxRef.current?.(false);
    }
  };

  const submitQuickCenter = async (event) => {
    event.preventDefault();
    if (!quickModal?.district || !quickModal?.area) return;

    const nameOfCenter = quickCenterForm.nameOfCenter.trim();
    const halqaName = quickCenterForm.halqaName.trim();
    if (!nameOfCenter || !halqaName) {
      showMessage({ type: 1, content: "Centre name and Halqa name are required." });
      return;
    }

    const centerType = quickCenterForm.centerType;
    const studentsCountMale = centerType === "Female" ? 0 : toNumber(quickCenterForm.studentsCountMale);
    const studentsCountFemale = centerType === "Male" ? 0 : toNumber(quickCenterForm.studentsCountFemale);

    setDetailSaving(true);
    loaderBoxRef.current?.(true);

    try {
      const response = await postData(
        {
          nameOfCenter,
          centerType,
          district: quickModal.district._id,
          area: quickModal.area._id,
          halqaName,
          studentsCountMale,
          studentsCountFemale,
        },
        "center-registration"
      );

      if (response?.status === 200) {
        showMessage({ type: 2, content: "Study centre added successfully.", proceed: "Okay" });
        setQuickModal(null);
        setQuickCenterForm({
          nameOfCenter: "",
          centerType: "Male",
          halqaName: "",
          studentsCountMale: "0",
          studentsCountFemale: "0",
        });
        await Promise.all([
          loadDistricts(),
          loadCenterPreview(quickModal.district, quickModal.area, {
            page: 1,
            search: detailModal?.search || "",
            sortBy: detailModal?.sortBy || "nameOfCenter",
            sortOrder: detailModal?.sortOrder || "asc",
          }),
        ]);
      } else {
        showMessage({ type: 1, content: response?.data?.message || response?.customMessage || "Failed to add study centre." });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to add study centre." });
    } finally {
      setDetailSaving(false);
      loaderBoxRef.current?.(false);
    }
  };

  const submitQuickDelete = async (event) => {
    event.preventDefault();
    if (!quickDeleteModal?.item) return;

    setDetailDeleting(true);
    loaderBoxRef.current?.(true);

    try {
      const response =
        quickDeleteModal.type === "area"
          ? await deleteData({ id: quickDeleteModal.item._id }, "area")
          : await deleteData({ id: quickDeleteModal.item._id }, "center-registration");

      if (response?.status === 200) {
        showMessage({
          type: 2,
          content: quickDeleteModal.type === "area" ? "Area deleted successfully." : "Study centre deleted successfully.",
          proceed: "Okay",
        });
        setQuickDeleteModal(null);
        await Promise.all([loadDistricts(), refreshActiveDetailModal()]);
      } else {
        showMessage({
          type: 1,
          content: response?.data?.message || response?.customMessage || "Failed to delete item.",
        });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to delete item." });
    } finally {
      setDetailDeleting(false);
      loaderBoxRef.current?.(false);
    }
  };

  const openCreateModal = () => {
    setFormValues({ id: "", district: "", code: "" });
    setModalMode("create");
  };

  const openEditModal = (district) => {
    setFormValues({
      id: district._id || "",
      district: district.district || "",
      code: district.code || "",
    });
    setModalMode("edit");
  };

  const openDeleteModal = (district) => {
    setDeleteTarget(district);
    setDeleteReason("");
  };

  const closeModal = () => {
    if (saving || deleting) return;
    setModalMode(null);
    setFormValues({ id: "", district: "", code: "" });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteReason("");
  };

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const submitDistrict = async (event) => {
    event.preventDefault();
    const districtName = formValues.district.trim();
    const code = formValues.code.trim();

    if (!districtName) {
      showMessage({ type: 1, content: "District name is required." });
      return;
    }

    setSaving(true);
    loaderBoxRef.current?.(true);

    try {
      const payload = { district: districtName, code };
      const response =
        modalMode === "edit"
          ? await putData({ ...payload, id: formValues.id }, "district")
          : await postData(payload, "district");

      if (response?.status === 200) {
        showMessage({
          type: 2,
          content: modalMode === "edit" ? "District updated successfully." : "District added successfully.",
          proceed: "Okay",
        });
        setModalMode(null);
        setFormValues({ id: "", district: "", code: "" });
        await loadDistricts();
      } else {
        showMessage({
          type: 1,
          content: response?.data?.message || response?.customMessage || "Failed to save district.",
        });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to save district." });
    } finally {
      setSaving(false);
      loaderBoxRef.current?.(false);
    }
  };

  const submitDelete = async (event) => {
    event.preventDefault();
    if (!deleteTarget) return;

    const reason = deleteReason.trim();
    if (!reason) {
      showMessage({ type: 1, content: "Please enter a reason for deletion." });
      return;
    }

    setDeleting(true);
    loaderBoxRef.current?.(true);

    try {
      const response = await deleteData({ id: deleteTarget._id, reason }, "district");
      if (response?.status === 200) {
        showMessage({ type: 2, content: "District deleted successfully.", proceed: "Okay" });
        setDeleteTarget(null);
        setDeleteReason("");
        await loadDistricts();
      } else {
        showMessage({
          type: 1,
          content: response?.data?.message || response?.customMessage || "Failed to delete district.",
        });
      }
    } catch (error) {
      showMessage({ type: 1, content: "Failed to delete district." });
    } finally {
      setDeleting(false);
      loaderBoxRef.current?.(false);
    }
  };

  return (
    <Container className="noshadow">
      <PageWrap>
        <HeaderBar>
          <HeaderCopy>
            <h2>District Snapshot</h2>
            <p>Compact district summary with direct view, edit, and delete actions.</p>
          </HeaderCopy>
          {props.addPrivilege ? (
            <ActionButton className="primary" onClick={openCreateModal}>
              <Plus size={16} />
              Add District
            </ActionButton>
          ) : null}
        </HeaderBar>

        <OverviewGrid>
          <OverviewCard>
            <OverviewTop>
              <span>Districts</span>
              <MapPinned size={16} />
            </OverviewTop>
            <OverviewValue>{overview.districts}</OverviewValue>
            <OverviewMeta>{overview.areas} areas in total.</OverviewMeta>
          </OverviewCard>
          <OverviewCard>
            <OverviewTop>
              <span>Study Centres</span>
              <Building2 size={16} />
            </OverviewTop>
            <OverviewValue>{overview.centres}</OverviewValue>
            <OverviewMeta>
              M {overview.maleCentres} | F {overview.femaleCentres} | X {overview.mixedCentres}
            </OverviewMeta>
          </OverviewCard>
          <OverviewCard>
            <OverviewTop>
              <span>Male Students</span>
              <Users size={16} />
            </OverviewTop>
            <OverviewValue>{overview.maleStudents}</OverviewValue>
            <OverviewMeta>Across all visible districts.</OverviewMeta>
          </OverviewCard>
          <OverviewCard>
            <OverviewTop>
              <span>Female Students</span>
              <Users size={16} />
            </OverviewTop>
            <OverviewValue>{overview.femaleStudents}</OverviewValue>
            <OverviewMeta>Across all visible districts.</OverviewMeta>
          </OverviewCard>
          <OverviewCard>
            <OverviewTop>
              <span>Total Students</span>
              <Users size={16} />
            </OverviewTop>
            <OverviewValue>{overview.students}</OverviewValue>
            <OverviewMeta>Male Students + Female Students.</OverviewMeta>
          </OverviewCard>
        </OverviewGrid>

        {loading ? (
          <EmptyState>Loading district summaries...</EmptyState>
        ) : rows.length === 0 ? (
          <EmptyState>No district data found.</EmptyState>
        ) : (
          <TableWrap>
            <TableHead>
              <div>District</div>
              <div>Coverage</div>
              <div>Centre Counts</div>
              <div>Student Counts</div>
              <div>Actions</div>
            </TableHead>

            {rows.map((item) => (
              <DistrictRow key={item._id}>
                <Cell>
                  <CellTitle>District</CellTitle>
                  <DistrictName>{item.district}</DistrictName>
                  <DistrictMetaText>{item.code || "No code assigned"}</DistrictMetaText>
                </Cell>

                <Cell>
                  <CellTitle>Coverage</CellTitle>
                  <BadgeWrap>
                    <InteractiveBadge type="button" onClick={() => openAreaPreview(item)}>
                      <MapPinned size={14} />
                      {item.areaCount || 0} areas
                    </InteractiveBadge>
                    <InteractiveBadge type="button" onClick={() => openCenterPreview(item)}>
                      <Building2 size={14} />
                      {item.studyCenterCount || 0} centres
                    </InteractiveBadge>
                  </BadgeWrap>
                </Cell>

                <Cell>
                  <CellTitle>Centre Counts</CellTitle>
                  <MetricGrid>
                    <MetricBox>
                      <MetricLabel>Male Centres</MetricLabel>
                      <MetricValue>{item.maleCenterCount || 0}</MetricValue>
                    </MetricBox>
                    <MetricBox>
                      <MetricLabel>Female Centres</MetricLabel>
                      <MetricValue>{item.femaleCenterCount || 0}</MetricValue>
                    </MetricBox>
                    <MetricBox>
                      <MetricLabel>Mixed Centres</MetricLabel>
                      <MetricValue>{item.mixedCenterCount || 0}</MetricValue>
                    </MetricBox>
                  </MetricGrid>
                </Cell>

                <Cell>
                  <CellTitle>Student Counts</CellTitle>
                  <MetricGrid>
                    <MetricBox>
                      <MetricLabel>Male Students</MetricLabel>
                      <MetricValue>{item.maleStudentCount || 0}</MetricValue>
                    </MetricBox>
                    <MetricBox>
                      <MetricLabel>Female Students</MetricLabel>
                      <MetricValue>{item.femaleStudentCount || 0}</MetricValue>
                    </MetricBox>
                    <MetricBox>
                      <MetricLabel>Total Students</MetricLabel>
                      <MetricValue>{getTotalStudents(item)}</MetricValue>
                    </MetricBox>
                  </MetricGrid>
                </Cell>

                <Cell>
                  <CellTitle>Actions</CellTitle>
                  <ActionRow>
                    <ActionButton className="secondary" onClick={() => openCenterPreview(item)}>
                      View Centres
                      <ArrowRight size={16} />
                    </ActionButton>
                    {props.updatePrivilege ? (
                      <ActionButton className="ghost" onClick={() => openEditModal(item)}>
                        <PencilLine size={16} />
                        Edit
                      </ActionButton>
                    ) : null}
                    {props.delPrivilege ? (
                      <ActionButton className="ghost danger" onClick={() => openDeleteModal(item)}>
                        <Trash2 size={16} />
                        Delete
                      </ActionButton>
                    ) : null}
                  </ActionRow>
                </Cell>
              </DistrictRow>
            ))}
          </TableWrap>
        )}

        {detailModal ? (
          <ModalBackdrop onClick={closeDetailModal}>
            <PreviewModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>{detailModal.title}</h3>
                <p>{detailModal.description}</p>
              </ModalTitle>

              <PreviewToolbar>
                <PreviewHeaderActions>
                  {detailModal.type === "areas" && props.addPrivilege ? (
                    <ActionButton type="button" className="primary" onClick={openQuickAreaModal}>
                      <Plus size={16} />
                      Add Area
                    </ActionButton>
                  ) : null}
                  {detailModal.type === "centres" && detailModal.area && props.addPrivilege ? (
                    <ActionButton type="button" className="primary" onClick={openQuickCenterModal}>
                      <Plus size={16} />
                      Add Centre
                    </ActionButton>
                  ) : null}
                  <ActionButton type="button" className="ghost" onClick={exportDetailRows} disabled={detailExporting || detailModal.loading}>
                    {detailExporting ? "Exporting..." : "Export"}
                  </ActionButton>
                  <ActionButton type="button" className="ghost" onClick={closeDetailModal}>
                    Close
                  </ActionButton>
                </PreviewHeaderActions>

                <PreviewFilterRow>
                  <PreviewFilterGroup>
                    <PreviewFilterField>
                      <span>Search</span>
                      <input
                        value={detailModal.search || ""}
                        onChange={(event) => setDetailModal((prev) => (prev ? { ...prev, search: event.target.value } : prev))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            applyDetailFilters();
                          }
                        }}
                        placeholder={detailModal.type === "areas" ? "Search area name" : "Search centre, affiliation, halqa, code"}
                      />
                    </PreviewFilterField>
                    <PreviewFilterField>
                      <span>Sort By</span>
                      <select
                        value={`${detailModal.sortBy || (detailModal.type === "areas" ? "area" : "nameOfCenter")}:${detailModal.sortOrder || "asc"}`}
                        onChange={(event) => {
                          const nextSort = parseSortValue(event.target.value, detailModal.type === "areas" ? "area" : "nameOfCenter");
                          if (detailModal.type === "areas") {
                            loadAreaPreview(detailModal.district, {
                              page: 1,
                              search: detailModal.search,
                              sortBy: nextSort.sortBy,
                              sortOrder: nextSort.sortOrder,
                            });
                          } else {
                            loadCenterPreview(detailModal.district, detailModal.area, {
                              page: 1,
                              search: detailModal.search,
                              sortBy: nextSort.sortBy,
                              sortOrder: nextSort.sortOrder,
                            });
                          }
                        }}
                      >
                        {(detailModal.type === "areas" ? areaSortOptions : centerSortOptions).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </PreviewFilterField>
                  </PreviewFilterGroup>

                  <PreviewHeaderActions>
                    <ActionButton type="button" className="ghost" onClick={applyDetailFilters} disabled={detailModal.loading}>
                      Apply
                    </ActionButton>
                  </PreviewHeaderActions>
                </PreviewFilterRow>

                <PreviewSummaryGrid>
                  <PreviewStatCard>
                    <PreviewStatLabel>Total Centres</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.studyCenterCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Male Centres</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.maleCenterCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Female Centres</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.femaleCenterCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Mixed Centres</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.mixedCenterCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Male Students</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.maleStudentCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Female Students</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.femaleStudentCount || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Total Students</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary?.totalStudents || 0}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>{detailModal.type === "areas" ? "Areas" : "Visible Centres"}</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.totalItems || 0}</PreviewStatValue>
                  </PreviewStatCard>
                </PreviewSummaryGrid>
              </PreviewToolbar>

              {detailModal.loading ? (
                <EmptyState>Loading preview data...</EmptyState>
              ) : detailModal.items?.length ? (
                <PreviewList>
                  {detailModal.type === "areas"
                    ? detailModal.items.map((areaItem) => (
                        <PreviewRow key={areaItem._id}>
                          <PreviewIdentity>
                            <PreviewName>{areaItem.area}</PreviewName>
                            <PreviewSubline>{areaItem.studyCenterCount || 0} centres linked to this area.</PreviewSubline>
                          </PreviewIdentity>

                          <MetricGrid>
                            <MetricBox>
                              <MetricLabel>Male Centres</MetricLabel>
                              <MetricValue>{areaItem.maleCenterCount || 0}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Female Centres</MetricLabel>
                              <MetricValue>{areaItem.femaleCenterCount || 0}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Mixed Centres</MetricLabel>
                              <MetricValue>{areaItem.mixedCenterCount || 0}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Male Students</MetricLabel>
                              <MetricValue>{areaItem.maleStudentCount || 0}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Female Students</MetricLabel>
                              <MetricValue>{areaItem.femaleStudentCount || 0}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Total Students</MetricLabel>
                              <MetricValue>{areaItem.totalStudents || 0}</MetricValue>
                            </MetricBox>
                          </MetricGrid>

                          <PreviewRowActions>
                            <ActionButton type="button" className="ghost" onClick={() => openCenterPreview(detailModal.district, areaItem)}>
                              View Centres
                            </ActionButton>
                            {props.delPrivilege ? (
                              <ActionButton type="button" className="ghost danger" onClick={() => openQuickDeleteModal("area", areaItem)}>
                                Delete
                              </ActionButton>
                            ) : null}
                          </PreviewRowActions>
                        </PreviewRow>
                      ))
                    : detailModal.items.map((centerItem) => (
                        <PreviewRow key={centerItem._id}>
                          <PreviewIdentity>
                            <PreviewName>{centerItem.nameOfCenter}</PreviewName>
                            <PreviewSubline>{centerItem.area?.area || detailModal.area?.area || "No area linked"}</PreviewSubline>
                            <PreviewMetaRow>
                              {centerItem.centerType ? <Badge>{centerItem.centerType}</Badge> : null}
                              {centerItem.affiliationNo ? <Badge>{centerItem.affiliationNo}</Badge> : null}
                              {centerItem.centerCode ? <Badge>{centerItem.centerCode}</Badge> : null}
                            </PreviewMetaRow>
                          </PreviewIdentity>

                          <MetricGrid>
                            <MetricBox>
                              <MetricLabel>Male Students</MetricLabel>
                              <MetricValue>{toNumber(centerItem.studentsCountMale)}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Female Students</MetricLabel>
                              <MetricValue>{toNumber(centerItem.studentsCountFemale)}</MetricValue>
                            </MetricBox>
                            <MetricBox>
                              <MetricLabel>Total Students</MetricLabel>
                              <MetricValue>{toNumber(centerItem.studentsCountMale) + toNumber(centerItem.studentsCountFemale)}</MetricValue>
                            </MetricBox>
                          </MetricGrid>

                          <PreviewRowActions>
                            <ActionButton type="button" className="ghost" onClick={() => downloadApplicationCertificate(centerItem)}>
                              Download Application Certificate
                            </ActionButton>
                            {props.delPrivilege ? (
                              <ActionButton type="button" className="ghost danger" onClick={() => openQuickDeleteModal("center", centerItem)}>
                                Delete
                              </ActionButton>
                            ) : null}
                          </PreviewRowActions>
                        </PreviewRow>
                      ))}
                </PreviewList>
              ) : (
                <EmptyState>No preview data found.</EmptyState>
              )}

              {!detailModal.loading ? (
                <PreviewPaginationBar>
                  <PreviewPaginationMeta>
                    {detailModal.totalItems
                      ? `Showing ${(detailModal.page - 1) * DETAIL_PAGE_SIZE + 1}-${Math.min(detailModal.page * DETAIL_PAGE_SIZE, detailModal.totalItems)} of ${detailModal.totalItems}`
                      : "No items found"}
                  </PreviewPaginationMeta>

                  <PreviewHeaderActions>
                    <ActionButton
                      type="button"
                      className="ghost"
                      disabled={(detailModal.page || 1) <= 1}
                      onClick={() => changeDetailPage((detailModal.page || 1) - 1)}
                    >
                      Previous
                    </ActionButton>
                    <ActionButton
                      type="button"
                      className="ghost"
                      disabled={(detailModal.page || 1) >= Math.max(1, Math.ceil((detailModal.totalItems || 0) / DETAIL_PAGE_SIZE))}
                      onClick={() => changeDetailPage((detailModal.page || 1) + 1)}
                    >
                      Next
                    </ActionButton>
                  </PreviewHeaderActions>
                </PreviewPaginationBar>
              ) : null}
            </PreviewModalCard>
          </ModalBackdrop>
        ) : null}

        {quickModal?.type === "area" ? (
          <ModalBackdrop onClick={closeQuickModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>Add Area</h3>
                <p>Create a new area directly inside {quickModal.district?.district}.</p>
              </ModalTitle>

              <FormGrid onSubmit={submitQuickArea}>
                <Field>
                  <span>District</span>
                  <input value={quickModal.district?.district || ""} disabled />
                </Field>
                <Field>
                  <span>Area Name</span>
                  <input value={quickAreaName} onChange={(event) => setQuickAreaName(event.target.value)} placeholder="Enter area name" autoFocus />
                </Field>

                <ModalActions>
                  <ActionButton type="button" className="ghost" onClick={closeQuickModal} disabled={detailSaving}>
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" className="primary" disabled={detailSaving}>
                    {detailSaving ? "Saving..." : "Create Area"}
                  </ActionButton>
                </ModalActions>
              </FormGrid>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {quickModal?.type === "center" ? (
          <ModalBackdrop onClick={closeQuickModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>Add Study Centre</h3>
                <p>Create a study centre directly inside {quickModal.area?.area}.</p>
              </ModalTitle>

              <FormGrid onSubmit={submitQuickCenter}>
                <Field>
                  <span>District</span>
                  <input value={quickModal.district?.district || ""} disabled />
                </Field>
                <Field>
                  <span>Area</span>
                  <input value={quickModal.area?.area || ""} disabled />
                </Field>
                <Field>
                  <span>Centre Name</span>
                  <input
                    value={quickCenterForm.nameOfCenter}
                    onChange={(event) => setQuickCenterForm((prev) => ({ ...prev, nameOfCenter: event.target.value }))}
                    placeholder="Enter centre name"
                    autoFocus
                  />
                </Field>
                <Field>
                  <span>Centre Type</span>
                  <select value={quickCenterForm.centerType} onChange={(event) => setQuickCenterForm((prev) => ({ ...prev, centerType: event.target.value }))}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </Field>
                <Field>
                  <span>Halqa Name</span>
                  <input
                    value={quickCenterForm.halqaName}
                    onChange={(event) => setQuickCenterForm((prev) => ({ ...prev, halqaName: event.target.value }))}
                    placeholder="Enter halqa name"
                  />
                </Field>
                <Field>
                  <span>Male Students</span>
                  <input
                    type="number"
                    min="0"
                    value={quickCenterForm.studentsCountMale}
                    disabled={quickCenterForm.centerType === "Female"}
                    onChange={(event) => setQuickCenterForm((prev) => ({ ...prev, studentsCountMale: event.target.value }))}
                  />
                </Field>
                <Field>
                  <span>Female Students</span>
                  <input
                    type="number"
                    min="0"
                    value={quickCenterForm.studentsCountFemale}
                    disabled={quickCenterForm.centerType === "Male"}
                    onChange={(event) => setQuickCenterForm((prev) => ({ ...prev, studentsCountFemale: event.target.value }))}
                  />
                </Field>

                <ModalActions>
                  <ActionButton type="button" className="ghost" onClick={closeQuickModal} disabled={detailSaving}>
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" className="primary" disabled={detailSaving}>
                    {detailSaving ? "Saving..." : "Create Centre"}
                  </ActionButton>
                </ModalActions>
              </FormGrid>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {quickDeleteModal ? (
          <ModalBackdrop onClick={closeQuickDeleteModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>{quickDeleteModal.type === "area" ? "Delete Area" : "Delete Study Centre"}</h3>
                <p>
                  {quickDeleteModal.type === "area"
                    ? "Deletion will be blocked if this area still has linked study centres."
                    : "This will remove the selected study centre immediately."}
                </p>
              </ModalTitle>

              <WarningBox>
                <strong>{quickDeleteModal.type === "area" ? quickDeleteModal.item?.area : quickDeleteModal.item?.nameOfCenter}</strong>
                {quickDeleteModal.type === "area"
                  ? `Centres linked: ${quickDeleteModal.item?.studyCenterCount || 0}`
                  : `${quickDeleteModal.item?.area?.area || quickDeleteModal.area?.area || "No area linked"}`}
              </WarningBox>

              <FormGrid onSubmit={submitQuickDelete}>
                <ModalActions>
                  <ActionButton type="button" className="ghost" onClick={closeQuickDeleteModal} disabled={detailDeleting}>
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" className="ghost danger" disabled={detailDeleting}>
                    {detailDeleting ? "Deleting..." : quickDeleteModal.type === "area" ? "Delete Area" : "Delete Centre"}
                  </ActionButton>
                </ModalActions>
              </FormGrid>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {modalMode ? (
          <ModalBackdrop onClick={closeModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>{modalMode === "edit" ? "Edit District" : "Add District"}</h3>
                <p>Update district details without leaving this page.</p>
              </ModalTitle>

              <FormGrid onSubmit={submitDistrict}>
                <Field>
                  <span>District Name</span>
                  <input
                    value={formValues.district}
                    onChange={(event) => handleChange("district", event.target.value)}
                    placeholder="Enter district name"
                    autoFocus
                  />
                </Field>

                <Field>
                  <span>Code</span>
                  <input
                    value={formValues.code}
                    onChange={(event) => handleChange("code", event.target.value)}
                    placeholder="Optional code"
                  />
                </Field>

                <ModalActions>
                  <ActionButton type="button" className="ghost" onClick={closeModal} disabled={saving}>
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" className="primary" disabled={saving}>
                    {saving ? "Saving..." : modalMode === "edit" ? "Update District" : "Create District"}
                  </ActionButton>
                </ModalActions>
              </FormGrid>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {deleteTarget ? (
          <ModalBackdrop onClick={closeDeleteModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>Delete District</h3>
                <p>This action is permanent. The server will reject deletion when linked areas, centres, users, or registrations still exist.</p>
              </ModalTitle>

              <WarningBox>
                <strong>{deleteTarget.district}</strong>
                Areas: {deleteTarget.areaCount || 0} | Study Centres: {deleteTarget.studyCenterCount || 0}
              </WarningBox>

              <FormGrid onSubmit={submitDelete}>
                <Field>
                  <span>Reason for deletion</span>
                  <textarea
                    value={deleteReason}
                    onChange={(event) => setDeleteReason(event.target.value)}
                    placeholder="Why are you deleting this district?"
                  />
                </Field>

                <ModalActions>
                  <ActionButton type="button" className="ghost" onClick={closeDeleteModal} disabled={deleting}>
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" className="ghost danger" disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete District"}
                  </ActionButton>
                </ModalActions>
              </FormGrid>
            </ModalCard>
          </ModalBackdrop>
        ) : null}
      </PageWrap>
    </Container>
  );
};

export default Layout(District);
