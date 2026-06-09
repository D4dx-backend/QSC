import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, patchJson } from "../../../../backend/api";
import { GetAccessToken } from "../../../../backend/authentication";
import { buildApiUrl } from "../../../../backend/baseUrl";
import axios from "axios";

const PUT = async (body, url) => {
  // there is no putJson helper in backend/api; inline call.
  const token = GetAccessToken();
  return axios.put(buildApiUrl(url), body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const ExamSettingsPage = (props) => {
  useEffect(() => {
    document.title = `Exam Settings - QSC Automation`;
  }, []);

  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    minCountForExamCentre: 5,
    autoRecomputeOnSubmit: true,
    allocationLocked: false,
    year: new Date().getFullYear(),
  });

  const load = async () => {
    const r = await getData({}, "exam-settings");
    const d = r?.data?.data;
    setSettings(d || null);
    if (d) {
      setForm({
        minCountForExamCentre: d.minCountForExamCentre ?? 5,
        autoRecomputeOnSubmit: !!d.autoRecomputeOnSubmit,
        allocationLocked: !!d.allocationLocked,
        year: d.year ?? new Date().getFullYear(),
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const r = await PUT(form, "exam-settings");
      if (r?.data?.success) {
        props.setMessage?.({ type: 2, content: "Settings saved.", proceed: "Okay" });
        await load();
      } else {
        props.setMessage?.({ type: 1, content: "Could not save settings.", proceed: "Okay" });
      }
    } catch (e) {
      props.setMessage?.({ type: 1, content: e?.response?.data?.message || e.message, proceed: "Okay" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="noshadow">
      <div style={{ padding: 16, maxWidth: 640 }}>
        <h3 style={{ margin: "0 0 12px" }}>Exam Settings</h3>
        <p style={{ color: "#666", marginTop: 0 }}>
          These settings control automatic exam-centre allocation. Study centres with fewer than the
          minimum number of registrations are merged into the nearest centre in the same district.
        </p>

        <Row>
          <Label>Exam Year</Label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) || form.year })}
            style={input}
          />
        </Row>

        <Row>
          <Label>Minimum registrations per exam centre</Label>
          <input
            type="number"
            min={1}
            value={form.minCountForExamCentre}
            onChange={(e) =>
              setForm({ ...form, minCountForExamCentre: Math.max(1, parseInt(e.target.value, 10) || 1) })
            }
            style={input}
          />
        </Row>

        <Row>
          <Label>Auto-recompute on each submission</Label>
          <input
            type="checkbox"
            checked={form.autoRecomputeOnSubmit}
            onChange={(e) => setForm({ ...form, autoRecomputeOnSubmit: e.target.checked })}
          />
          <small style={{ marginLeft: 10, color: "#718096" }}>
            Re-runs allocation after every new registration.
          </small>
        </Row>

        <Row>
          <Label>Lock allocation</Label>
          <input
            type="checkbox"
            checked={form.allocationLocked}
            onChange={(e) => setForm({ ...form, allocationLocked: e.target.checked })}
          />
          <small style={{ marginLeft: 10, color: "#c05621" }}>
            When ON, allocation cannot be re-run. Enable this after hall tickets are distributed.
          </small>
        </Row>

        {settings?.allocationLockedAt && (
          <p style={{ fontSize: 12, color: "#718096" }}>
            Last locked at: {new Date(settings.allocationLockedAt).toLocaleString()}
          </p>
        )}

        <button
          onClick={save}
          disabled={saving}
          style={{
            marginTop: 16,
            padding: "10px 18px",
            background: "#2b6cb0",
            color: "#fff",
            border: 0,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </Container>
  );
};

const Row = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}>{children}</div>
);
const Label = ({ children }) => (
  <span style={{ width: 280, color: "#2d3748", fontWeight: 500 }}>{children}</span>
);
const input = { padding: "6px 10px", border: "1px solid #cbd5e0", borderRadius: 4, width: 140 };

export default Layout(ExamSettingsPage);
