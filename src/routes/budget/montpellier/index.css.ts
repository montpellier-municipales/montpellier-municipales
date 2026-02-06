import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
});

export const title = style({
  fontSize: "2.5rem",
  fontWeight: "800",
  marginBottom: "1.5rem",
  color: vars.color.title,
});

export const navSection = style({
  marginBottom: "4rem",
  backgroundColor: vars.color.background, // Was #f7fafc (gray50 in theme)
  padding: "1.5rem",
  borderRadius: "0.5rem",
  border: `1px solid ${vars.color.border}`,
});

export const navTitle = style({
  fontSize: "1.25rem",
  fontWeight: "700",
  marginBottom: "1rem",
  color: vars.color.title,
});

export const navGrid = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
});

export const yearLink = style({
  padding: "0.5rem 1rem",
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.375rem",
  textDecoration: "none",
  color: vars.color.text,
  fontWeight: "600",
  transition: "all 0.2s",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primary,
      color: vars.color.primaryText,
      borderColor: vars.color.primary,
      transform: "translateY(-2px)",
      boxShadow: vars.shadow.md,
    },
  },
});

export const section = style({
  marginBottom: "4rem",
});

export const sectionTitle = style({
  fontSize: "2rem",
  fontWeight: "700",
  marginBottom: "1rem",
  color: vars.color.title,
});

export const sectionText = style({
  marginBottom: "2rem",
  fontSize: "1.1rem",
  color: vars.color.textMuted,
});

export const linkContainer = style({
  textAlign: "right",
});

export const detailLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.primary,
  fontWeight: "600",
  textDecoration: "none",
  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export const highlight = style({
  color: vars.color.primary,
});
