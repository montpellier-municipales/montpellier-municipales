import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";
import { plot } from "~/components/OrdinalAxisPlot/OrdinalAxisPlot.css";

export const container = style({
  maxWidth: "960px",
  margin: "0 auto",
  padding: "2rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export const pageTitle = style({
  fontSize: "2rem",
  fontWeight: "800",
  color: vars.color.title,
  textAlign: "center",
  letterSpacing: "-0.02em",
});

export const sectionCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "1rem",
  padding: "2rem",
  boxShadow: vars.shadow.md,
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const sectionTitle = style({
  fontSize: "1.25rem",
  fontWeight: "700",
  color: vars.color.title,
  margin: 0,
});

export const sectionDesc = style({
  fontSize: "0.9rem",
  color: vars.color.textMuted,
  margin: 0,
});

export const candidateGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "0.75rem",
});

export const candidateCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 0.75rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.875rem",
  backgroundColor: "transparent",
  color: vars.color.text,
  cursor: "pointer",
  fontFamily: vars.font.body,
  textAlign: "center",
  transition: "border-color 0.15s, background-color 0.15s",
  ":hover": {
    borderColor: vars.color.primary,
    backgroundColor: vars.color.primaryTransparent,
  },
});

export const candidateCardActive = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 0.75rem",
  border: `2px solid ${vars.color.primary}`,
  borderRadius: "0.875rem",
  backgroundColor: vars.color.primaryTransparent,
  color: vars.color.primary,
  cursor: "pointer",
  fontFamily: vars.font.body,
  textAlign: "center",
});

export const candidateCardAvatar = style({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
});

export const candidateCardHead = style({
  fontSize: "0.9rem",
  fontWeight: "700",
  lineHeight: "1.2",
  margin: 0,
});

export const candidateCardListName = style({
  fontSize: "0.7rem",
  color: vars.color.textMuted,
  margin: 0,
  lineHeight: "1.3",
});

export const emptyState = style({
  textAlign: "center",
  color: vars.color.textMuted,
  padding: "3rem",
  border: `1px dashed ${vars.color.border}`,
  borderRadius: "1rem",
});

export const axesStack = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "2rem",
  justifyContent: "center",
});

export const dimensionGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  flex: "1 1 250px",
  minWidth: "220px",
  maxWidth: "250px",
});

export const dimensionTitle = style({
  fontSize: "0.875rem",
  fontWeight: "700",
  color: vars.color.text,
  textAlign: "center",
  margin: 0,
});

export const axisWrapper = style({
  position: "relative",
});

globalStyle(`${axisWrapper} .${plot}`, {
  height: "280px",
});

export const tagFilterRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  position: "sticky",
  top: vars.layout.headerHeight,
  backgroundColor: vars.color.surface,
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  zIndex: 40,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: "0.5rem",
});

export const tagPill = style({
  padding: "0.25rem 0.75rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "9999px",
  backgroundColor: "transparent",
  color: vars.color.text,
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: vars.font.body,
  ":hover": {
    borderColor: vars.color.primary,
    color: vars.color.primary,
  },
});

export const tagPillActive = style({
  padding: "0.25rem 0.75rem",
  border: `1px solid ${vars.color.primary}`,
  borderRadius: "9999px",
  backgroundColor: vars.color.primaryTransparent,
  color: vars.color.primary,
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: vars.font.body,
  fontWeight: "600",
});

export const comparisonGrid = style({
  display: "grid",
  gap: "1rem",
  alignItems: "start",
});

export const candidateColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const candidateHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  position: "sticky",
  top: `calc(${vars.layout.headerHeight} + 3.5rem)`,
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  paddingTop: "0.5rem",
  paddingBottom: "0.75rem",
  zIndex: 20,
  fontWeight: "600",
  fontSize: "0.9rem",
});

export const candidateLogo = style({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "contain",
  backgroundColor: vars.color.backgroundMuted,
  flexShrink: 0,
});

export const measureCard = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.75rem",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  ":hover": {
    boxShadow: vars.shadow.md,
  },
});

export const measureTitle = style({
  fontSize: "0.9rem",
  fontWeight: "600",
  color: vars.color.title,
  margin: 0,
});

export const measureTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
});

export const tagBadge = style({
  padding: "0.125rem 0.5rem",
  borderRadius: "9999px",
  backgroundColor: vars.color.backgroundMuted,
  color: vars.color.textMuted,
  fontSize: "0.7rem",
  fontWeight: "500",
});

export const measureLink = style({
  fontSize: "0.8rem",
  color: vars.color.primary,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
});

export const noMeasurePlaceholder = style({
  color: vars.color.textMuted,
  fontStyle: "italic",
  fontSize: "0.875rem",
  textAlign: "center",
  padding: "2rem",
  margin: 0,
});

export const candidateLogoTrigger = style({
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const candidateTooltip = style({
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  padding: "0.5rem",
  borderRadius: "6px",
  fontSize: "0.75rem",
  boxShadow: vars.shadow.md,
});

export const plotCandidateLogo = style({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const charterTableWrapper = style({
  overflowX: "auto",
});

export const charterTable = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.85rem",
});

export const charterThLabel = style({
  width: "auto",
});

export const charterThCandidate = style({
  textAlign: "center",
  padding: "0.25rem 0.5rem",
  width: "56px",
  minWidth: "56px",
});

export const charterCandidateAvatar = style({
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  margin: "0 auto",
});

export const charterRow = style({
  borderTop: `1px solid ${vars.color.border}`,
});

export const charterTdLabel = style({
  padding: "0.6rem 0.5rem 0.6rem 0",
  verticalAlign: "middle",
});

export const charterTitleLink = style({
  display: "block",
  fontWeight: "600",
  color: vars.color.primary,
  textDecoration: "none",
  fontSize: "0.85rem",
  ":hover": { textDecoration: "underline" },
});

export const charterOrg = style({
  display: "block",
  fontSize: "0.72rem",
  color: vars.color.textMuted,
  marginTop: "0.1rem",
});

export const charterTdCell = style({
  textAlign: "center",
  verticalAlign: "middle",
  padding: "0.5rem",
});

export const charterSigned = style({
  color: vars.color.success,
  fontSize: "1.1rem",
  display: "block",
  margin: "0 auto",
});

export const charterNotSigned = style({
  color: vars.color.border,
  fontSize: "1.1rem",
  display: "block",
  margin: "0 auto",
});

export const charterPartial = style({
  display: "inline-block",
  padding: "0.15rem 0.4rem",
  borderRadius: "10px",
  backgroundColor: vars.color.primaryTransparent,
  color: vars.color.primary,
  fontSize: "0.72rem",
  fontWeight: "700",
});

export const charterNoData = style({
  color: vars.color.textMuted,
  fontSize: "0.85rem",
});

export const charterDetailLink = style({
  display: "inline-block",
  marginTop: "0.75rem",
  fontSize: "0.82rem",
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: "600",
  ":hover": { textDecoration: "underline" },
});
