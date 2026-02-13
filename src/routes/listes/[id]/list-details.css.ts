import { style, globalStyle } from "@vanilla-extract/css";
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

export const programHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5rem",
  marginBottom: "2rem",
  flexWrap: "wrap",

  "@media": {
    "screen and (max-width: 640px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1rem",
    },
  },
});

globalStyle(`${programHeader} h2`, {
  margin: 0,
});

export const party = style({
  display: "inline-block",
  padding: "0.25rem 0.5rem",
  backgroundColor: vars.color.border,
  borderRadius: "4px",
  fontSize: "0.875rem",
  marginRight: "0.5rem",
});

export const filterContainer = style({
  minWidth: "280px",
  maxWidth: "400px",
  flex: 1,

  "@media": {
    "screen and (max-width: 640px)": {
      width: "100%",
      maxWidth: "100%",
    },
  },
});

export const filterButton = style({
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  cursor: "pointer",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.border,
    },
    "&[data-active='true']": {
      backgroundColor: vars.color.primary,
      color: "white",
      borderColor: vars.color.primary,
    },
  },
});

export const measureCardLink = style({
  textDecoration: "none",
  color: "inherit",
  display: "block",
  marginBottom: "1.5rem",
});

export const measureCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "12px",
  padding: "1.5rem",
  boxShadow: vars.shadow.sm,
  transition: "transform 0.2s ease, boxShadow 0.2s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: vars.shadow.md,
    },
  },
});

export const measureTitle = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: vars.color.title,
  marginBottom: "0.75rem",
  marginTop: 0,
});

export const tagList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
});

export const tagBadge = style({
  fontSize: "0.75rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "4px",
  backgroundColor: vars.color.primaryTransparent,
  color: vars.color.primary,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const measurePreview = style({
  color: vars.color.text,
  lineHeight: "1.6",
  fontSize: "1rem",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
});

export const listSection = style({
  lineHeight: "1.5em",
  marginBottom: "3rem",
});
