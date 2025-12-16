import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: vars.layout.maxWidth,
  margin: "0 auto",
  padding: "2rem",
  fontFamily: vars.font.body,
});

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "2rem",
  marginBottom: "3rem",
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: "2rem",

  "@media": {
    "screen and (max-width: 768px)": {
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
  },
});

export const logo = style({
  width: "150px",
  height: "150px",
  objectFit: "contain",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const title = style({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: vars.color.title,
  margin: "0 0 0.5rem 0",
});

export const subtitle = style({
  fontSize: "1.25rem",
  color: vars.color.title,
  margin: 0,
});

export const programSection = style({
  marginTop: "2rem",
});

export const party = style({
  display: "inline-block",
  padding: "0.25rem 0.5rem",
  backgroundColor: vars.color.border,
  borderRadius: "4px",
  fontSize: "0.875rem",
  marginRight: "0.5rem",
});

export const themeCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: vars.shadow.md,
});

export const themeTitle = style({
  fontSize: "1.5rem",
  color: "#2c3e50",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const listSection = style({
  lineHeight: "1.5em",
});
