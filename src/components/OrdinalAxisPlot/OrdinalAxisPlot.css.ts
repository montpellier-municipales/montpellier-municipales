import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const plot = style({
  height: "600px",
  display: "flex",
  gap: "4px",
});
export const axisGradient = style({
  display: "block",
  width: "8px",
  height: "100%",
  background: `linear-gradient(0deg, ${vars.color.primary} 0%, ${vars.color.border} 50%, ${vars.color.success} 100%)`,
  borderRadius: "4px",
});

export const axis = style({
  display: "flex",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  alignItems: "center",
  flexDirection: "column",
  gap: "8px",
  selectors: {
    "&:first-child": {
      alignItems: "flex-end",
      textAlign: "right",
    },
    "&:last-child": {
      alignItems: "flex-start",
    },
  },
});

export const axisColumn = style({
  textAlign: "center",
  flex: "1 1 1%",
});

export const axisTick = style({
  fontWeight: 600,
  marginBottom: "0.5rem",
});

export const tickLink = style({
  color: "inherit",
  textDecoration: "none",
  ":hover": {
    color: vars.color.primary,
    textDecoration: "underline",
  },
});

export const axisItems = style({
  display: "flex",
  flexDirection: "row",
  gap: "4px",
  alignItems: "flex-start",
  justifyContent: "center",
});
