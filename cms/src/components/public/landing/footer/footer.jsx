import React, { useEffect, useState } from "react";
import "../style.css";
import logo from "../../../../components/project/brand/logo.png";
import { getData } from "../../../../backend/api";
import { normalizeLandingSettings } from "../defaults";

const defaultFooter = {
  email: "qsconline@gmail.com",
  mobile: "7994162608",
  footerText:
    "A clean public portal for registrations, results, downloads and district operations.",
};

const Footer = () => {
  const [footerContent, setFooterContent] = useState(defaultFooter);
  const [landingSettings, setLandingSettings] = useState(
    normalizeLandingSettings()
  );

  useEffect(() => {
    let cancelled = false;

    const loadFooter = async () => {
      const [aboutResponse, menuResponse] = await Promise.all([
        getData({}, "about-us"),
        getData({}, "floating-menu-settings"),
      ]);
      if (cancelled) return;
      const aboutRow = aboutResponse?.data?.response?.[0] || {};
      const menuRow = menuResponse?.data?.response?.[0] || {};
      setFooterContent((current) => ({ ...current, ...aboutRow }));
      setLandingSettings(normalizeLandingSettings(menuRow));
    };

    loadFooter();

    return () => {
      cancelled = true;
    };
  }, []);

  const { copy } = landingSettings;
  const copyrightLine = (copy.copyrightText || "").replace(
    "{year}",
    String(new Date().getFullYear())
  );

  return (
    <footer className="landing-footer-shell">
      <div className="landing-page-shell landing-footer-grid">
        <div className="landing-footer-brand">
          <img src={logo} alt="QSC logo" />
          <p className="landing-footer-text">{footerContent.footerText}</p>
        </div>

        <div className="landing-footer-block">
          <span className="landing-footer-label">{copy.footerLinksLabel}</span>
          <a href="/question-papers" className="landing-footer-link">
            Downloads
          </a>
          <a href="/about-us" className="landing-footer-link">
            About QSC
          </a>
          <a href="/result" className="landing-footer-link">
            Result
          </a>
        </div>

        <div className="landing-footer-block">
          <span className="landing-footer-label">{copy.footerContactLabel}</span>
          <a
            href={`mailto:${footerContent.email}`}
            className="landing-footer-link"
          >
            {footerContent.email}
          </a>
          <a
            href={`tel:${footerContent.mobile}`}
            className="landing-footer-link"
          >
            {footerContent.mobile}
          </a>
          <a href="/admin" className="landing-footer-link">
            Admin panel
          </a>
        </div>
      </div>

      <div className="landing-page-shell landing-footer-bottom">
        <span>{copyrightLine}</span>
        {copy.poweredByText && (
          <span className="landing-powered-by">
            Powered by{" "}
            {copy.poweredByUrl ? (
              <a
                href={copy.poweredByUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.poweredByText}
              </a>
            ) : (
              copy.poweredByText
            )}
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
