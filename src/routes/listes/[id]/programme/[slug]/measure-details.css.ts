import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem 1rem",
});

export const backLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.textMuted,
  textDecoration: "none",
  marginBottom: "2rem",
  fontSize: "0.95rem",
  transition: "color 0.2s ease",
  ":hover": {
    color: vars.color.primary,
  },
});

export const header = style({
  marginBottom: "2.5rem",
});

export const title = style({
  fontSize: "2.5rem",
  fontWeight: "800",
  color: vars.color.title,
  lineHeight: "1.2",
  marginBottom: "1rem",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2rem",
    },
  },
});

export const tagList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1.5rem",
});

export const tagBadge = style({
  backgroundColor: vars.color.surface,
  color: vars.color.primary,
  padding: "0.25rem 0.75rem",
  borderRadius: "100px",
  fontSize: "0.85rem",
  fontWeight: "600",
  border: `1px solid ${vars.color.border}`,
});

export const content = style({
  color: vars.color.text,
  lineHeight: "1.7",
  fontSize: "1.1rem",
});

globalStyle(`${content} h2`, {
  fontSize: "1.8rem",
  fontWeight: "700",
  marginTop: "2.5rem",
  marginBottom: "1rem",
  color: vars.color.title,
});

globalStyle(`${content} h3`, {
  fontSize: "1.4rem",
  fontWeight: "700",
  marginTop: "2rem",
  marginBottom: "0.75rem",
  color: vars.color.title,
});

globalStyle(`${content} p`, {
  marginBottom: "1.25rem",
});

globalStyle(`${content} ul, ${content} ol`, {
  marginBottom: "1.25rem",
  paddingLeft: "1.5rem",
});

globalStyle(`${content} li`, {
  marginBottom: "0.5rem",
});
