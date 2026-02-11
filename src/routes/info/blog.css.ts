import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const header = style({
  marginBottom: "3rem",
  textAlign: "center",
});

export const headerWithCoverImage = style({
  backgroundPosition: "center center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
});

export const headerContent = style({
  selectors: {
    [`${headerWithCoverImage} &`]: {
      backgroundColor: vars.color.backdropBackground, // Ensure background is set
      backdropFilter: "blur(7px)",
    },
  },
});

export const container = style({
  maxWidth: vars.layout.maxWidth,
  margin: "0 auto",
  padding: "1px 2rem 2rem",
  fontFamily: "system-ui, sans-serif",
});

export const coverImage = style({
  width: "100%",
  height: "auto",
  maxHeight: "400px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "2rem",
});

export const title = style({
  fontSize: "2.5rem",
  fontWeight: "800",
  color: vars.color.title,
  lineHeight: "1em",
  marginBottom: "1rem",
});

export const meta = style({
  color: vars.color.textMuted,
  fontSize: "0.9rem",
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
});

export const postList = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const content = style({
  lineHeight: "1.8",
  color: vars.color.text,
  fontSize: "1.1rem",
  maxWidth: "800px",
  margin: "0 auto",
});

// Styles globaux pour le contenu HTML généré par le Markdown
globalStyle(`${content} h2`, {
  marginTop: "2rem",
  marginBottom: "1rem",
  fontSize: "1.8rem",
  color: vars.color.title,
});
globalStyle(`${content} hr`, {
  marginTop: "2rem",
  marginBottom: "1rem",
  border: "none",
});

globalStyle(`${content} p`, {
  marginBottom: "1.5rem",
});

globalStyle(`${content} ul, ${content} ol`, {
  marginBottom: "1.5rem",
  paddingLeft: "2rem",
});

globalStyle(`${content} p + ul, ${content} p + ol`, {
  marginTop: "-1rem",
});

globalStyle(`${content} li`, {
  marginBottom: "0.25rem",
});

globalStyle(`${content} img`, {
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
  marginTop: "1.5rem",
  marginBottom: "1.5rem",
});

globalStyle(`${content} iframe`, {
  width: "100%",
  aspectRatio: "16 / 9",
  height: "auto",
  borderRadius: "12px",
  border: `1px solid ${vars.color.border}`,
  marginTop: "2rem",
  marginBottom: "2rem",
});
