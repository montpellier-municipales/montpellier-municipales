import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  padding: "4rem 1rem",
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "2.5rem",
});

export const backLink = style({
  fontSize: "0.85rem",
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  ":hover": {
    textDecoration: "underline",
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const org = style({
  fontSize: "0.8rem",
  fontWeight: "700",
  color: vars.color.primary,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});

export const title = style({
  fontSize: "1.8rem",
  fontWeight: "800",
  color: vars.color.title,
  letterSpacing: "-0.02em",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.4rem",
    },
  },
});

export const description = style({
  fontSize: "0.95rem",
  color: vars.color.textMuted,
  lineHeight: "1.6",
  maxWidth: "700px",
});

export const externalLink = style({
  fontSize: "0.85rem",
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3rem",
  ":hover": {
    textDecoration: "underline",
  },
});

// Simple signatory list (no measures)
export const signatoryGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "1rem",
});

export const signatoryCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1.25rem 1rem",
  borderRadius: "12px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  textAlign: "center",
});

export const signatoryCardSigned = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1.25rem 1rem",
  borderRadius: "12px",
  textAlign: "center",
  border: `2px solid ${vars.color.success}`,
  backgroundColor: vars.color.surface,
});

export const signatoryLogoImg = style({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const signatoryName = style({
  fontSize: "0.82rem",
  fontWeight: "600",
  color: vars.color.text,
});

export const spacer = style({
  flexGrow: 1,
});

export const headOfList = style({
  fontSize: "0.72rem",
  color: vars.color.textMuted,
  fontStyle: "italic",
  display: "block",
  maxWidth: "64px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const signedLabel = style({
  fontSize: "0.72rem",
  fontWeight: "700",
  color: vars.color.success,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

export const notSignedLabel = style({
  fontSize: "0.72rem",
  fontWeight: "600",
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

// Measure table
export const tableWrapper = style({
  overflowX: "auto",
  borderRadius: "12px",
  boxShadow: vars.shadow.md,
  border: `1px solid ${vars.color.border}`,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: vars.color.surface,
});

export const theadRow = style({
  backgroundColor: vars.color.backgroundMuted,
});

export const thMeasure = style({
  padding: "0.875rem 1rem",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "0.8rem",
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: `2px solid ${vars.color.border}`,
  minWidth: "260px",
  position: "sticky",
  left: 0,
  backgroundColor: vars.color.backgroundMuted,
  zIndex: 1,
});

export const thCandidate = style({
  padding: "0.75rem 0.5rem",
  textAlign: "center",
  borderBottom: `2px solid ${vars.color.border}`,
  minWidth: "72px",
});

export const candidateLogoImg = style({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  margin: "0 auto 0.2rem",
});

export const candidateName = style({
  fontSize: "0.6rem",
  color: vars.color.textMuted,
  fontWeight: "600",
  display: "block",
  maxWidth: "64px",
  margin: "0 auto",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const themeRow = style({
  backgroundColor: vars.color.backgroundMuted,
});

export const themeCell = style({
  padding: "0.5rem 1rem",
  fontSize: "0.72rem",
  fontWeight: "700",
  color: vars.color.primary,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  position: "sticky",
  left: 0,
  backgroundColor: vars.color.backgroundMuted,
});

export const themeSpacer = style({
  backgroundColor: vars.color.backgroundMuted,
});

export const measureRow = style({
  borderBottom: `1px solid ${vars.color.border}`,
  ":last-child": {
    borderBottom: "none",
  },
});

export const tdMeasure = style({
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  color: vars.color.text,
  lineHeight: "1.5",
  position: "sticky",
  left: 0,
  backgroundColor: vars.color.surface,
  zIndex: 1,
  borderRight: `1px solid ${vars.color.border}`,
});

export const measureNumber = style({
  fontSize: "0.7rem",
  color: vars.color.textMuted,
  marginRight: "0.4rem",
  fontWeight: "600",
});

export const tdCell = style({
  padding: "0.5rem",
  textAlign: "center",
  verticalAlign: "middle",
});

export const checkIcon = style({
  color: vars.color.success,
  fontSize: "1.1rem",
  display: "block",
  margin: "0 auto",
});

export const crossIcon = style({
  color: vars.color.border,
  fontSize: "1.1rem",
  display: "block",
  margin: "0 auto",
});

export const unknownIcon = style({
  color: vars.color.textMuted,
  fontSize: "0.9rem",
  display: "block",
  margin: "0 auto",
});

export const note = style({
  fontSize: "0.78rem",
  color: vars.color.textMuted,
  lineHeight: "1.5",
  backgroundColor: vars.color.backgroundMuted,
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  borderLeft: `3px solid ${vars.color.border}`,
});
