import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  FileDown,
  LayoutDashboard,
  MapPinned,
  School,
  ScrollText,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import "./style.css";
import { getData } from "../../../backend/api";
import { normalizeLandingSettings } from "./defaults";

const defaultContent = {
  landingTitle: "Quran Study Centre Kerala",
  landingDescription:
    "Registrations, hall tickets, question papers, results and public information in one clean portal.",
  footerText:
    "A simpler public front door for students, study centres and administrators.",
  image: "",
  landingMainbanner: "",
};

const resolveAssetUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${import.meta.env.VITE_APP_CDN}${value}`;
};

const SUMMARY_ICONS = [MapPinned, Building2, School, Users];

function Hero() {
  const [content, setContent] = useState(defaultContent);
  const [landingSettings, setLandingSettings] = useState(
    normalizeLandingSettings()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadLandingData = async () => {
      try {
        const [aboutResponse, menuResponse] = await Promise.all([
          getData({}, "about-us"),
          getData({}, "floating-menu-settings"),
        ]);

        if (cancelled) return;

        const aboutRow = aboutResponse?.data?.response?.[0] || {};
        const menuRow = menuResponse?.data?.response?.[0] || {};

        setContent((current) => ({ ...current, ...aboutRow }));
        setLandingSettings(normalizeLandingSettings(menuRow));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLandingData();

    return () => {
      cancelled = true;
    };
  }, []);

  const triggerLandingAction = (action) => {
    window.dispatchEvent(
      new CustomEvent("qsc:landing-action", { detail: action })
    );
  };

  const actionCards = [
    landingSettings.examRegistration
      ? {
          key: "exam-registration",
          title: "Exam Registration",
          description: "Open the public candidate form from the landing page.",
          icon: ScrollText,
          action: () => triggerLandingAction("examRegistration"),
        }
      : null,
    landingSettings.hallTicket
      ? {
          key: "hall-ticket",
          title: "Hall Ticket",
          description: "Let candidates fetch their hall ticket in one step.",
          icon: Ticket,
          action: () => triggerLandingAction("hallTicket"),
        }
      : null,
    landingSettings.centerRegistration
      ? {
          key: "centre-affiliation",
          title: "Centre Affiliation",
          description: "Collect new centre affiliation requests without leaving the page.",
          icon: Building2,
          action: () => triggerLandingAction("centerRegistration"),
        }
      : null,
    landingSettings.downloads
      ? {
          key: "downloads",
          title: "Downloads",
          description: "Question papers and public files stay one click away.",
          icon: FileDown,
          href: "/question-papers",
        }
      : null,
    landingSettings.about
      ? {
          key: "about",
          title: "About QSC",
          description: "Share the mission, structure and public introduction page.",
          icon: BookOpen,
          href: "/about-us",
        }
      : null,
    landingSettings.result
      ? {
          key: "result",
          title: "Result",
          description: "Expose published results from the same public front page.",
          icon: Trophy,
          href: "/result",
        }
      : null,
    landingSettings.examInstruction
      ? {
          key: "instructions",
          title: "Exam Instructions",
          description: "Keep exam-day guidance available as a quick modal action.",
          icon: BookOpen,
          action: () => triggerLandingAction("examInstructions"),
        }
      : null,
    {
      key: "admin-panel",
      title: "Admin Panel",
      description: "Sign in to update landing content and menu visibility settings.",
      icon: LayoutDashboard,
      href: "/admin",
    },
  ].filter(Boolean);

  const heroStats = landingSettings.heroStats.filter(
    (item) => item?.label || item?.value
  );

  const summaryCards = landingSettings.snapshotCards.filter(
    (item) => item?.label || item?.value || item?.description
  );

  const bannerImage = resolveAssetUrl(content.landingMainbanner);
  const profileImage = resolveAssetUrl(content.image);

  return (
    <main className="landing-home">
      <section className="landing-page-shell landing-hero-shell">
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow">
              {landingSettings.copy.heroEyebrow}
            </span>
            <h1 className="landing-hero-title">{content.landingTitle}</h1>
            <p className="landing-hero-description">{content.landingDescription}</p>

            <div className="landing-hero-actions">
              {landingSettings.examRegistration && (
                <button
                  type="button"
                  className="landing-chip-button primary"
                  onClick={() => triggerLandingAction("examRegistration")}
                >
                  Open registration
                </button>
              )}
              <a href="/admin" className="landing-chip-button secondary">
                Admin panel
              </a>
              {landingSettings.downloads && (
                <a href="/question-papers" className="landing-chip-button subtle">
                  Downloads <ArrowRight size={16} />
                </a>
              )}
            </div>

            <div className="landing-stat-grid">
              {heroStats.map((item, index) => (
                <article key={`${item.label}-${index}`} className="landing-stat-card">
                  <span className="landing-stat-label">{item.label}</span>
                  <strong className="landing-stat-value">{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="landing-banner-card">
            {bannerImage ? (
              <img src={bannerImage} alt="QSC public portal banner" />
            ) : (
              <div className="landing-banner-placeholder">
                Public services, district coordination and admin workflows in
                one simple page.
              </div>
            )}
          </div>

          <div className="landing-visual-stack">
            <div className="landing-story-card">
              {profileImage && (
                <img src={profileImage} alt="QSC overview" />
              )}
              <div className="landing-story-copy">
                <span>{landingSettings.copy.heroStoryBadge}</span>
                <h3>{landingSettings.copy.heroStoryTitle}</h3>
                <p>
                  {landingSettings.copy.heroStoryDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prominent Register Now CTA Band ── */}
      <section className="landing-register-cta-band">
        <div className="landing-page-shell">
          <div className="landing-register-cta-inner">
            <div className="landing-register-cta-copy">
              <span className="landing-register-cta-label">Open Registration</span>
              <h2>Register for QSC Kerala Annual Exam</h2>
              <p>
                Students can now submit their details directly from this page.
                Registrations are reviewed and confirmed by the admin panel.
              </p>
            </div>
            <button
              type="button"
              className="landing-register-cta-btn"
              onClick={() => triggerLandingAction("examRegistration")}
            >
              Exam Registration
            </button>
          </div>
        </div>
      </section>

      <section className="landing-page-shell landing-section">
        <div className="landing-section-head">
          <span className="landing-section-kicker">
            {landingSettings.copy.quickAccessKicker}
          </span>
          <h2 className="landing-section-title">
            {landingSettings.copy.quickAccessTitle}
          </h2>
          <p className="landing-section-text">
            {landingSettings.copy.quickAccessDescription}
          </p>
        </div>

        <div className="landing-action-grid">
          {actionCards.map((item) => {
            const Icon = item.icon;

            if (item.href) {
              return (
                <a key={item.key} href={item.href} className="landing-action-card">
                  <span className="landing-action-icon">
                    <Icon size={20} />
                  </span>
                  <div className="landing-action-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="landing-action-link">
                      Open <ArrowRight size={15} />
                    </span>
                  </div>
                </a>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                className="landing-action-card"
                onClick={item.action}
              >
                <span className="landing-action-icon">
                  <Icon size={20} />
                </span>
                <div className="landing-action-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="landing-action-link">
                    Open <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <aside className="landing-admin-note">
          <span>Admin note</span>
          <p>{landingSettings.copy.adminNote}</p>
        </aside>
      </section>

      {landingSettings.showPublicSnapshot && summaryCards.length > 0 && (
        <section className="landing-page-shell landing-section landing-section-tight">
          <div className="landing-section-head compact">
            <span className="landing-section-kicker">
              {landingSettings.copy.snapshotKicker}
            </span>
            <h2 className="landing-section-title">
              {landingSettings.copy.snapshotTitle}
            </h2>
            <p className="landing-section-text">
              {loading
                ? "Loading public snapshot..."
                : landingSettings.copy.snapshotDescription}
            </p>
          </div>

          <div className="landing-summary-grid">
            {summaryCards.map((card, index) => {
              const Icon = SUMMARY_ICONS[index % SUMMARY_ICONS.length];
              return (
                <article key={`${card.label}-${index}`} className="landing-summary-card">
                  <span className="landing-action-icon small">
                    <Icon size={18} />
                  </span>
                  <strong>{card.value}</strong>
                  <h3>{card.label}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default Hero;
