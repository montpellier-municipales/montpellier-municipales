import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: vars.layout.maxWidth,
  margin: "0 auto",
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
});

export const header = style({
  marginBottom: "3rem",
  textAlign: "center",
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

export const postCard = style({
  padding: "2rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  transition: "transform 0.2s",
  ":hover": {
    transform: "scale(1.05)",
  },
});

export const content = style({
  lineHeight: "1.8",
  color: vars.color.text,
  fontSize: "1.1rem",
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

globalStyle(`${content} strong`, {
  fontWeight: 500,
});
