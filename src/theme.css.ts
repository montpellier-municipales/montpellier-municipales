import { createTheme, createThemeContract } from "@vanilla-extract/css";

// 1. Définition du Contrat (les variables disponibles partout)
export const vars = createThemeContract({
  defaultTransition: null,
  color: {
    background: null,
    surface: null, // Pour les cartes, headers, etc.
    title: null,
    text: null,
    textMuted: null,
    border: null,

    primary: null,
    primaryHover: null,
    primaryText: null, // Texte sur fond primaire

    secondary: null,
    secondaryHover: null,
  },
  font: {
    body: null,
    heading: null,
  },
  layout: {
    maxWidth: null,
    sidebarWidth: null,
  },
  shadow: {
    sm: null,
    md: null,
    lg: null,
  },
});

// Couleurs de base (Palette Montpellier)
const palette = {
  montpellierBlue: "#173a92",
  montpellierDark: "#061115",
  yellow: "#eab148",
  yellowDarken: "#c7973d",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
};

// 2. Thème Clair (Light)
export const lightTheme = createTheme(vars, {
  defaultTransition: "ease-in-out",
  color: {
    background: palette.gray50,
    surface: palette.white,
    text: palette.gray900,
    textMuted: palette.gray700,
    title: palette.gray800,
    border: palette.gray200,

    primary: palette.montpellierBlue,
    primaryHover: "#122c70", // Version plus sombre
    primaryText: palette.white,

    secondary: palette.yellow,
    secondaryHover: palette.yellowDarken, // Version plus sombre
  },
  font: {
    body: '"Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    heading:
      'Lato, "Open Sans", "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  },
  layout: {
    maxWidth: "1000px",
    sidebarWidth: "320px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 2px 4px rgba(0, 0, 0, 0.05)",
    lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
});

// 3. Thème Sombre (Dark)
export const darkTheme = createTheme(vars, {
  defaultTransition: "ease-in-out",
  color: {
    background: palette.montpellierDark, // Le fond très sombre
    surface: "#0f1f2e", // Légèrement plus clair pour détacher les éléments
    text: "#e2e8f0", // Blanc cassé doux pour les yeux
    textMuted: "#94a3b8",
    title: palette.gray200,
    border: "#1e293b",

    primary: "#4c6ef5", // Bleu plus lumineux pour ressortir sur le noir
    primaryHover: "#3b5bdb",
    primaryText: palette.white,

    secondary: palette.yellow,
    secondaryHover: palette.yellowDarken,
  },
  font: {
    body: '"Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    heading:
      '"Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  },
  layout: {
    maxWidth: "1000px",
    sidebarWidth: "320px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)", // Ombres plus fortes en dark
    md: "0 2px 4px rgba(0, 0, 0, 0.5)",
    lg: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
  },
});
