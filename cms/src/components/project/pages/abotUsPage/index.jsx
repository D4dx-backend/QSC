import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Save,
  RefreshCw,
  ImagePlus,
  Trash2,
  Mail,
  Phone,
  Info,
  Globe2,
  AlertTriangle,
  Upload,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, postData, putData, deleteData } from "../../../../backend/api";

// Phase — About Us admin redesign.
// The public site reads a single About Us document (footer text, banners,
// vision page content). Historically this page used a generic ListTable that
// lets admins add multiple records — confusing, because only the first one is
// ever rendered on the site. This screen edits ONE document in place: create
// if nothing exists, update otherwise. Extra legacy rows can be cleaned up
// with a one-click "Keep only the latest" button.

const CDN = import.meta.env.VITE_APP_CDN || "";

const EMPTY_FORM = {
  title: "",
  description: "",
  landingTitle: "",
  landingDescription: "",
  email: "",
  mobile: "",
  footerText: "",
  image: "",
  landingMainbanner: "",
};

const AboutUs = (props) => {
  useEffect(() => {
    document.title = "About Us - QSC Automation";
  }, []);

  const [records, setRecords] = useState([]);
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [initial, setInitial] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null); // about page banner
  const [bannerFile, setBannerFile] = useState(null); // landing main banner
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getData({ skip: 0, limit: 50 }, "about-us");
      const list = r?.data?.response || [];
      setRecords(list);

      const row = list[0];
      if (row) {
        const next = {
          title: row.title || "",
          description: row.description || "",
          landingTitle: row.landingTitle || "",
          landingDescription: row.landingDescription || "",
          email: row.email || "",
          mobile: row.mobile || "",
          footerText: row.footerText || "",
          image: row.image || "",
          landingMainbanner: row.landingMainbanner || "",
        };
        setRecordId(row._id || null);
        setForm(next);
        setInitial(next);
      } else {
        setRecordId(null);
        setForm(EMPTY_FORM);
        setInitial(EMPTY_FORM);
      }
      setImageFile(null);
      setBannerFile(null);
    } catch (e) {
      props.setMessage?.({
        type: 1,
        content: e?.response?.data?.message || "Could not load About Us content.",
        proceed: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const duplicateCount = Math.max(0, records.length - 1);
  const isDirty = useMemo(() => {
    if (imageFile || bannerFile) return true;
    return Object.keys(EMPTY_FORM).some((k) => (form[k] || "") !== (initial[k] || ""));
  }, [form, initial, imageFile, bannerFile]);

  const handleChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = () => {
    const missing = [];
    if (!form.title?.trim()) missing.push("About Title");
    if (!form.description?.trim()) missing.push("About Description");
    if (!form.landingTitle?.trim()) missing.push("Landing Title");
    if (!form.landingDescription?.trim()) missing.push("Landing Description");
    if (!form.email?.trim()) missing.push("Email");
    if (!form.mobile?.trim()) missing.push("Mobile");
    if (!form.footerText?.trim()) missing.push("Footer Text");
    if (!recordId && !imageFile) missing.push("About Banner image");
    if (!recordId && !bannerFile) missing.push("Landing Main Banner image");
    return missing;
  };

  const save = async () => {
    const missing = validate();
    if (missing.length) {
      props.setMessage?.({
        type: 1,
        content: `Please fill: ${missing.join(", ")}`,
        proceed: "Okay",
      });
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      landingTitle: form.landingTitle,
      landingDescription: form.landingDescription,
      email: form.email,
      mobile: form.mobile,
      footerText: form.footerText,
    };
    if (imageFile) payload.image = imageFile;
    if (bannerFile) payload.landingMainbanner = bannerFile;

    setSaving(true);
    try {
      const res = recordId
        ? await putData({ id: recordId, ...payload }, "about-us")
        : await postData(payload, "about-us");
      if (res?.data?.success) {
        props.setMessage?.({
          type: 2,
          content: recordId ? "About Us updated." : "About Us created.",
          proceed: "Okay",
        });
        await load();
      } else {
        props.setMessage?.({
          type: 1,
          content: res?.data?.message || "Could not save About Us.",
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
      setSaving(false);
    }
  };

  const cleanupDuplicates = async () => {
    if (!duplicateCount) return;
    const ok = window.confirm(
      `Found ${duplicateCount} older About Us record(s). Keep only the newest and delete the rest?`
    );
    if (!ok) return;
    setCleaning(true);
    try {
      const extras = records.slice(1);
      for (const row of extras) {
        if (row?._id) await deleteData({ id: row._id }, "about-us");
      }
      props.setMessage?.({
        type: 2,
        content: `Removed ${extras.length} duplicate record(s).`,
        proceed: "Okay",
      });
      await load();
    } catch (e) {
      props.setMessage?.({
        type: 1,
        content: e?.response?.data?.message || e.message,
        proceed: "Okay",
      });
    } finally {
      setCleaning(false);
    }
  };

  return (
    <Container className="noshadow" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div className="p-6 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Globe2 size={14} />
              Public site content
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">About Us</h1>
            <p className="text-sm text-slate-500 max-w-2xl mt-1">
              This is the single About document the public QSC website reads — for the About page,
              landing banner, and footer details. Edit it here; there is no need (and no option) to
              create a second one.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading || !isDirty}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save size={14} />
              {saving ? "Saving…" : recordId ? "Save changes" : "Create About Us"}
            </button>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${
              recordId
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-amber-50 text-amber-700 ring-amber-100"
            }`}
          >
            <Info size={14} />
            {recordId ? "Editing existing document" : "No document yet — will be created on save"}
          </span>
          {isDirty && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Duplicate cleanup banner */}
        {duplicateCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-sm">
            <AlertTriangle size={16} />
            <span className="flex-1 min-w-[220px]">
              There are <strong>{records.length} About Us records</strong> in the database. The
              public site only ever shows the newest one. Clean up the rest to avoid confusion.
            </span>
            <button
              type="button"
              onClick={cleanupDuplicates}
              disabled={cleaning}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              <Trash2 size={14} />
              {cleaning ? "Cleaning…" : `Keep latest, delete ${duplicateCount}`}
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500 bg-white rounded-lg border border-slate-200">
            Loading content…
          </div>
        ) : (
          <div className="space-y-6">
            <Section
              title="About Page"
              subtitle="Shown on the public /about-us page. The banner appears at the top; the description forms the body copy."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="About Title" required>
                  <input
                    type="text"
                    value={form.title}
                    onChange={handleChange("title")}
                    placeholder="e.g. Quran Study Centre Kerala"
                    className={inputCls}
                  />
                </Field>
                <ImageField
                  label="About Page Banner"
                  required={!recordId}
                  hint="Shown above the About page content. Recommended: wide image (~1600×600)."
                  existingUrl={form.image ? `${CDN}${form.image}` : ""}
                  file={imageFile}
                  onChange={setImageFile}
                />
              </div>
              <Field label="About Description" required className="mt-4">
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={5}
                  placeholder="Supports basic HTML. Explain what QSC is, its vision and mission."
                  className={textareaCls}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  HTML is allowed (e.g. <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>,{" "}
                  <code>&lt;li&gt;</code>).
                </p>
              </Field>
            </Section>

            <Section
              title="Landing Page Banner"
              subtitle="This is the hero banner visitors see first on the public homepage."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Landing Title" required>
                  <input
                    type="text"
                    value={form.landingTitle}
                    onChange={handleChange("landingTitle")}
                    placeholder="Headline shown on the homepage banner"
                    className={inputCls}
                  />
                </Field>
                <ImageField
                  label="Landing Main Banner"
                  required={!recordId}
                  hint="Hero image for the homepage. Recommended: 1920×720."
                  existingUrl={form.landingMainbanner ? `${CDN}${form.landingMainbanner}` : ""}
                  file={bannerFile}
                  onChange={setBannerFile}
                />
              </div>
              <Field label="Landing Description" required className="mt-4">
                <textarea
                  value={form.landingDescription}
                  onChange={handleChange("landingDescription")}
                  rows={4}
                  placeholder="Short description under the homepage headline."
                  className={textareaCls}
                />
              </Field>
            </Section>

            <Section
              title="Footer & Contact"
              subtitle="Appears in the public website footer and is also used as the default contact address in candidate communications."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email" required icon={<Mail size={14} />}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="contact@example.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Mobile" required icon={<Phone size={14} />}>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange("mobile")}
                    placeholder="e.g. +91 9XXXXXXXXX"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Footer Text" required className="mt-4">
                <textarea
                  value={form.footerText}
                  onChange={handleChange("footerText")}
                  rows={3}
                  placeholder="Short tagline / copyright line shown at the bottom of every page."
                  className={textareaCls}
                />
              </Field>
            </Section>

            {/* Sticky save bar for long pages */}
            {isDirty && (
              <div className="sticky bottom-4 flex justify-end">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900 text-white shadow-lg">
                  <span className="text-xs text-slate-300">You have unsaved changes</span>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    <Save size={13} />
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400";
const textareaCls = `${inputCls} resize-y min-h-[96px] leading-relaxed`;

const Section = ({ title, subtitle, children }) => (
  <section className="bg-white rounded-lg border border-slate-200 p-5">
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Field = ({ label, required, icon, className = "", children }) => (
  <div className={className}>
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
      {icon}
      <span>{label}</span>
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const ImageField = ({ label, required, hint, existingUrl, file, onChange }) => {
  const inputRef = useRef(null);
  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return existingUrl || "";
  }, [file, existingUrl]);

  useEffect(() => {
    // Revoke object URL when file changes to avoid leaks.
    return () => {
      if (file && previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
        <ImagePlus size={14} />
        <span>{label}</span>
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="flex items-stretch gap-3">
        <div className="w-36 h-24 rounded-md bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[11px] text-slate-400">No image</span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Upload size={13} />
              {previewUrl ? "Replace image" : "Upload image"}
            </button>
            {file && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] rounded text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={12} />
                Remove new file
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange(f);
              }}
            />
          </div>
          {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
          {file && (
            <p className="text-[11px] text-slate-500 truncate">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout(AboutUs);
