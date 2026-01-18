import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: vars.layout.maxWidth,
  margin: "0 auto",
  padding: "2rem",
  fontFamily: vars.font.body,
});

export const hero = style({
  textAlign: "center",
  marginBottom: "4rem",
});

export const title = style({
  fontSize: "3rem",
  fontWeight: "800",
  marginBottom: "1rem",
  backgroundColor: vars.color.primary,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const subtitle = style({
  fontSize: "1.25rem",
  color: vars.color.textMuted,
  maxWidth: "600px",
  margin: "0 auto",
});

export const textSection = style({
  margin: "0 auto",
  maxWidth: vars.layout.maxWidth,
  color: vars.color.text,
});

globalStyle(`${textSection} h1`, {
  fontSize: "3rem",
  fontWeight: "800",
  marginBottom: "1rem",
  backgroundColor: vars.color.primary,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
});

globalStyle(`${textSection} h2`, {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  color: vars.color.title,
  marginTop: "3rem",
});

globalStyle(`${textSection} p`, {
  lineHeight: "1.6",
  fontSize: "1.1rem",
});

globalStyle(`${textSection} ul li`, {
  marginBottom: "1rem",
});

export const sectionTitle = style({
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  color: vars.color.title,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
  margin: "4rem 0",
});

export const card = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.2s, box-shadow 0.2s",
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  backgroundColor: vars.color.surface,
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: vars.shadow.lg,
    textDecoration: "none",
  },
});

export const cardImage = style({
  width: "100%",
  height: "200px",
  backgroundColor: vars.color.background,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  objectFit: "cover",
});

export const cardContent = style({
  padding: "1.5rem",
});

export const cardTitle = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: vars.color.text,
});

export const cardSubtitle = style({
  fontSize: "1rem",
  color: vars.color.textMuted,
  marginBottom: "1rem",
});

export const tag = style({
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "20px",
  fontSize: "0.8rem",
  color: vars.color.textMuted,
  marginRight: "0.5rem",
  marginBottom: "0.5rem",
});

export const newsPreview = style({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  alignItems: "center",
});

export const articlesContainer = style({
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap-reverse",
});

export const buttonLink = style({
  display: "inline-block",
  textAlign: "center",
  backgroundColor: vars.color.secondary,
  color: vars.color.text, // Le texte sur le jaune est souvent foncé
  padding: "0.75rem 1.5rem",
  borderRadius: "50px",
  fontWeight: "bold",
  textDecoration: "none",
  transition: `transform 0.2s ${vars.defaultTransition}`,
  ":hover": {
    backgroundColor: vars.color.secondaryHover,
    transform: "scale(1.05)",
    textDecoration: "none",
  },
});
