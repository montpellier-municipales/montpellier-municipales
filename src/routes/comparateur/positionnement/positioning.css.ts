import { vars } from "~/theme.css";
import { style, keyframes } from "@vanilla-extract/css";

export const container = style({
  padding: "4rem 1rem",
  maxWidth: "900px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export const header = style({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const title = style({
  fontSize: "2rem",
  fontWeight: "800",
  color: vars.color.title,
  letterSpacing: "-0.02em",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

export const description = style({
  fontSize: "0.95rem",
  color: vars.color.textMuted,
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.5",
});

export const microText = style({
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: vars.color.textMuted,
  fontWeight: "600",
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: "0.5rem",
  marginBottom: "1rem",
});

export const axesStack = style({
  display: "flex",
  flexDirection: "row",
  gap: "32px",
  flexWrap: "wrap",
  justifyContent: "center",
});

export const dimensionGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const dimensionTitle = style({
  fontSize: "1.1rem",
  fontWeight: "700",
  color: vars.color.text,
  textAlign: "center",
});

export const axisWrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "0 0.5rem",
});

export const axisLine = style({
  height: "2px",
  flex: 1,
  background: `linear-gradient(to right, ${vars.color.textMuted}33, ${vars.color.primary}66)`,
  position: "relative",
  borderRadius: "2px",
  ":after": {
    content: '""',
    position: "absolute",
    right: "-8px",
    top: "-4px",
    width: "10px",
    height: "10px",
    borderRight: `2px solid ${vars.color.primary}66`,
    borderTop: `2px solid ${vars.color.primary}66`,
    transform: "rotate(45deg)",
  },
});

export const labelContainer = style({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "1rem",
  alignItems: "flex-start",
});

export const labelLeft = style({
  fontSize: "0.85rem",
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase",
  maxWidth: "40%",
  textAlign: "left",
  fontFamily: "monospace", // Sharper/Rigid
});

export const labelRight = style({
  fontSize: "0.9rem",
  color: vars.color.primary,
  fontWeight: "500",
  maxWidth: "40%",
  textAlign: "right",
  borderRadius: "12px",
  fontFamily: "system-ui, sans-serif", // Organic/Rounded
});

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, 10px)" },
  to: { opacity: 1, transform: "translate(-50%, 0)" },
});

export const marker = style({
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.primary}`,
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  zIndex: 2,
  overflow: "hidden",
  boxShadow: vars.shadow.sm,
  ":hover": {
    transform: "translate(-50%, -50%) scale(1.2)",
    zIndex: 10,
    boxShadow: vars.shadow.md,
  },
});

export const markerLogo = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const tooltip = style({
  position: "absolute",
  bottom: "140%",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: vars.color.title,
  color: "white",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 0.2s ease",
  selectors: {
    [`${marker}:hover &`]: {
      opacity: 1,
      animation: `${fadeIn} 0.2s ease forwards`,
    },
  },
  ":after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-5px",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: `${vars.color.title} transparent transparent transparent`,
  },
});

export const markerStagger = style({
  marginTop: "10px", // Use for overlapping stacking
});

export const candidateItem = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease",
  ":hover": {
    boxShadow: vars.shadow.md,
    transform: "scale(1.05)",
  },
});

export const candidateLogoTrigger = style({
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const candidateLogo = style({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const candidateName = style({
  fontSize: "0.75rem",
  color: vars.color.text,
  fontWeight: "500",
  visibility: "hidden",
  selectors: {
    [`${candidateItem}:hover &`]: {
      visibility: "visible",
    },
  },
});

export const candidateTooltip = style({
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  padding: "0.5rem",
  borderRadius: "6px",
  fontSize: "0.75rem",
  boxShadow: vars.shadow.md,
});
