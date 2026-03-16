import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  margin: "3rem 0",
});

export const header = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "1rem",
  marginBottom: "1.5rem",
});

export const title = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: vars.color.title,
  margin: 0,
});

export const toggleGroup = style({
  display: "flex",
  gap: "0.5rem",
  flexShrink: 0,
});

export const toggleButton = style({
  padding: "0.4rem 1rem",
  borderRadius: "50px",
  border: `1px solid ${vars.color.primary}`,
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "500",
  transition: "all 0.2s ease-in-out",
  backgroundColor: "transparent",
  color: vars.color.primary,
  ":hover": {
    backgroundColor: vars.color.primaryTransparent,
  },
});

export const toggleButtonActive = style({
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  ":hover": {
    backgroundColor: vars.color.primaryHover,
  },
});

export const barRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "0.5rem",
});

export const barLabel = style({
  width: "220px",
  flexShrink: 0,
  overflow: "hidden",
});

export const barLabelName = style({
  fontWeight: "600",
  fontSize: "0.9rem",
  color: vars.color.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const barLabelList = style({
  fontSize: "0.72rem",
  color: vars.color.textMuted,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const barTrack = style({
  flex: 1,
  backgroundColor: vars.color.backgroundMuted,
  borderRadius: "4px",
  overflow: "hidden",
  height: "20px",
});

export const barFill = style({
  height: "100%",
  borderRadius: "4px",
  transition: "width 0.4s ease-in-out",
  backgroundColor: vars.color.textMuted,
});

export const barFillQualified = style({
  backgroundColor: vars.color.primary,
});

export const barFillAbstention = style({
  backgroundColor: vars.color.border,
});

export const barFillBlank = style({
  backgroundColor: vars.color.backgroundMuted,
  border: `1px solid ${vars.color.border}`,
});

export const barValue = style({
  width: "52px",
  textAlign: "right",
  fontWeight: "bold",
  fontSize: "0.9rem",
  color: vars.color.text,
  flexShrink: 0,
});

export const barVoix = style({
  width: "80px",
  textAlign: "right",
  fontSize: "0.75rem",
  color: vars.color.textMuted,
  flexShrink: 0,
});

export const qualifiedBadge = style({
  display: "inline-block",
  backgroundColor: vars.color.success,
  color: vars.color.primaryText,
  fontSize: "0.65rem",
  fontWeight: "bold",
  padding: "0.1rem 0.4rem",
  borderRadius: "4px",
  marginLeft: "0.25rem",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
});

export const note = style({
  fontSize: "0.8rem",
  color: vars.color.textMuted,
  fontStyle: "italic",
  marginTop: "1rem",
});

export const separator = style({
  borderTop: `1px dashed ${vars.color.border}`,
  margin: "0.75rem 0",
});
