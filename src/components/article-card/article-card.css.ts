import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const card = style({
  display: "block",
  border: `1px solid ${vars.color.border}`,
  minWidth: "360px",
  maxWidth: "100%",
  flex: "1 0 360px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  transition: "transform 0.2s",
  backgroundColor: vars.color.background, // Ensure background is set
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
  ":hover": {
    transform: "scale(1.02)", // Slightly less aggressive zoom
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Add a subtle shadow on hover
  },
});

export const cardWithCover = style({
  paddingTop: 200,
});

export const cardContent = style({
  backgroundColor: vars.color.backdropBackground, // Ensure background is set
  padding: "1px 2rem 1px",
  backdropFilter: "blur(7px)",
});

export const image = style({
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "4px",
  marginBottom: "1rem",
});

export const title = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: vars.color.title,
  lineHeight: "1.3",
});

export const date = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  marginBottom: "1rem",
});

export const excerpt = style({
  lineHeight: "1.6",
  color: vars.color.text,
});
