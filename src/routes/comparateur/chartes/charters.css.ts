import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  padding: "4rem 1rem",
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export const header = style({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const title = style({
  fontSize: "2rem",
  fontWeight: "800",
  color: vars.color.title,
  letterSpacing: "-0.02em",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

export const description = style({
  fontSize: "0.95rem",
  color: vars.color.textMuted,
  maxWidth: "640px",
  margin: "0 auto",
  lineHeight: "1.6",
});

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

export const thCharter = style({
  padding: "1rem",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: `2px solid ${vars.color.border}`,
  minWidth: "220px",
  position: "sticky",
  left: 0,
  backgroundColor: vars.color.backgroundMuted,
  zIndex: 1,
});

export const thCandidate = style({
  padding: "0.75rem 0.5rem",
  textAlign: "center",
  borderBottom: `2px solid ${vars.color.border}`,
  minWidth: "80px",
});

export const candidateLogoImg = style({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  margin: "0 auto 0.25rem",
});

export const candidateName = style({
  fontSize: "0.65rem",
  color: vars.color.textMuted,
  fontWeight: "600",
  display: "block",
  maxWidth: "72px",
  margin: "0 auto",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const headOfList = style({
  fontSize: "0.6rem",
  color: vars.color.textMuted,
  display: "block",
  maxWidth: "72px",
  margin: "0.1rem auto 0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontStyle: "italic",
});

export const row = style({
  borderBottom: `1px solid ${vars.color.border}`,
  ":last-child": {
    borderBottom: "none",
  },
});

export const tdCharter = style({
  padding: "1rem",
  verticalAlign: "top",
  position: "sticky",
  left: 0,
  backgroundColor: vars.color.surface,
  zIndex: 1,
  borderRight: `1px solid ${vars.color.border}`,
});

export const charterOrg = style({
  fontSize: "0.7rem",
  fontWeight: "600",
  color: vars.color.primary,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.25rem",
});

export const charterTitle = style({
  fontSize: "0.9rem",
  fontWeight: "700",
  color: vars.color.title,
  marginBottom: "0.35rem",
});

export const charterDesc = style({
  fontSize: "0.78rem",
  color: vars.color.textMuted,
  lineHeight: "1.5",
  marginBottom: "0.5rem",
});

export const charterLink = style({
  fontSize: "0.78rem",
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: "600",
  ":hover": {
    textDecoration: "underline",
  },
});

export const tdCell = style({
  padding: "0.75rem 0.5rem",
  textAlign: "center",
  verticalAlign: "middle",
});

export const signedBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: vars.color.success,
  color: "white",
  fontSize: "0.9rem",
  fontWeight: "700",
});

export const notSignedBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: vars.color.border,
  color: vars.color.textMuted,
  fontSize: "0.9rem",
});

export const partialBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.2rem 0.45rem",
  borderRadius: "12px",
  backgroundColor: vars.color.primaryTransparent,
  color: vars.color.primary,
  fontSize: "0.72rem",
  fontWeight: "700",
  whiteSpace: "nowrap",
});

export const detailLink = style({
  display: "block",
  fontSize: "0.7rem",
  color: vars.color.primary,
  textDecoration: "none",
  marginTop: "0.35rem",
  fontWeight: "600",
  ":hover": {
    textDecoration: "underline",
  },
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
