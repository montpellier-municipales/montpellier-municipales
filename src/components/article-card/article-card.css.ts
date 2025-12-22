import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const card = style({
  display: "block",
  padding: "2rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  transition: "transform 0.2s",
  backgroundColor: vars.color.background, // Ensure background is set
  ":hover": {
    transform: "scale(1.02)", // Slightly less aggressive zoom
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Add a subtle shadow on hover
  },
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
