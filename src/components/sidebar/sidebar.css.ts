import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

const modalFadeIn = keyframes({
  "0%": {
    opacity: 0,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    backdropFilter: `contrast(0%) blur(0px)`,
  },
  "100%": {
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: `contrast(30%) blur(4px)`,
  },
});
const modalFadeOut = keyframes({
  "0%": {
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: `contrast(30%) blur(4px)`,
  },
  "100%": {
    opacity: 0,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    backdropFilter: `contrast(0%) blur(0px)`,
  },
});

const sheetOpen = keyframes({
  "0%": { opacity: 0, transform: "translateX(100%)" },
  "100%": { opacity: 1, transform: "translateX(0%)" },
});
const sheetClose = keyframes({
  "0%": { opacity: 1, transform: "translateX(0%)" },
  "100%": { opacity: 0, transform: "translateX(100%)" },
});

export const backDrop = style({
  animation: `${modalFadeIn} 0.3s ${vars.defaultTransition}`,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  selectors: {
    "&[data-closing]": {
      animation: `${modalFadeOut} 0.3s ${vars.defaultTransition}`,
    },
  },
});

export const modalPanelSheet = style({
  alignItems: "stretch",
  justifyContent: "flex-start",
  flexDirection: "column",
  width: vars.layout.sidebarWidth,
  overflowY: "auto",
  border: 0,
  marginRight: 0,
  padding: 0,
  height: "100vh",
  animation: `${sheetOpen} 0.3s ${vars.defaultTransition}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  "::backdrop": {
    transition: `backgroundColor 0.3s ${vars.defaultTransition}, backdropFilter 0.3s ${vars.defaultTransition}, display 0.3s`,
    transitionBehavior: "allow-discrete",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: `contrast(30%) blur(4px)`,
    animation: `${modalFadeIn} 0.3s ${vars.defaultTransition}`,
  },
  selectors: {
    "&[data-closing]": {
      animation: `${sheetClose} 0.3s ${vars.defaultTransition}`,
    },
    "&[data-closing]::backdrop": {
      animation: `${modalFadeOut} 0.3s ${vars.defaultTransition}`,
    },
    "&[open]": {
      display: "flex",
    },
    "&[open]::backdrop": {
      transition: `backgroundColor 0.3s ${vars.defaultTransition}, backdropFilter 0.3s ${vars.defaultTransition}, display 0.3s`,
      transitionBehavior: "allow-discrete",
    },
  },
});

export const panelTitle = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  margin: "24px 8px",
  gap: 8,
});

export const menuList = style({
  listStyle: "none",
  margin: "24px 0",
  padding: 0,
});

export const menuListItem = style({
  display: "block",
  padding: 16,
  backgroundColor: vars.color.surface,
  borderTop: `1px solid ${vars.color.border}`,
  ":hover": {
    backgroundColor: vars.color.background,
    textDecoration: "none",
  },
  selectors: {
    "li:last-child &": {
      borderBottom: `1px solid ${vars.color.border}`,
    },
  },
});

export const activeMenuListItem = style({
  backgroundColor: vars.color.background,
});
