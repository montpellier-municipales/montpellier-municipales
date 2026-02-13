import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const nav = style({
  position: "sticky",
  top: vars.layout.headerHeight,
  backgroundColor: vars.color.background,
  margin: "0 -2rem 2rem",
  padding: "0 2rem",
  zIndex: 99,
});

export const tabList = style({
  display: "flex",
  gap: "1.5rem",
  padding: "1.5rem 0 0",
  borderBottom: `1px solid ${vars.color.border}`,
  overflowX: "auto",
  whiteSpace: "nowrap",
  scrollbarWidth: "none",
  "::-webkit-scrollbar": {
    display: "none",
  },
});

export const tab = style({
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "600",
  color: vars.color.textMuted,
  padding: "0.5rem 0",
  border: "none",
  background: "none",
  borderBottom: "2px solid transparent",
  transition: "all 0.2s ease-in-out",
  cursor: "pointer",
  outline: "none",
  ":hover": {
    color: vars.color.primary,
  },
  selectors: {
    '&[data-state="selected"]': {
      color: vars.color.primary,
      borderColor: vars.color.primary,
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 2px ${vars.color.primary}`,
      borderRadius: "4px",
    },
  },
});
