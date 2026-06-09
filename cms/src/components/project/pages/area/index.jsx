import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import { deleteData, getData, postData } from "../../../../backend/api";
import { ArrowRight, Building2, Download, MapPinned, Plus, Trash2, Users, X } from "lucide-react";
import {
  ActionButton,
  Badge,
  BadgeWrap,
  DistrictOverviewCards,
  DistrictPageHeader,
  EmptyState,
  Field,
  FormGrid,
  InteractiveBadge,
  ModalActions,
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  PageWrap,
  PreviewFilterField,
  PreviewFilterGroup,
  PreviewFilterRow,
  PreviewHeaderActions,
  PreviewIdentity,
  PreviewList,
  PreviewName,
  PreviewPaginationBar,
  PreviewPaginationMeta,
  PreviewRow,
  PreviewRowActions,
  PreviewStatCard,
  PreviewStatLabel,
  PreviewStatValue,
  PreviewSubline,
  PreviewSummaryGrid,
  PreviewToolbar,
} from "../shared/districtSurface";

const DETAIL_PAGE_SIZE = 10;

const centerSortOptions = [
  { value: "nameOfCenter:asc", label: "Centre A-Z" },
  { value: "nameOfCenter:desc", label: "Centre Z-A" },
  { value: "centerType:asc", label: "Centre Type" },
  { value: "affiliationNo:asc", label: "Affiliation No" },
  { value: "_id:desc", label: "Newest First" },
];

const emptyStats = {
  studyCenterCount: 0,
  maleCenterCount: 0,
  femaleCenterCount: 0,
  mixedCenterCount: 0,
  maleStudentCount: 0,
  femaleStudentCount: 0,
  totalStudents: 0,
};

const normalizeObjectId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

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
  return `"${String(safeValue).replace(/"/g, '""')}"`;
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

