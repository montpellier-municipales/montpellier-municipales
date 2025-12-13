import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const select = style({
  border: "none",
});

export const selectTrigger = style({
  padding: 16,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.text,
  borderLeft: "none",
  borderRight: "none",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  width: "100%",
  fontSize: "16px",
});

export const iconContainer = style({
  fontSize: "24px",
});

export const popover = style({
  background: vars.color.background,
  color: vars.color.text,
  border: vars.color.border,
  borderRadius: "4px",
  boxShadow: vars.shadow.md,
  padding: "8px",
  width: vars.layout.sidebarWidth,
  boxSizing: "border-box",
});

export const popoverItem = style({
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "8px",
});
