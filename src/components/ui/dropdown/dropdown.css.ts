import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "100%", // Prevent overflow
  boxSizing: "border-box",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  color: vars.color.text,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.375rem",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
  ":hover": {
    borderColor: vars.color.textMuted,
  },
  ":focus": {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}1A`, // 10% opacity hex hack, idealement utiliser rgba
  },
});

export const displayValue = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  textAlign: "left",
});

export const popover = style({
  // Position is handled by the headless component (floating-ui)
  minWidth: "220px", // Ensure it's not too narrow
  maxWidth: "90vw", // Prevent overflow on mobile
  maxHeight: "40vh", // Limit height to 40% of viewport to avoid full screen takeover
  overflowY: "auto",
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.375rem",
  boxShadow: vars.shadow.lg,
  zIndex: 9999, // Ensure it sits on top
  marginTop: "0.25rem",
  overscrollBehavior: "contain", // Prevent scrolling the background
});

export const item = style({
  display: "flex",
  alignItems: "center", // Default to center for single line
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  color: vars.color.text,
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.1s",
  ":hover": {
    backgroundColor: vars.color.background,
    color: vars.color.primary,
  },
  ":focus": {
    backgroundColor: vars.color.background,
    color: vars.color.primary,
  },
  selectors: {
    "&[data-highlighted]": {
      backgroundColor: vars.color.background,
      color: vars.color.primary,
    },
  },
});

export const itemContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: 1,
  gap: "0.125rem",
});

export const description = style({
  fontSize: "0.75rem",
  color: vars.color.textMuted,
});

export const label = style({
  fontWeight: "bold",
  color: vars.color.textMuted,
  padding: "0.5rem 0.75rem",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  backgroundColor: vars.color.background,
});
