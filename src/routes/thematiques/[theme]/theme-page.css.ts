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
  gap: "0.75rem",
});

export const h1 = style({
  fontSize: "2rem",
  fontWeight: 800,
  color: vars.color.title,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

export const intro = style({
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: vars.color.text,
  maxWidth: "700px",
});

export const quickAnswer = style({
  backgroundColor: vars.color.backgroundMuted,
  border: `1px solid ${vars.color.border}`,
  borderLeft: `4px solid ${vars.color.primary}`,
  borderRadius: "8px",
  padding: "1rem 1.25rem",
  fontSize: "1rem",
  color: vars.color.text,
  lineHeight: 1.6,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "0.5rem",
});

export const sectionTitle = style({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: vars.color.title,
});

export const rankingTable = style({
  display: "flex",
  flexDirection: "column",
  gap: "0",
});

export const rankingRow = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0.75rem 0",
  borderBottom: `1px solid ${vars.color.border}`,
  flexWrap: "wrap",
});

export const rankNumber = style({
  color: vars.color.textMuted,
  fontSize: "0.85rem",
  fontWeight: 600,
  minWidth: "1.5rem",
  flexShrink: 0,
});

export const candidateLink = style({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  textDecoration: "none",
  color: vars.color.text,
  fontWeight: 500,
  flex: 1,
  minWidth: "180px",
  ":hover": {
    color: vars.color.primary,
  },
});

export const candidateLogo = style({
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
});

export const listName = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  fontWeight: 400,
});

export const scoreChip = style({
  fontSize: "0.78rem",
  fontWeight: 600,
  padding: "0.25rem 0.6rem",
  borderRadius: "99px",
  backgroundColor: vars.color.backgroundMuted,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  whiteSpace: "nowrap",
});

export const measureCountChip = style({
  fontSize: "0.78rem",
  fontWeight: 600,
  padding: "0.25rem 0.6rem",
  borderRadius: "99px",
  backgroundColor: vars.color.backgroundMuted,
  color: vars.color.primary,
  border: `1px solid ${vars.color.primary}`,
  whiteSpace: "nowrap",
});

export const compassLink = style({
  alignSelf: "flex-start",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: vars.color.primary,
  textDecoration: "none",
  marginTop: "0.5rem",
  ":hover": {
    textDecoration: "underline",
  },
});

export const candidateBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginTop: "0.5rem",
});

export const candidateBlockHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});

export const candidateAvatar = style({
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
});

export const candidateBlockName = style({
  fontWeight: 700,
  color: vars.color.text,
  textDecoration: "none",
  fontSize: "0.95rem",
  ":hover": {
    color: vars.color.primary,
  },
});

export const measuresGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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

export const measureTitle = style({
  fontSize: "0.95rem",
  fontWeight: 600,
  color: vars.color.text,
  textDecoration: "none",
  lineHeight: 1.4,
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

export const comparatorCta = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  alignSelf: "flex-start",
  padding: "0.65rem 1.25rem",
  borderRadius: "8px",
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  fontWeight: 600,
  fontSize: "0.95rem",
  textDecoration: "none",
  marginTop: "0.25rem",
  ":hover": {
    backgroundColor: vars.color.primaryHover,
  },
});

export const articlesGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1rem",
});

export const articleCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "12px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "box-shadow 0.15s ease",
  ":hover": {
    boxShadow: vars.shadow.md,
  },
});

export const articleCover = style({
  width: "100%",
  height: "160px",
  objectFit: "cover",
});

export const articleBody = style({
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const articleTitle = style({
  fontWeight: 700,
  fontSize: "0.95rem",
  color: vars.color.text,
  textDecoration: "none",
  lineHeight: 1.4,
  ":hover": {
    color: vars.color.primary,
  },
});

export const articleExcerpt = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  lineHeight: 1.5,
});
