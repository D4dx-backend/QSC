import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import CustomSelect from "../../../core/select";
import { getData } from "../../../../backend/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Phase 2.6 — Rank list viewer & PDF exporter.
// Lets an admin pick a scope (state / district / area / study centre) + exam
// and see a ranked table of candidates, with a print-ready PDF.
const RankList = (props) => {
  useEffect(() => {
    document.title = `Rank List - QSC Automation`;
  }, []);

  const [scope, setScope] = useState("district"); // default to district, matches common use-case
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [centres, setCentres] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

  const [selDistrict, setSelDistrict] = useState("");
  const [selArea, setSelArea] = useState("");
  const [selCentre, setSelCentre] = useState("");
  const [selExamType, setSelExamType] = useState("");
  // Phase 3 — optional Private/Regular filter. "" = All.
  const [selStatus, setSelStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  // Bootstrap static dropdowns.
  useEffect(() => {
    (async () => {
      const [d, t] = await Promise.all([
        getData({}, "district/select"),
        getData({}, "exam-type/select"),
      ]);
      setDistricts(d?.data?.response || d?.data || []);
      setExamTypes(t?.data?.response || t?.data || []);
    })();
  }, []);

  // Areas depend on district.
  useEffect(() => {
    if (!selDistrict) {
      setAreas([]);
      setSelArea("");
      return;
    }
    (async () => {
      const r = await getData({ district: selDistrict }, "area/get-area-by-district");
      setAreas(r?.data?.response || r?.data || []);
    })();
  }, [selDistrict]);

  // Centres depend on district.
  useEffect(() => {
    if (!selDistrict) {
      setCentres([]);
      setSelCentre("");
      return;
    }
    (async () => {
      const r = await getData({ district: selDistrict }, "center-registration/select");
      setCentres(r?.data?.response || r?.data || []);
    })();
  }, [selDistrict]);

  // Reset secondary selections when scope changes.
  useEffect(() => {
    setSelArea("");
    setSelCentre("");
  }, [scope]);

  const scopeId = useMemo(() => {
    if (scope === "state") return null;
    if (scope === "district") return selDistrict || null;
    if (scope === "area") return selArea || null;
    if (scope === "centerRegistration") return selCentre || null;
    return null;
  }, [scope, selDistrict, selArea, selCentre]);

  const canLoad = !!selExamType && (scope === "state" || !!scopeId);

  const load = async () => {
    if (!canLoad) {
      props.setMessage?.({
        type: 1,
        content: "Select exam type and scope.",
        proceed: "Okay",
      });
      return;
    }
    setLoading(true);
    try {
      const params = { scope, examType: selExamType };
      if (scopeId) params.scopeId = scopeId;
      if (selStatus) params.status = selStatus;
      const r = await getData(params, "exam-score/ranklist");
      setRows(r?.data?.response || []);
    } finally {
      setLoading(false);
    }
  };

  const scopeTitle = useMemo(() => {
    if (scope === "state") return "STATE";
    if (scope === "district") {
      const d = districts.find((x) => String(x.id || x._id) === String(selDistrict));
      return `DISTRICT — ${d?.value || d?.district || ""}`;
    }
    if (scope === "area") {
      const a = areas.find((x) => String(x.id || x._id) === String(selArea));
      return `AREA — ${a?.value || a?.area || ""}`;
    }
    if (scope === "centerRegistration") {
      const c = centres.find((x) => String(x.id || x._id) === String(selCentre));
      return `STUDY CENTRE — ${c?.value || c?.nameOfCenter || ""}`;
    }
    return "";
  }, [scope, districts, areas, centres, selDistrict, selArea, selCentre]);

  const examTitle = useMemo(() => {
    const e = examTypes.find((x) => String(x.id || x._id) === String(selExamType));
    return e?.value || e?.examType || "";
  }, [examTypes, selExamType]);

  const downloadPdf = () => {
    if (!rows.length) {
      props.setMessage?.({ type: 1, content: "Load a list first.", proceed: "Okay" });
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString("en-GB");

    doc.setFontSize(14);
    doc.text("Rank List", w / 2, 28, { align: "center" });
    doc.setFontSize(11);
    doc.text(scopeTitle, w / 2, 46, { align: "center" });
    const statusLabel = selStatus ? `  |  ${selStatus} only` : "";
    doc.text(`Exam: ${examTitle}${statusLabel}  |  Total: ${rows.length}  |  Printed: ${today}`, w / 2, 62, {
      align: "center",
    });

    doc.autoTable({
      startY: 76,
      head: [["Rank", "Reg No", "Name", "P/R", "Score", "Grade", "Centre", "Area", "District"]],
      body: rows.map((r) => [
        r.rank,
        r.regno || "-",
        r.name || "-",
        r.status ? r.status.charAt(0) : "-",
        r.score ?? "-",
        r.grade || "-",
        r.centre || "-",
        r.area || "-",
        r.district || "-",
      ]),
      styles: { fontSize: 8, cellPadding: 3, lineColor: 0, lineWidth: 0.2, textColor: 0 },
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      theme: "grid",
      columnStyles: {
        0: { halign: "center", cellWidth: 36, fontStyle: "bold" },
        3: { halign: "center", cellWidth: 24 },
        4: { halign: "center", cellWidth: 40 },
        5: { halign: "center", cellWidth: 40 },
      },
    });

    doc.save(`RankList-${scopeTitle.replace(/\s+/g, "-")}-${today.replace(/\//g, "-")}.pdf`);
  };

  return (
    <Container className="noshadow">
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 12px" }}>Rank List</h3>
        <p style={{ marginTop: 0, color: "#666" }}>
          View and print the rank list of candidates within a chosen scope. Ranks use dense
          ranking (ties share the same rank).
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end", marginBottom: 16 }}>
          <div style={{ minWidth: 200 }}>
            <label style={{ fontSize: 13 }}>Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid #cbd5e0", borderRadius: 6, width: "100%" }}
            >
              <option value="state">State</option>
              <option value="district">District</option>
              <option value="area">Area</option>
              <option value="centerRegistration">Study Centre</option>
            </select>
          </div>

          {(scope === "district" || scope === "area" || scope === "centerRegistration") && (
            <div style={{ minWidth: 220 }}>
              <label style={{ fontSize: 13 }}>District</label>
              <CustomSelect
                options={districts.map((d) => ({ id: d.id || d._id, value: d.value || d.district }))}
                value={selDistrict}
                onChange={(o) => setSelDistrict(o?.id || "")}
                placeholder="Select District"
              />
            </div>
          )}

          {scope === "area" && (
            <div style={{ minWidth: 220 }}>
              <label style={{ fontSize: 13 }}>Area</label>
              <CustomSelect
                options={areas.map((a) => ({ id: a.id || a._id, value: a.value || a.area }))}
                value={selArea}
                onChange={(o) => setSelArea(o?.id || "")}
                placeholder="Select Area"
              />
            </div>
          )}

          {scope === "centerRegistration" && (
            <div style={{ minWidth: 260 }}>
              <label style={{ fontSize: 13 }}>Study Centre</label>
              <CustomSelect
                options={centres.map((c) => ({ id: c.id || c._id, value: c.value || c.nameOfCenter }))}
                value={selCentre}
                onChange={(o) => setSelCentre(o?.id || "")}
                placeholder="Select Centre"
              />
            </div>
          )}

          <div style={{ minWidth: 260 }}>
            <label style={{ fontSize: 13 }}>Exam Type</label>
            <CustomSelect
              options={examTypes.map((t) => ({ id: t.id || t._id, value: t.value || t.examType }))}
              value={selExamType}
              onChange={(o) => setSelExamType(o?.id || "")}
              placeholder="Select Exam Type"
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <label style={{ fontSize: 13 }}>Mode</label>
            <select
              value={selStatus}
              onChange={(e) => setSelStatus(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid #cbd5e0", borderRadius: 6, width: "100%" }}
            >
              <option value="">All (Private + Regular)</option>
              <option value="Regular">Regular only</option>
              <option value="Private">Private only</option>
            </select>
          </div>

          <button
            onClick={load}
            disabled={loading || !canLoad}
            style={{ padding: "8px 14px", background: "#2b6cb0", color: "#fff", border: 0, borderRadius: 6 }}
          >
            {loading ? "Loading…" : "Load Rank List"}
          </button>
          <button
            onClick={downloadPdf}
            disabled={!rows.length}
            style={{ padding: "8px 14px", background: "#38a169", color: "#fff", border: 0, borderRadius: 6 }}
          >
            Download PDF
          </button>
        </div>

        {rows.length > 0 && (
          <div style={{ marginTop: 4, overflow: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: "#f7fafc", position: "sticky", top: 0 }}>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>Reg No</th>
                  <th style={th}>Name</th>
                  <th style={th}>P/R</th>
                  <th style={{ ...th, textAlign: "center" }}>Score</th>
                  <th style={{ ...th, textAlign: "center" }}>Grade</th>
                  <th style={th}>Centre</th>
                  <th style={th}>Area</th>
                  <th style={th}>District</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} style={{ borderTop: "1px solid #edf2f7" }}>
                    <td style={{ ...td, fontWeight: 700, color: "#2b6cb0" }}>#{r.rank}</td>
                    <td style={td}>{r.regno || "-"}</td>
                    <td style={td}>{r.name || "-"}</td>
                    <td style={td}>{r.status ? r.status.charAt(0) : "-"}</td>
                    <td style={{ ...td, textAlign: "center" }}>{r.score ?? "-"}</td>
                    <td style={{ ...td, textAlign: "center" }}>{r.grade || "-"}</td>
                    <td style={td}>{r.centre || "-"}</td>
                    <td style={td}>{r.area || "-"}</td>
                    <td style={td}>{r.district || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && rows.length === 0 && (
          <p style={{ color: "#888", marginTop: 12 }}>
            No candidates loaded yet. Select scope + exam type and click Load.
          </p>
        )}
      </div>
    </Container>
  );
};

const th = { padding: "10px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e2e8f0" };
const td = { padding: "8px 12px", verticalAlign: "top" };

export default Layout(RankList);
