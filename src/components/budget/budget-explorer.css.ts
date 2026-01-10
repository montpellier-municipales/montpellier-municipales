import { style, globalStyle } from "@vanilla-extract/css";
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
  minWidth: 0, // Critical for preventing flex items from overflowing
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
  cursor: "pointer",
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
