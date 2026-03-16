import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: "700px",
  margin: "0 auto",
  padding: "2rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const progressBarWrapper = style({
  width: "100%",
  height: "6px",
  backgroundColor: vars.color.border,
  borderRadius: "3px",
  overflow: "hidden",
});

export const progressFill = style({
  height: "100%",
  backgroundColor: vars.color.primary,
  borderRadius: "3px",
  transition: "width 0.3s ease",
});

export const progressLabel = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  textAlign: "right",
});

export const questionText = style({
  fontSize: "1.4rem",
  fontWeight: "700",
  color: vars.color.title,
  lineHeight: "1.4",
  margin: 0,
});

export const optionsGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  "@media": {
    "(max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const optionCard = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  cursor: "pointer",
  transition: "box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.15s ease",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  selectors: {
    "&:hover": {
      boxShadow: vars.shadow.lg,
      borderColor: vars.color.primary,
    },
  },
});

export const optionCardSelected = style({
  borderColor: vars.color.primary,
  backgroundColor: vars.color.primaryTransparent,
  boxShadow: vars.shadow.md,
});

export const optionCardOther = style({
  opacity: "0.45",
  cursor: "default",
  selectors: {
    "&:hover": {
      boxShadow: "none",
      borderColor: vars.color.border,
    },
  },
});

export const optionTitle = style({
  fontSize: "1rem",
  fontWeight: "600",
  color: vars.color.title,
  margin: 0,
  lineHeight: "1.4",
});

export const optionContent = style({
  fontSize: "0.9rem",
  color: vars.color.text,
  margin: 0,
  lineHeight: "1.6",
});

export const candidateTag = style({
  fontSize: "0.78rem",
  fontWeight: "600",
  color: vars.color.primary,
  padding: "0.2rem 0.6rem",
  backgroundColor: vars.color.primaryTransparent,
  borderRadius: "999px",
  alignSelf: "flex-start",
});

export const nextButtonRow = style({
  display: "flex",
  justifyContent: "flex-end",
});

export const nextButton = style({
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primaryHover,
    },
  },
});

/* Results */

export const resultsSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  alignItems: "stretch",
});

export const resultsTitle = style({
  fontSize: "1.5rem",
  fontWeight: "800",
  color: vars.color.title,
  textAlign: "center",
  margin: 0,
});

export const resultsSummary = style({
  fontSize: "1rem",
  color: vars.color.text,
  textAlign: "center",
  margin: 0,
});

export const candidateResultRow = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "0.75rem",
  padding: "1rem",
});

export const candidateResultRowWinner = style({
  border: `2px solid ${vars.color.primary}`,
  backgroundColor: vars.color.primaryTransparent,
});

export const candidatePicture = style({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
});

export const candidateInfo = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
});

export const candidateName = style({
  fontSize: "0.9rem",
  fontWeight: "600",
  color: vars.color.title,
  margin: 0,
});

export const scoreBar = style({
  width: "100%",
  height: "8px",
  backgroundColor: vars.color.border,
  borderRadius: "4px",
  overflow: "hidden",
});

export const scoreBarFill = style({
  height: "100%",
  backgroundColor: vars.color.primary,
  borderRadius: "4px",
  transition: "width 0.5s ease",
});

export const scorePercent = style({
  fontSize: "0.85rem",
  fontWeight: "700",
  color: vars.color.primary,
});

export const ctaButton = style({
  display: "block",
  textAlign: "center",
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  borderRadius: "0.5rem",
  padding: "1rem 1.5rem",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  transition: "background-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primaryHover,
    },
  },
  "@media": {
    "(max-width: 600px)": {
      width: "100%",
      boxSizing: "border-box",
    },
  },
});

export const winnerBadge = style({
  fontSize: "0.75rem",
  fontWeight: "700",
  color: vars.color.primaryText,
  backgroundColor: vars.color.primary,
  padding: "0.15rem 0.5rem",
  borderRadius: "999px",
  alignSelf: "flex-start",
});
