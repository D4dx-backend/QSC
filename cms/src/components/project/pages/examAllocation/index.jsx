import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import CustomSelect from "../../../core/select";
import { getData, postJson, patchJson } from "../../../../backend/api";

const ExamAllocation = (props) => {
  useEffect(() => {
    document.title = `Exam Allocation - QSC Automation`;
  }, []);

  const [districts, setDistricts] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selDistrict, setSelDistrict] = useState("");
  const [selExamType, setSelExamType] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recomputing, setRecomputing] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await getData({}, "district/select");
      setDistricts(d?.data?.response || d?.data || []);
      const t = await getData({}, "exam-type/select");
      setExamTypes(t?.data?.response || t?.data || []);
    })();
  }, []);

  // When a district is selected, load its centres so we can render names in the table.
  useEffect(() => {
    if (!selDistrict) {
      setCenters([]);
      return;
    }
    (async () => {
      const r = await getData({ district: selDistrict }, "center-registration/select");
      const list = r?.data?.response || r?.data || [];
      setCenters(list);
    })();
  }, [selDistrict]);

  const centreMap = React.useMemo(() => {
    const m = new Map();
    for (const c of centers) m.set(String(c.id || c._id), c.value || c.nameOfCenter);
    return m;
  }, [centers]);

  const loadSummary = async () => {
    if (!selDistrict || !selExamType) {
      props.setMessage?.({ type: 1, content: "Select district and exam type", proceed: "Okay" });
      return;
    }
    setLoading(true);
    try {
      const r = await getData({ district: selDistrict, examType: selExamType }, "exam-allocation/summary");
      setSummary(r?.data || null);
    } finally {
      setLoading(false);
    }
  };

  const recompute = async () => {
    setRecomputing(true);
    try {
      const body = {};
      if (selDistrict) body.district = selDistrict;
      if (selExamType) body.examType = selExamType;
      const r = await postJson(body, "exam-allocation/recompute");
      props.setMessage?.({
        type: r?.data?.skipped ? 1 : 2,
        content: r?.data?.skipped
          ? `Skipped: ${r?.data?.reason || "locked"}`
          : `Recomputed ${r?.data?.results?.length || 0} group(s).`,
        proceed: "Okay",
      });
      if (selDistrict && selExamType) await loadSummary();
    } finally {
      setRecomputing(false);
    }
  };

  // Transform byHome aggregate into per-centre rows:
  //   homeCentre, count, assignedCentre (most common), clubbed
  const rows = React.useMemo(() => {
    if (!summary?.byHome) return [];
    const grouped = new Map(); // homeId -> { count, byAssigned: Map }
    for (const entry of summary.byHome) {
      const homeId = entry._id.home ? String(entry._id.home) : "__NONE__";
      const assignedId = entry._id.assigned ? String(entry._id.assigned) : null;
      const clubbed = !!entry._id.clubbed;
      if (!grouped.has(homeId)) grouped.set(homeId, { count: 0, assigned: new Map(), clubbed: false });
      const g = grouped.get(homeId);
      g.count += entry.count;
      g.clubbed = g.clubbed || clubbed;
      if (assignedId) g.assigned.set(assignedId, (g.assigned.get(assignedId) || 0) + entry.count);
    }
    return [...grouped.entries()]
      .map(([homeId, g]) => {
        // pick the dominant assignment
        let assignedTop = null;
        let top = -1;
        for (const [id, n] of g.assigned.entries()) if (n > top) { top = n; assignedTop = id; }
        return {
          homeId,
          count: g.count,
          assignedId: assignedTop,
          clubbed: g.clubbed,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [summary]);

  return (
    <Container className="noshadow">
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 12px" }}>Exam Allocation</h3>
        <p style={{ marginTop: 0, color: "#666" }}>
          Study centres are used as exam centres. Centres with fewer than the configured minimum
          ({summary?.minCount ?? "?"}) are automatically merged into the nearest centre in the same district.
          {summary?.locked ? " (Allocation is currently LOCKED — recompute is disabled.)" : ""}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end", marginBottom: 16 }}>
          <div style={{ minWidth: 260 }}>
            <label style={{ fontSize: 13 }}>District</label>
            <CustomSelect
              options={districts.map((d) => ({ id: d.id || d._id, value: d.value || d.district }))}
              value={selDistrict}
              onChange={(o) => setSelDistrict(o?.id || "")}
              placeholder="Select District"
            />
          </div>
          <div style={{ minWidth: 260 }}>
            <label style={{ fontSize: 13 }}>Exam Type</label>
            <CustomSelect
              options={examTypes.map((t) => ({ id: t.id || t._id, value: t.value || t.examType }))}
              value={selExamType}
              onChange={(o) => setSelExamType(o?.id || "")}
              placeholder="Select Exam Type"
            />
          </div>
          <button
            onClick={loadSummary}
            disabled={loading || !selDistrict || !selExamType}
            style={{ padding: "8px 14px", background: "#2b6cb0", color: "#fff", border: 0, borderRadius: 6 }}
          >
            {loading ? "Loading…" : "Load Summary"}
          </button>
          <button
            onClick={recompute}
            disabled={recomputing || summary?.locked}
            style={{ padding: "8px 14px", background: "#dd6b20", color: "#fff", border: 0, borderRadius: 6 }}
          >
            {recomputing ? "Recomputing…" : "Recompute Allocation"}
          </button>
        </div>

        {summary && (
          <div style={{ marginTop: 12, overflow: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: "#f7fafc" }}>
                <tr>
                  <th style={th}>#</th>
                  <th style={th}>Home Study Centre</th>
                  <th style={th}>Registrations</th>
                  <th style={th}>Assigned Exam Centre</th>
                  <th style={th}>Clubbed?</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 16, textAlign: "center", color: "#718096" }}>
                      No registrations for this selection.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={r.homeId} style={{ borderTop: "1px solid #edf2f7" }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}>{centreMap.get(r.homeId) || r.homeId}</td>
                    <td style={td}>{r.count}</td>
                    <td style={td}>{r.assignedId ? centreMap.get(r.assignedId) || r.assignedId : "—"}</td>
                    <td style={{ ...td, color: r.clubbed ? "#c05621" : "#38a169", fontWeight: 600 }}>
                      {r.clubbed ? "YES" : "NO"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
};

const th = { padding: "10px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e2e8f0" };
const td = { padding: "8px 12px", verticalAlign: "top" };

export default Layout(ExamAllocation);
