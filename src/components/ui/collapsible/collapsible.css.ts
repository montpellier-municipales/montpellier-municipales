import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

const slideDown = keyframes({
  from: { height: 0, opacity: 0 },
  to: { height: "var(--qwikui-collapsible-content-height)", opacity: 1 },
});

const slideUp = keyframes({
  from: { height: "var(--qwikui-collapsible-content-height)", opacity: 1 },
  to: { height: 0, opacity: 0 },
});

export const root = style({
  width: "100%",
  borderRadius: "12px",
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  overflow: "hidden",
});

export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem 1.5rem",
  fontSize: "1rem",
  fontWeight: "600",
  color: vars.color.title,
  backgroundColor: vars.color.surface,
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: vars.color.background,
  },
  selectors: {
    "&[data-open]": {
      borderBottom: `1px solid ${vars.color.border}`,
    }
  }
});

export const content = style({
  overflow: "hidden",
  selectors: {
    "&[data-state='open']": {
      animation: `${slideDown} 300ms ease-out`,
    },
    "&[data-state='closed']": {
      animation: `${slideUp} 300ms ease-out`,
    },
  },
});

export const contentInner = style({
  padding: "1.5rem",
});

export const icon = style({
  transition: "transform 0.3s ease",
  selectors: {
    [`${trigger}[data-open] &`]: {
      transform: "rotate(180deg)",
    },
  },
});
