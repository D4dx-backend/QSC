// Phase 3 — Admin Data Reset page.
// Shows counts for every "user-input" collection and lets the admin tick
// which ones to wipe. A typed-confirmation guard ("RESET") is required
// before the destructive POST is fired, matching the server-side check.
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { GetAccessToken } from "../../../../backend/authentication";
import { getData } from "../../../../backend/api";
import { buildApiUrl } from "../../../../backend/baseUrl";

const POST = async (body, url) => {
  const token = GetAccessToken();
  return axios.post(buildApiUrl(url), body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const DataReset = (props) => {
  useEffect(() => {
    document.title = `Data Reset - QSC Automation`;
  }, []);

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getData({}, "data-reset/stats");
      setStats(r?.data?.response || {});
    } catch (e) {
      props.setMessage?.({
        type: 1,
        content: e?.response?.data?.message || "Failed to load counts.",
        proceed: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const keys = useMemo(() => Object.keys(stats), [stats]);
  const selectedKeys = useMemo(() => keys.filter((k) => selected[k]), [keys, selected]);
  const totalSelectedRows = useMemo(
    () => selectedKeys.reduce((acc, k) => acc + (stats[k]?.count || 0), 0),
    [selectedKeys, stats]
  );

  const toggle = (k) => setSelected((s) => ({ ...s, [k]: !s[k] }));
  const selectAll = () => {
    const next = {};
    keys.forEach((k) => {
      next[k] = true;
    });
    setSelected(next);
  };
  const clearAll = () => setSelected({});

  const runReset = async () => {
    if (!selectedKeys.length) {
      props.setMessage?.({ type: 1, content: "Pick at least one dataset.", proceed: "Okay" });
      return;
    }
    if (confirmation !== "RESET") {
      props.setMessage?.({
        type: 1,
        content: 'Type RESET (uppercase) in the confirmation box to proceed.',
        proceed: "Okay",
      });
      return;
    }
    // Final browser-level confirm so a stray click can't wipe live data.
    const ok = window.confirm(
      `This will permanently delete ${totalSelectedRows} records across ${selectedKeys.length} collection(s).\n\nThis action cannot be undone. Continue?`
    );
    if (!ok) return;

    setRunning(true);
    try {
      const r = await POST({ datasets: selectedKeys, confirmation: "RESET" }, "data-reset");
      if (r?.data?.success) {
        setLastResult(r.data.response || {});
        setSelected({});
        setConfirmation("");
        await load();
        props.setMessage?.({ type: 2, content: "Reset completed.", proceed: "Okay" });
      } else {
        props.setMessage?.({
          type: 1,
          content: r?.data?.message || "Reset failed.",
          proceed: "Okay",
        });
      }
    } catch (e) {
      props.setMessage?.({
        type: 1,
        content: e?.response?.data?.message || e.message,
        proceed: "Okay",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Container className="noshadow" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div style={{ padding: 20, maxWidth: 960 }}>
        <h2 style={{ margin: "0 0 4px" }}>Data Reset</h2>
        <p style={{ marginTop: 0, color: "#64748b" }}>
          Clear operational data before starting a new exam cycle. Master data
          (districts, areas, exam types, menus, users, syllabus, exam settings)
          is never touched by this page.
        </p>

        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            color: "#9a3412",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <strong>Warning:</strong> Deletions are permanent. This action cannot be undone. Export
          any data you want to keep before proceeding.
        </div>

        {loading ? (
          <p>Loading counts…</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button onClick={selectAll} style={btnGhost}>
                Select all
              </button>
              <button onClick={clearAll} style={btnGhost}>
                Clear
              </button>
              <button onClick={load} style={btnGhost}>
                Refresh counts
              </button>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead style={{ background: "#f8fafc" }}>
                  <tr>
                    <th style={th} width="40"></th>
                    <th style={th}>Dataset</th>
                    <th style={th}>Description</th>
                    <th style={{ ...th, textAlign: "right" }}>Rows</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => {
                    const row = stats[k] || {};
                    return (
                      <tr key={k} style={{ borderTop: "1px solid #edf2f7" }}>
                        <td style={td}>
                          <input
                            type="checkbox"
                            checked={!!selected[k]}
                            onChange={() => toggle(k)}
                          />
                        </td>
                        <td style={{ ...td, fontWeight: 600 }}>{row.label || k}</td>
                        <td style={{ ...td, color: "#475569" }}>{row.description || ""}</td>
                        <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                          {row.count ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <label style={{ fontSize: 13, color: "#475569" }}>
                Type <code style={{ background: "#fee2e2", padding: "2px 6px", borderRadius: 4 }}>RESET</code> to confirm:
              </label>
              <input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="RESET"
                style={{
                  padding: "8px 10px",
                  border: "1px solid #cbd5e0",
                  borderRadius: 6,
                  width: 160,
                }}
              />
              <button
                onClick={runReset}
                disabled={running || !selectedKeys.length || confirmation !== "RESET"}
                style={{
                  ...btnDanger,
                  opacity: running || !selectedKeys.length || confirmation !== "RESET" ? 0.5 : 1,
                }}
              >
                {running
                  ? "Resetting…"
                  : `Reset ${selectedKeys.length || ""} collection${selectedKeys.length === 1 ? "" : "s"} (${totalSelectedRows} rows)`}
              </button>
            </div>

            {lastResult && (
              <div
                style={{
                  marginTop: 20,
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <h4 style={{ margin: "0 0 6px" }}>Last reset summary</h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                  {Object.entries(lastResult).map(([k, v]) => (
                    <li key={k}>
                      <strong>{v.label || k}:</strong> deleted {v.deleted} / {v.before}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

const th = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 13,
  color: "#334155",
  fontWeight: 600,
};
const td = { padding: "10px 12px", verticalAlign: "top" };
const btnGhost = {
  padding: "6px 12px",
  background: "#f1f5f9",
  border: "1px solid #cbd5e0",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
};
const btnDanger = {
  padding: "10px 16px",
  background: "#dc2626",
  color: "#fff",
  border: 0,
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

export default Layout(DataReset);