const Area = (props) => {
  const pageStore = useSelector((state) => state.pages?.["area--0"]);
  const [detailModal, setDetailModal] = useState({
    open: false,
    area: null,
    rows: [],
    summary: { ...emptyStats },
    totalCount: 0,
    page: 1,
    search: "",
    sort: centerSortOptions[0].value,
    loading: false,
  });
  const [detailSaving, setDetailSaving] = useState(false);
  const [detailDeleting, setDetailDeleting] = useState(false);
  const [quickModal, setQuickModal] = useState({ type: "", area: null });
  const [quickDeleteModal, setQuickDeleteModal] = useState({ open: false, item: null });
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [quickCenterForm, setQuickCenterForm] = useState({
    nameOfCenter: "",
    centerType: "Male",
    halqaName: "",
    studentsCountMale: "0",
    studentsCountFemale: "0",
  });

  useEffect(() => {
    document.title = `Area - QSC Automation`;
  }, []);

  const areaSummary = pageStore?.summary || emptyStats;
  const overviewCards = useMemo(
    () => [
      {
        key: "areas",
        label: "Visible Areas",
        value: Number(pageStore?.filterCount || 0),
        meta: "Filtered list across all configured districts",
        icon: <MapPinned size={16} />,
      },
      {
        key: "centres",
        label: "Total Centres",
        value: Number(areaSummary.studyCenterCount || 0),
        meta: `${Number(areaSummary.maleCenterCount || 0)} male • ${Number(areaSummary.femaleCenterCount || 0)} female • ${Number(areaSummary.mixedCenterCount || 0)} mixed`,
        icon: <Building2 size={16} />,
      },
      {
        key: "students",
        label: "Total Students",
        value: Number(areaSummary.totalStudents || 0),
        meta: `${Number(areaSummary.maleStudentCount || 0)} male • ${Number(areaSummary.femaleStudentCount || 0)} female`,
        icon: <Users size={16} />,
      },
      {
        key: "male-centres",
        label: "Male Centres",
        value: Number(areaSummary.maleCenterCount || 0),
        meta: "Single-gender centre count",
        icon: <ArrowRight size={16} />,
      },
      {
        key: "mixed-centres",
        label: "Mixed Centres",
        value: Number(areaSummary.mixedCenterCount || 0),
        meta: "Mixed study centres",
        icon: <ArrowRight size={16} />,
      },
    ],
    [areaSummary, pageStore]
  );

  const loadCenterPreview = useCallback(
    async (areaItem, nextPage = 1, overrides = {}) => {
      if (!areaItem?._id) return;

      const nextSearch = overrides.search ?? detailModal.search;
      const nextSort = overrides.sort ?? detailModal.sort;
      const { sortBy, sortOrder } = parseSortValue(nextSort, "nameOfCenter", "asc");

      setDetailModal((prev) => ({
        ...prev,
        open: true,
        loading: true,
        area: areaItem,
        page: nextPage,
        search: nextSearch,
        sort: nextSort,
      }));

      try {
        const response = await getData(
          {
            area: areaItem._id,
            skip: (nextPage - 1) * DETAIL_PAGE_SIZE,
            limit: DETAIL_PAGE_SIZE,
            searchkey: nextSearch,
            sortBy,
            sortOrder,
          },
          "center-registration"
        );

        setDetailModal((prev) => ({
          ...prev,
          open: true,
          loading: false,
          area: areaItem,
          page: nextPage,
          search: nextSearch,
          sort: nextSort,
          rows: response?.data?.response || [],
          totalCount: Number(response?.data?.filterCount || 0),
          summary: buildCenterSummaryFromCounts(response?.data?.counts || {}),
        }));
      } catch (error) {
        setDetailModal((prev) => ({
          ...prev,
          open: true,
          loading: false,
          area: areaItem,
          page: nextPage,
          search: nextSearch,
          sort: nextSort,
          rows: [],
          totalCount: 0,
          summary: { ...emptyStats },
        }));
      }
    },
    [detailModal.search, detailModal.sort]
  );

  const openCenterPreview = useCallback(
    (areaItem) => {
      loadCenterPreview(areaItem, 1, {
        search: "",
        sort: centerSortOptions[0].value,
      });
    },
    [loadCenterPreview]
  );

  const closeDetailModal = () => {
    setDetailModal({
      open: false,
      area: null,
      rows: [],
      summary: { ...emptyStats },
      totalCount: 0,
      page: 1,
      search: "",
      sort: centerSortOptions[0].value,
      loading: false,
    });
  };

  const applyDetailFilters = () => {
    if (!detailModal.area) return;
    loadCenterPreview(detailModal.area, 1, {
      search: detailModal.search,
      sort: detailModal.sort,
    });
  };

  const exportDetailRows = async () => {
    if (!detailModal.area) return;

    const { sortBy, sortOrder } = parseSortValue(detailModal.sort, "nameOfCenter", "asc");
    const response = await getData(
      {
        area: detailModal.area._id,
        skip: 0,
        limit: 0,
        searchkey: detailModal.search,
        sortBy,
        sortOrder,
      },
      "center-registration"
    );

    const exportRows = (response?.data?.response || []).map((item) => ({
      "Centre Name": item.nameOfCenter || "",
      "Centre Type": item.centerType || "",
      "Affiliation No": item.affiliationNo || "",
      "Halqa Name": item.halqaName || "",
      "Male Students": item.studentsCountMale || 0,
      "Female Students": item.studentsCountFemale || 0,
      "Total Students": item.studentsCountTotal || 0,
    }));

    downloadCsvFile(`${detailModal.area.area || "area"}-centres.csv`, exportRows);
  };

  const downloadApplicationCertificate = async (centerId) => {
    if (!centerId) return;

    props.setLoaderBox?.(true);
    try {
      const response = await getData({ id: centerId }, "center-registration/download-affiliation");
      if (response?.data?.url) {
        window.open(import.meta.env.VITE_APP_CDN + response.data.url, "_blank");
      }
    } finally {
      props.setLoaderBox?.(false);
    }
  };

  const openQuickCenterModal = () => {
    setQuickCenterForm({
      nameOfCenter: "",
      centerType: "Male",
      halqaName: "",
      studentsCountMale: "0",
      studentsCountFemale: "0",
    });
    setQuickModal({ type: "center", area: detailModal.area });
  };

  const closeQuickModal = () => {
    setQuickModal({ type: "", area: null });
  };

  const openQuickDeleteModal = (item) => {
    setQuickDeleteModal({ open: true, item });
  };

  const closeQuickDeleteModal = () => {
    setQuickDeleteModal({ open: false, item: null });
  };

  const submitQuickCenter = async (event) => {
    event.preventDefault();
    if (!quickModal.area?._id || !quickCenterForm.nameOfCenter.trim() || !quickCenterForm.halqaName.trim()) return;

    setDetailSaving(true);
    try {
      const maleStudents = Number(quickCenterForm.studentsCountMale || 0);
      const femaleStudents = Number(quickCenterForm.studentsCountFemale || 0);
      await postData(
        {
          district: normalizeObjectId(quickModal.area.district),
          area: quickModal.area._id,
          nameOfCenter: quickCenterForm.nameOfCenter.trim(),
          centerType: quickCenterForm.centerType,
          halqaName: quickCenterForm.halqaName.trim(),
          studentsCountMale: quickCenterForm.centerType === "Female" ? 0 : maleStudents,
          studentsCountFemale: quickCenterForm.centerType === "Male" ? 0 : femaleStudents,
          studentsCountTotal: quickCenterForm.centerType === "Mixed" ? maleStudents + femaleStudents : 0,
        },
        "center-registration"
      );
      closeQuickModal();
      setLastUpdatedDate(new Date().toISOString());
      await loadCenterPreview(quickModal.area, 1, { search: detailModal.search, sort: detailModal.sort });
    } finally {
      setDetailSaving(false);
    }
  };

  const submitQuickDelete = async () => {
    if (!quickDeleteModal.item?._id || !detailModal.area) return;

    setDetailDeleting(true);
    try {
      await deleteData({ id: quickDeleteModal.item._id }, "center-registration");
      closeQuickDeleteModal();
      setLastUpdatedDate(new Date().toISOString());
      await loadCenterPreview(detailModal.area, 1, { search: detailModal.search, sort: detailModal.sort });
    } finally {
      setDetailDeleting(false);
    }
  };

  const actions = useMemo(
    () => [
      {
        element: "button",
        type: "callback",
        callback: (item, data) => openCenterPreview(data),
        icon: "center-registration",
        title: "View Centres",
        actionType: "button",
      },
    ],
    [openCenterPreview]
  );

  const attributes = useMemo(
    () => [
      {
        type: "text",
        placeholder: "Area",
        name: "area",
        validation: "",
        default: "",
        label: "Area",
        tag: true,
        required: false,
        view: true,
        add: true,
        update: true,
      },
      {
        type: "select",
        apiType: "API",
        selectApi: "district/select",
        placeholder: "District",
        name: "district",
        showItem: "district",
        validation: "",
        default: "",
        tag: true,
        label: "District",
        required: false,
        view: true,
        add: true,
        update: true,
        filter: true,
        export: true,
      },
      {
        type: "number",
        placeholder: "Centres",
        name: "studyCenterCount",
        validation: "",
        default: 0,
        label: "Centres",
        required: false,
        add: false,
        update: false,
        view: true,
        render: (value, data) => (
          <InteractiveBadge
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openCenterPreview(data);
            }}
          >
            <Building2 size={14} />
            <span>{Number(value || 0)} Centres</span>
          </InteractiveBadge>
        ),
      },
      {
        type: "number",
        placeholder: "Total Students",
        name: "totalStudents",
        validation: "",
        default: 0,
        label: "Students",
        required: false,
        add: false,
        update: false,
        view: true,
      },
    ],
    [openCenterPreview]
  );

  return (
    <Container className="noshadow">
      <PageWrap>
        <DistrictPageHeader title="Area" description="Manage areas in the same district-style workspace and drill down into centre-level activity without leaving the page." />

        <DistrictOverviewCards cards={overviewCards} />

        <ListTable
          actions={actions}
          api={`area`}
          itemTitle={{
            name: "area",
            type: "text",
            collection: "",
          }}
          showTitle={false}
          shortName={`Area`}
          formMode={`single`}
          attributes={attributes}
          labels={[]}
          exportPrivilege={true}
          surfaceTheme={"district"}
          lastUpdateDate={lastUpdatedDate}
          {...props}
        ></ListTable>

        {detailModal.open ? (
          <ModalBackdrop onClick={closeDetailModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>{detailModal.area?.area || "Area"} Study Centres</h3>
                <p>Review centre distribution, student counts, export the list, or add/delete centres directly inside this area.</p>
              </ModalTitle>

              <PreviewToolbar>
                <PreviewHeaderActions>
                  <ActionButton className="secondary" onClick={exportDetailRows} disabled={detailModal.loading || detailModal.totalCount === 0}>
                    <Download size={16} />
                    <span>Export CSV</span>
                  </ActionButton>
                  <ActionButton className="primary" onClick={openQuickCenterModal}>
                    <Plus size={16} />
                    <span>Add Study Centre</span>
                  </ActionButton>
                  <ActionButton className="ghost" onClick={closeDetailModal}>
                    <X size={16} />
                    <span>Close</span>
                  </ActionButton>
                </PreviewHeaderActions>

                <PreviewSummaryGrid>
                  <PreviewStatCard>
                    <PreviewStatLabel>Total Centres</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary.studyCenterCount}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Male / Female / Mixed</PreviewStatLabel>
                    <PreviewStatValue>{`${detailModal.summary.maleCenterCount} / ${detailModal.summary.femaleCenterCount} / ${detailModal.summary.mixedCenterCount}`}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Male Students</PreviewStatLabel>
                    <PreviewStatValue>{detailModal.summary.maleStudentCount}</PreviewStatValue>
                  </PreviewStatCard>
                  <PreviewStatCard>
                    <PreviewStatLabel>Female / Total Students</PreviewStatLabel>
                    <PreviewStatValue>{`${detailModal.summary.femaleStudentCount} / ${detailModal.summary.totalStudents}`}</PreviewStatValue>
                  </PreviewStatCard>
                </PreviewSummaryGrid>

                <PreviewFilterRow>
                  <PreviewFilterGroup>
                    <PreviewFilterField>
                      <span>Search</span>
                      <input
                        value={detailModal.search}
                        onChange={(event) => setDetailModal((prev) => ({ ...prev, search: event.target.value }))}
                        placeholder="Search by centre, affiliation or halqa"
                      />
                    </PreviewFilterField>
                    <PreviewFilterField>
                      <span>Sort</span>
                      <select value={detailModal.sort} onChange={(event) => setDetailModal((prev) => ({ ...prev, sort: event.target.value }))}>
                        {centerSortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </PreviewFilterField>
                  </PreviewFilterGroup>
                  <PreviewHeaderActions>
                    <ActionButton className="secondary" onClick={applyDetailFilters} disabled={detailModal.loading}>
                      Apply Filters
                    </ActionButton>
                  </PreviewHeaderActions>
                </PreviewFilterRow>
              </PreviewToolbar>

              {detailModal.loading ? (
                <EmptyState>Loading centre preview...</EmptyState>
              ) : detailModal.rows.length === 0 ? (
                <EmptyState>No study centres found for this area.</EmptyState>
              ) : (
                <PreviewList>
                  {detailModal.rows.map((centerItem) => (
                    <PreviewRow key={centerItem._id}>
                      <PreviewIdentity>
                        <PreviewName>{centerItem.nameOfCenter || "Unnamed Centre"}</PreviewName>
                        <PreviewSubline>{centerItem.halqaName ? `Halqa: ${centerItem.halqaName}` : "Halqa not provided"}</PreviewSubline>
                        <BadgeWrap>
                          {centerItem.centerType ? <Badge>{centerItem.centerType}</Badge> : null}
                          {centerItem.affiliationNo ? <Badge>{centerItem.affiliationNo}</Badge> : null}
                          {centerItem.centerCode ? <Badge>{centerItem.centerCode}</Badge> : null}
                        </BadgeWrap>
                      </PreviewIdentity>

                      <BadgeWrap>
                        <Badge>{`Male Students: ${centerItem.studentsCountMale || 0}`}</Badge>
                        <Badge>{`Female Students: ${centerItem.studentsCountFemale || 0}`}</Badge>
                        <Badge>{`Total Students: ${centerItem.studentsCountTotal || 0}`}</Badge>
                      </BadgeWrap>

                      <PreviewRowActions>
                        <ActionButton className="secondary" onClick={() => downloadApplicationCertificate(centerItem._id)}>
                          <Download size={16} />
                          <span>Download Application Certificate</span>
                        </ActionButton>
                        <ActionButton className="danger" onClick={() => openQuickDeleteModal(centerItem)}>
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </ActionButton>
                      </PreviewRowActions>
                    </PreviewRow>
                  ))}
                </PreviewList>
              )}

              {detailModal.totalCount > DETAIL_PAGE_SIZE ? (
                <PreviewPaginationBar>
                  <PreviewPaginationMeta>
                    Page {detailModal.page} of {Math.max(1, Math.ceil(detailModal.totalCount / DETAIL_PAGE_SIZE))} • {detailModal.totalCount} centres
                  </PreviewPaginationMeta>
                  <PreviewHeaderActions>
                    <ActionButton className="ghost" onClick={() => loadCenterPreview(detailModal.area, detailModal.page - 1)} disabled={detailModal.page <= 1 || detailModal.loading}>
                      Previous
                    </ActionButton>
                    <ActionButton
                      className="ghost"
                      onClick={() => loadCenterPreview(detailModal.area, detailModal.page + 1)}
                      disabled={detailModal.page >= Math.ceil(detailModal.totalCount / DETAIL_PAGE_SIZE) || detailModal.loading}
                    >
                      Next
                    </ActionButton>
                  </PreviewHeaderActions>
                </PreviewPaginationBar>
              ) : null}
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {quickModal.type === "center" ? (
          <ModalBackdrop onClick={closeQuickModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>
                <h3>Add Study Centre</h3>
                <p>Create a study centre directly inside {quickModal.area?.area}.</p>
              </ModalTitle>

              <FormGrid onSubmit={submitQuickCenter}>
                <Field>
                  <span>District</span>
                  <input value={quickModal.area?.district?.district || ""} disabled />
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

        {quickDeleteModal.open ? (
          <ModalBackdrop onClick={closeQuickDeleteModal}>
            <ModalCard onClick={(event) => event.stopPropagation()} style={{ width: "min(100%, 480px)" }}>
              <ModalTitle>
                <h3>Delete Study Centre</h3>
                <p>This will remove the selected study centre immediately.</p>
              </ModalTitle>

              <ModalActions>
                <ActionButton className="ghost" onClick={closeQuickDeleteModal} disabled={detailDeleting}>
                  Cancel
                </ActionButton>
                <ActionButton className="danger" onClick={submitQuickDelete} disabled={detailDeleting}>
                  {detailDeleting ? "Deleting..." : "Delete Centre"}
                </ActionButton>
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        ) : null}
      </PageWrap>
    </Container>
  );
};

export default Layout(Area);
