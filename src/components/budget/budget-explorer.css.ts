import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  width: "100%",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const filterSection = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  padding: "1.5rem",
  backgroundColor: vars.color.surface,
  borderRadius: "12px",
  border: `1px solid ${vars.color.border}`,
});

export const filterGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  flex: "1 1 200px",
  minWidth: 0,
  maxWidth: "100%",
});

export const label = style({
  fontSize: "0.85rem",
  fontWeight: "600",
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const select = style({
  padding: "0.6rem",
  borderRadius: "6px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.text,
  fontSize: "1rem",
});

export const input = style({
  padding: "0.6rem",
  borderRadius: "6px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.text,
  fontSize: "1rem",
});

export const tableContainer = style({
  overflowX: "auto",
  borderRadius: "12px",
  border: `1px solid ${vars.color.border}`,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
  textAlign: "left",
});

globalStyle(`${table} th`, {
  padding: "1rem",
  backgroundColor: vars.color.surface,
  borderBottom: `2px solid ${vars.color.border}`,
  fontWeight: "700",
  color: vars.color.title,
  whiteSpace: "nowrap",
});

globalStyle(`${table} td`, {
  padding: "1rem",
  borderBottom: `1px solid ${vars.color.border}`,
  verticalAlign: "top",
});

globalStyle(`${table} tr:hover`, {
  backgroundColor: vars.color.surface,
});

export const amount = style({
  fontFamily: "monospace",
  fontWeight: "600",
  textAlign: "right",
  whiteSpace: "nowrap",
});

export const negative = style({
  color: "#e53e3e",
});

export const typeBadge = style({
  display: "inline-block",
  padding: "0.2rem 0.5rem",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: "700",
  textTransform: "uppercase",
});

export const badgeDepense = style({
  backgroundColor: "#fed7d7",
  color: "#9b2c2c",
});

export const badgeRecette = style({
  backgroundColor: "#c6f6d5",
  color: "#22543d",
});

export const pagination = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1rem",
});

export const pageButton = style({
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.text,
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "all 0.2s",
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&:hover:not(:disabled)": {
      backgroundColor: vars.color.surface,
    },
  },
});

export const selectedPageButton = style([
  pageButton,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.primaryText,
    borderColor: vars.color.primary,
    fontWeight: "700",
    selectors: {
      "&:hover:not(:disabled)": {
        backgroundColor: vars.color.primaryHover,
      },
    },
  },
]);

export const paginationDivider = style({
  padding: "0.5rem",
  color: vars.color.textMuted,
});

// Tabs styles
export const tabList = style({
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  borderBottom: `1px solid ${vars.color.border}`,
  overflowX: "auto",
});

export const tab = style({
  padding: "0.75rem 1.5rem",
  fontSize: "1.1rem",
  fontWeight: "600",
  border: "none",
  background: "none",
  borderBottom: "3px solid transparent",
  color: vars.color.textMuted,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "all 0.2s ease-in-out",
  selectors: {
    '&[data-state="selected"]': {
      borderBottom: `3px solid ${vars.color.primary}`,
      color: vars.color.primary,
    },
    "&:hover:not([data-state='selected'])": {
      color: vars.color.text,
      background: vars.color.surface,
    },
  },
});

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const tabPanel = style({
  outline: "none",
  animation: `${fadeIn} 0.3s ease-in-out`,
});

// Page layout styles
export const pageContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
  width: "100%",
});

export const header = style({
  marginBottom: "2rem",
});

export const headerContent = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "1rem",
});

export const pageTitle = style({
  fontSize: "2.5rem",
  fontWeight: "800",
  marginBottom: "0.5rem",
  color: vars.color.title,
  lineHeight: "1.2",
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: "2rem",
    },
  },
});

export const pageSubtitle = style({
  color: vars.color.textMuted,
  fontSize: "1.1rem",
  marginTop: "0",
  maxWidth: "800px",
});

export const sectionTitle = style({
  fontSize: "1.5rem",
  marginBottom: "1rem",
  fontWeight: "700",
  color: vars.color.title,
});

export const yearSelectorWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const yearSelectorLabel = style({
  fontWeight: "600",
  color: vars.color.textMuted,
});