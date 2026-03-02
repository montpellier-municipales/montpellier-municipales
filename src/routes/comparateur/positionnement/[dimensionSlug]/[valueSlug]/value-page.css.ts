import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  padding: "3rem 1rem",
  maxWidth: "900px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const breadcrumb = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
});

export const breadcrumbLink = style({
  color: vars.color.textMuted,
  textDecoration: "none",
  ":hover": {
    color: vars.color.primary,
    textDecoration: "underline",
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const dimensionLabel = style({
  fontSize: "0.8rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: vars.color.primary,
});

export const title = style({
  fontSize: "2rem",
  fontWeight: 800,
  color: vars.color.title,
  letterSpacing: "-0.02em",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

export const description = style({
  fontSize: "1rem",
  color: vars.color.text,
  lineHeight: "1.7",
  maxWidth: "680px",
});

export const excludedBox = style({
  backgroundColor: vars.color.backgroundMuted,
  border: `1px solid ${vars.color.border}`,
  borderLeft: `4px solid ${vars.color.secondary}`,
  borderRadius: "8px",
  padding: "1rem 1.25rem",
  fontSize: "0.95rem",
  color: vars.color.text,
  lineHeight: "1.6",
});

export const safetyLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.primary,
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "0.95rem",
  padding: "0.6rem 1rem",
  border: `1px solid ${vars.color.primary}`,
  borderRadius: "8px",
  alignSelf: "flex-start",
  ":hover": {
    backgroundColor: vars.color.primaryTransparent,
  },
});

export const dimensionNav = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const dimensionNavLabel = style({
  fontSize: "0.8rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: vars.color.textMuted,
});

export const dimensionNavPills = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});

export const dimensionNavPill = style({
  fontSize: "0.85rem",
  fontWeight: 500,
  padding: "0.35rem 0.75rem",
  borderRadius: "99px",
  border: `1px solid ${vars.color.border}`,
  color: vars.color.text,
  textDecoration: "none",
  backgroundColor: vars.color.surface,
  transition: "all 0.15s ease",
  ":hover": {
    borderColor: vars.color.primary,
    color: vars.color.primary,
  },
});

export const activePill = style({
  backgroundColor: vars.color.primary,
  borderColor: vars.color.primary,
  color: vars.color.primaryText,
  ":hover": {
    backgroundColor: vars.color.primaryHover,
    borderColor: vars.color.primaryHover,
    color: vars.color.primaryText,
  },
});

export const measuresSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
});

export const measuresHeading = style({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: vars.color.title,
});

export const noMeasures = style({
  color: vars.color.textMuted,
  fontStyle: "italic",
  fontSize: "0.95rem",
});

export const measuresGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1rem",
});

export const measureCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "12px",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  transition: "box-shadow 0.15s ease",
  ":hover": {
    boxShadow: vars.shadow.md,
  },
});

export const candidateInfo = style({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
});

export const candidateLink = style({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  textDecoration: "none",
  color: vars.color.textMuted,
  fontSize: "0.8rem",
  fontWeight: 600,
  ":hover": {
    color: vars.color.primary,
  },
});

export const candidateLogo = style({
  borderRadius: "50%",
  objectFit: "cover",
});

export const measureTitle = style({
  fontSize: "0.95rem",
  fontWeight: 600,
  color: vars.color.text,
  textDecoration: "none",
  lineHeight: "1.4",
  ":hover": {
    color: vars.color.primary,
  },
});

export const tagList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  marginTop: "auto",
});

export const tagBadge = style({
  fontSize: "0.7rem",
  fontWeight: 500,
  padding: "0.2rem 0.5rem",
  borderRadius: "99px",
  backgroundColor: vars.color.backgroundMuted,
  color: vars.color.textMuted,
});
