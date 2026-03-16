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
});

export const scorePercent = style({
  fontSize: "0.85rem",
  fontWeight: "700",
  color: vars.color.primary,
});

export const winnerBadge = style({
  fontSize: "0.75rem",
  fontWeight: "700",
  color: vars.color.primaryText,
  backgroundColor: vars.color.primary,
  padding: "0.15rem 0.5rem",
  borderRadius: "999px",
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

export const retryButton = style({
  display: "block",
  textAlign: "center",
  backgroundColor: vars.color.surface,
  color: vars.color.title,
  border: `1.5px solid ${vars.color.border}`,
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primaryTransparent,
      borderColor: vars.color.primary,
    },
  },
  "@media": {
    "(max-width: 600px)": {
      width: "100%",
      boxSizing: "border-box",
    },
  },
});

/* Share section */

export const shareSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.75rem",
});

export const sharePrimary = style({
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.9rem 2rem",
  fontSize: "1.1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primaryHover,
    },
  },
});

export const shareFallback = style({
  display: "none",
  flexDirection: "row",
  gap: "0.75rem",
  flexWrap: "wrap",
  justifyContent: "center",
  "@media": {
    "(pointer: fine)": {
      display: "flex",
    },
  },
});

export const shareFallbackVisible = style({
  display: "flex",
  flexDirection: "row",
  gap: "0.75rem",
  flexWrap: "wrap",
  justifyContent: "center",
});

export const shareLink = style({
  backgroundColor: vars.color.surface,
  color: vars.color.title,
  border: `1.5px solid ${vars.color.border}`,
  borderRadius: "0.5rem",
  padding: "0.5rem 1rem",
  fontSize: "0.9rem",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primaryTransparent,
      borderColor: vars.color.primary,
    },
  },
});

export const copyConfirm = style({
  fontSize: "0.8rem",
  color: vars.color.success,
  textAlign: "center",
});
