export const projectSettings = {
  title: import.meta.env.VITE_TITLE ?? "",
  shortTitle: import.meta.env.VITE_APP_SHORT_TITLE ?? "",
  description: import.meta.env.VITE_APP_DESCRIPTION ?? "",
  privileges: {
    admin: "6459f25d7f6e9664fbd7486f",
    event: "65a8b8bec6ecb90dd2d5a1f1",
    franchiseAdmin: "6493e7bf0fba44683fd8f51c",
  },
  formInputView: "mixed", // classic, modern, mixed
  theme: {
    theme: "#375DFB",
    themeLight: "#f7f7ff",
    pageBackground: "white",
    background: "white",
    foreground: "#4f4f4f",
    border: "#E2E4E9",
    secBackground: "white",
    secForeground: "#757575",
    lightBackground: "White",
    lightForeground: "Black",
    lightBorder: "Black",
    lightSecBackground: "White",
    lightSecForeground: "black",
    foregroundInvert: "white",
    backgroundInvert: "black;",
    borderThinkness: "0px",
    themeBackground: "#375DFB",
    themeForeground: "white",
    disabledBackground: "rgba(156, 156, 156, 0.41)",
    disabledForeground: "white",
    gradient: "-webkit-linear-gradient(302deg, rgb(129, 2, 129), rgb(90, 169, 230) 100%)",
  },
};
export const appTheme = {
  // Logo-based colors (Primary)
  primary: {
    darkest: "#050505", // dark
    dark: "#253EA7", // blue-dark
    base: "#375DFB", // blue-base
    light: "#C2D6FF", // blue-light
    lightest: "#EBF1FF", // blue-lightest
  },

  // Background Colors
  bg: {
    strong: "#0A0D14", // neutral-900
    surface: "#161922", // neutral-800
    soft: "#E2E4E9", // neutral-200
    weak: "#F6F8FA", // neutral-100
    white: "#FFFFFF", // neutral-0
    plain: "#f6f8fa",
  },

  // Text Colors
  text: {
    main: "#0A0D14", // neutral-900 (dark)
    sub: "#525866", // neutral-500 (medium gray)
    soft: "#868C98", // neutral-400 (light gray)
    disabled: "#CDD0D5", // neutral-300 (lighter gray)
    white: "#FFFFFF", // neutral-0 (white)
  },

  // Stroke Colors
  stroke: {
    strong: "#0A0D14", // neutral-900 (black)
    sub: "#868C98", // neutral-300 (dark gray)
    soft: "#E2E4E9", // neutral-200 (light gray)
    disabled: "#F6F8FA", // neutral-100 (lighter gray)
    white: "#FFFFFF", // neutral-0 (white)
  },

  // Icon Colors
  icon: {
    strong: "#0A0D14", // neutral-900 (black)
    sub: "#525866", // neutral-500 (dark gray)
    soft: "#868C98", // neutral-400 (medium gray)
    disabled: "#CDD0D5", // neutral-300 (light gray)
    white: "#FFFFFF", // neutral-0 (white)
  },

  // State Colors
  state: {
    success: "#4CAF50", // green-base
    warning: "#FF9800", // orange-base
    error: "#F44336", // red-base
    information: "#2196F3", // blue-base
    away: "#F2AE40", // yellow-base
    neutral: "#9E9E9E", // gray-base
    verified: "#673AB7", // purple-base
  },
};
