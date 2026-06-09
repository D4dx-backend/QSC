import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  Globe2,
  ImagePlus,
  Info,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Sparkles,
  Ticket,
  Trash2,
  Trophy,
  Upload,
} from "lucide-react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { deleteData, getData, postData, putData } from "../../../../backend/api";
import { normalizeLandingSettings } from "../../../public/landing/defaults";

const MENU_ITEMS = [
  {
    key: "centerRegistration",
    label: "Centre Affiliation",
    description:
      "Public form used by institutions to apply as a QSC study centre.",
    icon: Building2,
    tone: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  },
  {
    key: "hallTicket",
    label: "Hall Ticket",
    description:
      "Lets candidates download their hall ticket from the landing page.",
    icon: Ticket,
    tone: "bg-amber-50 text-amber-600 ring-amber-100",
  },
  {
    key: "examRegistration",
    label: "Exam Registration",
    description: "Opens the public candidate registration form.",
    icon: ClipboardList,
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  {
    key: "downloads",
    label: "Downloads",
    description: "Shows question papers and other public files.",
    icon: Download,
    tone: "bg-sky-50 text-sky-600 ring-sky-100",
  },
  {
    key: "about",
    label: "About Us",
    description: "Quick link to the About page from the public site.",
    icon: Info,
    tone: "bg-slate-50 text-slate-600 ring-slate-200",
  },
  {
    key: "result",
    label: "Result",
    description: "Enables the result lookup entry point.",
    icon: Trophy,
    tone: "bg-rose-50 text-rose-600 ring-rose-100",
  },
  {
    key: "examInstruction",
    label: "Exam Instructions",
    description: "Shows instructions candidates must read before the exam.",
    icon: BookOpen,
    tone: "bg-violet-50 text-violet-600 ring-violet-100",
  },
];

const CDN = import.meta.env.VITE_APP_CDN || "";

const EMPTY_ABOUT_FORM = {
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

const clone = (value) => JSON.parse(JSON.stringify(value));

const mapAboutForm = (row = {}) => ({
  title: row.title || "",
  description: row.description || "",
  landingTitle: row.landingTitle || "",
  landingDescription: row.landingDescription || "",
  email: row.email || "",
  mobile: row.mobile || "",
  footerText: row.footerText || "",
  image: row.image || "",
  landingMainbanner: row.landingMainbanner || "",
});

const FloatingMenuSettings = (props) => {
  useEffect(() => {
    document.title = `Landing Page Settings - QSC Automation`;
  }, []);

  const [settingsRecordId, setSettingsRecordId] = useState(null);
  const [values, setValues] = useState(() => normalizeLandingSettings());
  const [initialValues, setInitialValues] = useState(() =>
    normalizeLandingSettings()
  );
  const [aboutRecords, setAboutRecords] = useState([]);
  const [aboutRecordId, setAboutRecordId] = useState(null);
  const [aboutForm, setAboutForm] = useState(EMPTY_ABOUT_FORM);
  const [aboutInitial, setAboutInitial] = useState(EMPTY_ABOUT_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [settingsResponse, aboutResponse] = await Promise.all([
        getData({}, "floating-menu-settings"),
        getData({ skip: 0, limit: 50 }, "about-us"),
      ]);

      const settingsRow = (settingsResponse?.data?.response || [])[0] || null;
      const settingsNext = normalizeLandingSettings(settingsRow || {});
      setSettingsRecordId(settingsRow?._id || null);
      setValues(clone(settingsNext));
      setInitialValues(clone(settingsNext));

      const records = aboutResponse?.data?.response || [];
      setAboutRecords(records);

      const aboutRow = records[0] || null;
      if (aboutRow) {
        const aboutNext = mapAboutForm(aboutRow);
        setAboutRecordId(aboutRow._id || null);
        setAboutForm(aboutNext);
        setAboutInitial(aboutNext);
      } else {
        setAboutRecordId(null);
        setAboutForm(EMPTY_ABOUT_FORM);
        setAboutInitial(EMPTY_ABOUT_FORM);
      }

      setImageFile(null);
      setBannerFile(null);
    } catch (error) {
      props.setMessage?.({
        type: 1,
        content:
          error?.response?.data?.message ||
          "Failed to load landing page settings.",
        proceed: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (key) =>
    setValues((current) => ({ ...current, [key]: !current[key] }));

  const handleAboutChange = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setAboutForm((current) => ({ ...current, [key]: value }));
  };

  const updateCopy = (key, value) =>
    setValues((current) => ({
      ...current,
      copy: { ...current.copy, [key]: value },
    }));

  const updateHeroStat = (index, key, value) =>
    setValues((current) => ({
      ...current,
      heroStats: current.heroStats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));

  const updateSnapshotCard = (index, key, value) =>
    setValues((current) => ({
      ...current,
      snapshotCards: current.snapshotCards.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));

  const enabledCount = useMemo(
    () => MENU_ITEMS.filter((item) => values[item.key]).length,
    [values]
  );

  const duplicateCount = Math.max(0, aboutRecords.length - 1);

  const aboutDirty = useMemo(() => {
    if (imageFile || bannerFile) return true;
    return Object.keys(EMPTY_ABOUT_FORM).some(
      (key) => (aboutForm[key] || "") !== (aboutInitial[key] || "")
    );
  }, [aboutForm, aboutInitial, imageFile, bannerFile]);

  const isDirty = useMemo(
    () =>
      JSON.stringify(values) !== JSON.stringify(initialValues) || aboutDirty,
    [values, initialValues, aboutDirty]
  );

  const enableAll = () => {
    const next = {};
    MENU_ITEMS.forEach((item) => {
      next[item.key] = true;
    });
    setValues((current) => ({ ...current, ...next }));
  };

  const disableAll = () => {
    const next = {};
    MENU_ITEMS.forEach((item) => {
      next[item.key] = false;
    });
    setValues((current) => ({ ...current, ...next }));
  };

  const resetChanges = () => setValues(clone(initialValues));

  const resetAll = () => {
    setValues(clone(initialValues));
    setAboutForm(aboutInitial);
    setImageFile(null);
    setBannerFile(null);
  };

  const validateAbout = () => {
    const missing = [];
    if (!aboutForm.title?.trim()) missing.push("About Title");
    if (!aboutForm.description?.trim()) missing.push("About Description");
    if (!aboutForm.landingTitle?.trim()) missing.push("Landing Title");
    if (!aboutForm.landingDescription?.trim()) missing.push("Landing Description");
    if (!aboutForm.email?.trim()) missing.push("Email");
    if (!aboutForm.mobile?.trim()) missing.push("Mobile");
    if (!aboutForm.footerText?.trim()) missing.push("Footer Text");
    if (!aboutRecordId && !imageFile) missing.push("About Banner image");
    if (!aboutRecordId && !bannerFile) missing.push("Landing Main Banner image");
    return missing;
  };

  const cleanupDuplicates = async () => {
    if (!duplicateCount) return;
    const ok = window.confirm(
      `Found ${duplicateCount} older About record(s). Keep only the newest and delete the rest?`
    );
    if (!ok) return;
    setCleaning(true);
    try {
      const extras = aboutRecords.slice(1);
      for (const row of extras) {
        if (row?._id) await deleteData({ id: row._id }, "about-us");
      }
      props.setMessage?.({
        type: 2,
        content: `Removed ${extras.length} duplicate About record(s).`,
        proceed: "Okay",
      });
      await load();
    } catch (error) {
      props.setMessage?.({
        type: 1,
        content: error?.response?.data?.message || error.message,
        proceed: "Okay",
      });
    } finally {
      setCleaning(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const missing = validateAbout();
      if (missing.length) {
        props.setMessage?.({
          type: 1,
          content: `Please fill: ${missing.join(", ")}`,
          proceed: "Okay",
        });
        return;
      }

      if (aboutDirty || !aboutRecordId) {
        const aboutPayload = {
          title: aboutForm.title,
          description: aboutForm.description,
          landingTitle: aboutForm.landingTitle,
          landingDescription: aboutForm.landingDescription,
          email: aboutForm.email,
          mobile: aboutForm.mobile,
          footerText: aboutForm.footerText,
        };

        if (imageFile) aboutPayload.image = imageFile;
        if (bannerFile) aboutPayload.landingMainbanner = bannerFile;

        const aboutResponse = aboutRecordId
          ? await putData({ id: aboutRecordId, ...aboutPayload }, "about-us")
          : await postData(aboutPayload, "about-us");

        if (!aboutResponse?.data?.success) {
          props.setMessage?.({
            type: 1,
            content: aboutResponse?.data?.message || "Could not save landing content.",
            proceed: "Okay",
          });
          return;
        }
      }

      if (JSON.stringify(values) !== JSON.stringify(initialValues) || !settingsRecordId) {
        const payload = clone(values);
        const settingsResponse = settingsRecordId
          ? await putData({ id: settingsRecordId, ...payload }, "floating-menu-settings")
          : await postData(payload, "floating-menu-settings");

        if (!settingsResponse?.data?.success) {
          props.setMessage?.({
            type: 1,
            content: settingsResponse?.data?.message || "Could not save landing page settings.",
            proceed: "Okay",
          });
          return;
        }
      }

      props.setMessage?.({
        type: 2,
        content: "Landing page settings saved.",
        proceed: "Okay",
      });
      await load();
    } catch (error) {
      props.setMessage?.({
        type: 1,
        content: error?.response?.data?.message || error.message,
        proceed: "Okay",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container
      className="noshadow"
      style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
    >
      <div className="p-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles size={14} />
              Public site configuration
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">
              Landing Page Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl mt-1 leading-6">
              Manage the full public landing experience from one place: About
              page content, home banners, footer details, quick actions and the
              approved public snapshot. Nothing on the public side needs a
              separate settings page anymore.
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
              {saving ? "Saving…" : "Save all changes"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${
              aboutRecordId
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-amber-50 text-amber-700 ring-amber-100"
            }`}
          >
            <Globe2 size={14} />
            {aboutRecordId ? "Landing content document ready" : "Landing content will be created on save"}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Eye size={14} />
            {enabledCount} quick actions visible
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200">
            <EyeOff size={14} />
            {MENU_ITEMS.length - enabledCount} quick actions hidden
          </span>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${
              values.showPublicSnapshot
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
          >
            {values.showPublicSnapshot ? "Public snapshot visible" : "Public snapshot hidden"}
          </span>
          {isDirty && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              Unsaved changes
            </span>
          )}
          {duplicateCount > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              {duplicateCount} extra About record(s)
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={enableAll}
              disabled={loading}
              className="text-xs px-2.5 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Enable all actions
            </button>
            <button
              type="button"
              onClick={disableAll}
              disabled={loading}
              className="text-xs px-2.5 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Disable all actions
            </button>
            <button
              type="button"
              onClick={resetAll}
              disabled={loading || !isDirty}
              className="text-xs px-2.5 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <div className="space-y-6">
            {duplicateCount > 0 && (
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                <AlertTriangle size={16} />
                <span className="flex-1 min-w-[220px]">
                  There are <strong>{aboutRecords.length} About records</strong> in the database.
                  Public pages only use the newest one. Clean up the rest to keep
                  landing content predictable.
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

            <SectionCard
              title="About page and landing banners"
              description="This single content block powers the public /about-us page, landing headline, homepage banners and footer contact details."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="About Title" required>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={handleAboutChange("title")}
                    placeholder="e.g. Quran Study Centre Kerala"
                    className={inputCls}
                  />
                </Field>
                <ImageField
                  label="About Page Banner"
                  required={!aboutRecordId}
                  hint="Shown above the public About page content. Recommended: wide image (~1600×600)."
                  existingUrl={aboutForm.image ? `${CDN}${aboutForm.image}` : ""}
                  file={imageFile}
                  onChange={setImageFile}
                />
              </div>

              <Field label="About Description" required className="mt-4">
                <textarea
                  value={aboutForm.description}
                  onChange={handleAboutChange("description")}
                  rows={5}
                  placeholder="Supports basic HTML. Explain what QSC is, its vision and mission."
                  className={textareaCls}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  HTML is allowed (for example: <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>).
                </p>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Field label="Landing Title" required>
                  <input
                    type="text"
                    value={aboutForm.landingTitle}
                    onChange={handleAboutChange("landingTitle")}
                    placeholder="Headline shown on the homepage banner"
                    className={inputCls}
                  />
                </Field>
                <ImageField
                  label="Landing Main Banner"
                  required={!aboutRecordId}
                  hint="Hero image for the homepage. Recommended: 1920×720."
                  existingUrl={aboutForm.landingMainbanner ? `${CDN}${aboutForm.landingMainbanner}` : ""}
                  file={bannerFile}
                  onChange={setBannerFile}
                />
              </div>

              <Field label="Landing Description" required className="mt-4">
                <textarea
                  value={aboutForm.landingDescription}
                  onChange={handleAboutChange("landingDescription")}
                  rows={4}
                  placeholder="Short description under the homepage headline."
                  className={textareaCls}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Field label="Email" required icon={<Mail size={14} />}>
                  <input
                    type="email"
                    value={aboutForm.email}
                    onChange={handleAboutChange("email")}
                    placeholder="contact@example.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Mobile" required icon={<Phone size={14} />}>
                  <input
                    type="tel"
                    value={aboutForm.mobile}
                    onChange={handleAboutChange("mobile")}
                    placeholder="e.g. +91 9XXXXXXXXX"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Footer Text" required className="mt-4">
                <textarea
                  value={aboutForm.footerText}
                  onChange={handleAboutChange("footerText")}
                  rows={3}
                  placeholder="Short tagline / copyright line shown in the public footer."
                  className={textareaCls}
                />
              </Field>
            </SectionCard>

            <SectionCard
              title="Quick action visibility"
              description="These toggles decide which public actions are available from the landing page. The old Floating Menu Settings screen now lives here."
            >
              <div className="space-y-3">
                {loading ? (
                  <div className="p-10 text-center text-sm text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    Loading settings…
                  </div>
                ) : (
                  MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const enabled = !!values[item.key];
                    return (
                      <label
                        key={item.key}
                        className={`flex items-start gap-4 p-4 bg-white rounded-lg border transition cursor-pointer ${
                          enabled
                            ? "border-indigo-200 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-10 h-10 rounded-lg ring-1 shrink-0 ${item.tone}`}
                        >
                          <Icon size={18} />
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              {item.label}
                            </span>
                            <span
                              className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                                enabled
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {enabled ? "Visible" : "Hidden"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        <ToggleSwitch
                          checked={enabled}
                          onChange={() => toggle(item.key)}
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Landing copy"
              description="Every supporting text shown on the public landing page can be edited here."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Hero eyebrow"
                  value={values.copy.heroEyebrow}
                  onChange={(value) => updateCopy("heroEyebrow", value)}
                />
                <TextField
                  label="Story badge"
                  value={values.copy.heroStoryBadge}
                  onChange={(value) => updateCopy("heroStoryBadge", value)}
                />
                <TextAreaField
                  label="Story title"
                  value={values.copy.heroStoryTitle}
                  onChange={(value) => updateCopy("heroStoryTitle", value)}
                />
                <TextAreaField
                  label="Story description"
                  value={values.copy.heroStoryDescription}
                  onChange={(value) => updateCopy("heroStoryDescription", value)}
                />
                <TextField
                  label="Quick access kicker"
                  value={values.copy.quickAccessKicker}
                  onChange={(value) => updateCopy("quickAccessKicker", value)}
                />
                <TextAreaField
                  label="Quick access title"
                  value={values.copy.quickAccessTitle}
                  onChange={(value) => updateCopy("quickAccessTitle", value)}
                />
                <TextAreaField
                  label="Quick access description"
                  value={values.copy.quickAccessDescription}
                  onChange={(value) => updateCopy("quickAccessDescription", value)}
                />
                <TextAreaField
                  label="Admin note"
                  value={values.copy.adminNote}
                  onChange={(value) => updateCopy("adminNote", value)}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Footer copy"
              description="Copyright line, powered-by branding and section labels shown in the public footer."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Copyright text"
                  value={values.copy.copyrightText}
                  onChange={(value) => updateCopy("copyrightText", value)}
                  placeholder="Use {year} for the current year."
                />
                <TextField
                  label="Powered-by text"
                  value={values.copy.poweredByText}
                  onChange={(value) => updateCopy("poweredByText", value)}
                  placeholder="Brand name shown after 'Powered by'. Leave empty to hide."
                />
                <TextField
                  label="Powered-by URL"
                  value={values.copy.poweredByUrl}
                  onChange={(value) => updateCopy("poweredByUrl", value)}
                  placeholder="https://d4dx.co/"
                />
                <TextField
                  label="Footer links label"
                  value={values.copy.footerLinksLabel}
                  onChange={(value) => updateCopy("footerLinksLabel", value)}
                />
                <TextField
                  label="Footer contact label"
                  value={values.copy.footerContactLabel}
                  onChange={(value) => updateCopy("footerContactLabel", value)}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Hero highlights"
              description="These four compact numbers appear near the top of the landing page. Enter any approved public values here."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {values.heroStats.map((item, index) => (
                  <div
                    key={`hero-stat-${index}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Highlight {index + 1}
                    </div>
                    <TextField
                      label="Label"
                      value={item.label}
                      onChange={(value) => updateHeroStat(index, "label", value)}
                    />
                    <TextField
                      label="Value"
                      value={item.value}
                      onChange={(value) => updateHeroStat(index, "value", value)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Public snapshot"
              description="This section replaces the old live district breakdown. Only state-level, admin-managed numbers should be shown here."
            >
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="font-semibold text-slate-800">
                    Show public snapshot section
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Turn this off if you do not want any public summary cards on
                    the landing page.
                  </p>
                </div>
                <ToggleSwitch
                  checked={values.showPublicSnapshot}
                  onChange={() =>
                    setValues((current) => ({
                      ...current,
                      showPublicSnapshot: !current.showPublicSnapshot,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <TextField
                  label="Snapshot kicker"
                  value={values.copy.snapshotKicker}
                  onChange={(value) => updateCopy("snapshotKicker", value)}
                />
                <TextAreaField
                  label="Snapshot title"
                  value={values.copy.snapshotTitle}
                  onChange={(value) => updateCopy("snapshotTitle", value)}
                />
                <TextAreaField
                  label="Snapshot description"
                  value={values.copy.snapshotDescription}
                  onChange={(value) => updateCopy("snapshotDescription", value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.snapshotCards.map((item, index) => (
                  <div
                    key={`snapshot-card-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Snapshot card {index + 1}
                    </div>
                    <TextField
                      label="Label"
                      value={item.label}
                      onChange={(value) =>
                        updateSnapshotCard(index, "label", value)
                      }
                    />
                    <TextField
                      label="Value"
                      value={item.value}
                      onChange={(value) =>
                        updateSnapshotCard(index, "value", value)
                      }
                    />
                    <TextAreaField
                      label="Description"
                      value={item.description}
                      onChange={(value) =>
                        updateSnapshotCard(index, "description", value)
                      }
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <aside className="xl:sticky xl:top-4 h-fit space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Quick action preview
              </div>
              <PreviewMock values={values} />
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                This approximates the floating actions shown on the public
                landing page.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Public snapshot preview
              </div>
              <SnapshotPreview values={values} />
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                These cards are the only public numbers shown. They are edited
                manually here and are not read live from district data.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Content source
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="font-semibold text-slate-800">Public About page</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Uses About Title, About Description and About Page Banner from this screen.
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="font-semibold text-slate-800">Public landing page</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Uses Landing Title, Landing Description, Landing Main Banner,
                    quick action toggles and the public snapshot cards from this screen.
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="font-semibold text-slate-800">Footer</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Uses Email, Mobile and Footer Text from this screen.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {isDirty && (
          <div className="sticky bottom-4 mt-6 flex justify-end">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900 text-white shadow-lg">
              <span className="text-xs text-slate-300">You have unsaved landing page changes</span>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold disabled:opacity-50"
              >
                <Save size={13} />
                {saving ? "Saving…" : "Save all"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400";
const textareaCls = `${inputCls} resize-y min-h-[96px] leading-relaxed`;

const SectionCard = ({ title, description, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-1 leading-6">{description}</p>
    </div>
    {children}
  </section>
);

const TextField = ({ label, value, onChange, placeholder }) => (
  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
    <span className="font-medium text-slate-700">{label}</span>
    <input
      type="text"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  </label>
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
    return () => {
      if (file && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

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
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                if (nextFile) onChange(nextFile);
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

const TextAreaField = ({ label, value, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
    <span className="font-medium text-slate-700">{label}</span>
    <textarea
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      rows={3}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-y"
    />
  </label>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={(event) => {
      event.preventDefault();
      onChange?.(event);
    }}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors shadow-inner ${
      checked ? "bg-indigo-600" : "bg-slate-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

const PreviewMock = ({ values }) => {
  const visible = MENU_ITEMS.filter((item) => values[item.key]);

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-md border border-slate-200 h-72 overflow-hidden">
      <div className="absolute inset-0 p-3 space-y-2">
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
        <div className="h-2 w-2/3 bg-slate-200/70 rounded" />
        <div className="h-2 w-1/2 bg-slate-200/70 rounded" />
        <div className="h-24 w-full bg-white/70 rounded-md mt-2 border border-slate-200/70" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          {values.heroStats.slice(0, 4).map((item, index) => (
            <div key={`hero-preview-${index}`} className="h-12 rounded-md bg-white/80 border border-slate-200/70 p-2">
              <div className="h-2 w-1/2 bg-slate-200 rounded mb-2" />
              <div className="text-[10px] font-semibold text-slate-600 truncate">
                {item.value || "--"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
        {visible.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center gap-2 bg-white shadow-sm border border-slate-200 rounded-full pl-2 pr-3 py-1"
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ring-1 ${item.tone}`}>
                <Icon size={12} />
              </span>
              <span className="text-[11px] text-slate-700 font-medium whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
        <div className="mt-1 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
          <Sparkles size={18} />
        </div>
      </div>

      {visible.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            No menu items enabled
          </span>
        </div>
      )}
    </div>
  );
};

const SnapshotPreview = ({ values }) => {
  if (!values.showPublicSnapshot) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 text-center">
        Public snapshot is currently hidden.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {values.snapshotCards.map((item, index) => (
        <div
          key={`snapshot-preview-${index}`}
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div className="text-xl font-semibold text-slate-800">
            {item.value || "--"}
          </div>
          <div className="text-sm font-medium text-slate-700 mt-1">
            {item.label || `Card ${index + 1}`}
          </div>
          <div className="text-xs text-slate-500 mt-1 leading-5">
            {item.description || "No description set."}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Layout(FloatingMenuSettings);
