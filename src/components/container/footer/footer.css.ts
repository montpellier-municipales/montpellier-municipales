import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const footer = style({
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  padding: "4rem 2rem 2rem",
  marginTop: "auto",
});

export const container = style({
  maxWidth: vars.layout.maxWidth,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "3rem",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
  },
});

export const brandColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      alignItems: "flex-start",
      textAlign: "left",
    },
  },
});

export const logo = style({
  width: "60px",
  height: "60px",
  objectFit: "contain",
});

export const title = style({
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: vars.color.title,
});

export const tagline = style({
  color: vars.color.textMuted,
  fontSize: "0.9rem",
  lineHeight: "1.5",
});

export const linksColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      alignItems: "flex-start",
      textAlign: "left",
    },
  },
});

export const link = style({
  color: vars.color.text,
  textDecoration: "none",
  transition: `color 0.2s ${vars.defaultTransition}`,
  ":hover": {
    color: vars.color.primary,
  },
});

export const socialColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      alignItems: "flex-end",
      textAlign: "right",
    },
  },
});

export const socialLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  borderRadius: "9999px",
  fontWeight: "bold",
  textDecoration: "none",
  transition: `background-color 0.2s ${vars.defaultTransition}`,
  ":hover": {
    backgroundColor: vars.color.primaryHover,
    textDecoration: "none",
  },
});

export const copyright = style({
  paddingTop: "2rem",
  textAlign: "center",
  color: vars.color.textMuted,
  fontSize: "0.85rem",
});

globalStyle(`${copyright} a`, {
  color: "inherit",
  textDecoration: "underline",
});
