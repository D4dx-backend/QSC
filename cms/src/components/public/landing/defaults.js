export const LANDING_MENU_DEFAULTS = {
  centerRegistration: false,
  hallTicket: false,
  examRegistration: false,
  downloads: true,
  about: true,
  result: false,
  examInstruction: false,
};

export const LANDING_COPY_DEFAULTS = {
  heroEyebrow: "QSC Kerala public portal",
  heroStoryBadge: "Simple by design",
  heroStoryTitle: "Students use the public side. Admins keep it current.",
  heroStoryDescription:
    "The public page stays clean while all public-facing numbers and messaging remain editable from the admin side.",
  quickAccessKicker: "Quick access",
  quickAccessTitle: "Public actions without clutter",
  quickAccessDescription:
    "Only the important public entry points stay visible. Admins can turn each action on or off from Landing Page Settings.",
  snapshotKicker: "State snapshot",
  snapshotTitle: "Editable public snapshot",
  snapshotDescription:
    "Only admin-approved state-level totals appear here. No district-wise breakdown is exposed on the public page.",
  adminNote:
    "Landing headline, About page content, footer copy, quick actions and public snapshot values are all managed from Landing Page Settings.",
  copyrightText:
    "Copyright {year} Quran Study Centre Kerala. All rights reserved.",
  poweredByText: "D4DX.co",
  poweredByUrl: "https://d4dx.co/",
  footerLinksLabel: "Public links",
  footerContactLabel: "Contact",
};

export const LANDING_HERO_STATS_DEFAULTS = [
  { label: "Districts", value: "18" },
  { label: "Areas", value: "181" },
  { label: "Study Centres", value: "785" },
  { label: "Students", value: "15,979" },
];

export const LANDING_SNAPSHOT_CARD_DEFAULTS = [
  {
    label: "District coverage",
    value: "18",
    description: "Total districts currently managed under the state-level network.",
  },
  {
    label: "Operational areas",
    value: "181",
    description: "Configured area structure across the state.",
  },
  {
    label: "Study centres",
    value: "785",
    description: "Approved centres presently reflected in the system.",
  },
  {
    label: "Students reached",
    value: "15,979",
    description: "Current public-facing total for connected students.",
  },
];

const mergeItems = (defaults, items = []) =>
  defaults.map((item, index) => ({
    ...item,
    ...(Array.isArray(items) ? items[index] || {} : {}),
  }));

export const normalizeLandingSettings = (settings = {}) => ({
  ...LANDING_MENU_DEFAULTS,
  ...settings,
  showPublicSnapshot: settings.showPublicSnapshot ?? true,
  copy: {
    ...LANDING_COPY_DEFAULTS,
    ...(settings.copy || {}),
  },
  heroStats: mergeItems(LANDING_HERO_STATS_DEFAULTS, settings.heroStats),
  snapshotCards: mergeItems(
    LANDING_SNAPSHOT_CARD_DEFAULTS,
    settings.snapshotCards
  ),
});