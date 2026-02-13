import { style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const header = style({
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "sticky",
  top: 0,
  height: vars.layout.headerHeight,
  zIndex: 100,
  boxShadow: vars.shadow.sm,
});

export const container = style({
  gap: 32,
  width: "100%",
});

export const logo = style({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "4px 0",
  ":hover": {
    textDecoration: "none",
  },
});

export const nav = style({
  display: "flex",
  alignItems: "center",
  flex: "1 1 auto",
  gap: 16,
  overflow: "hidden",

  "@media": {
    "screen and (max-width: 768px)": {
      display: "none",
    },
  },
});

export const link = style({
  textDecoration: "none",
  color: vars.color.textMuted,
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: "color 0.2s",
  ":hover": {
    color: vars.color.primary,
    textDecoration: "none",
  },
});

export const activeLink = style({
  color: vars.color.primary,
  fontWeight: 600,
});

export const rightSection = style({
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
});

export const popover = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  boxShadow: vars.shadow.lg,
  padding: "8px",
  flexDirection: "column",
  gap: "4px",
  minWidth: "200px",
  marginTop: "8px",
  display: "none",
  selectors: {
    "&[data-open]": {
      display: "flex",
    },
  },
});

export const popoverLink = style([
  link,
  {
    padding: "8px 12px",
    borderRadius: "4px",
    display: "block",
    ":hover": {
      backgroundColor: vars.color.background,
      color: vars.color.primary,
    },
  },
]);

export const budgetTrigger = style([
  link,
  {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    padding: 0,
  },
]);
