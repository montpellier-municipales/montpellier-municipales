import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const toggleBaseStyle = style({
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.text,
  borderRadius: "100%",
  aspectRatio: "1/1",
  height: "40px",
  width: "40px",
  flexBasis: "40px",
  flexShrink: 0,
  flexGrow: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "24px",

  ":hover": {
    color: vars.color.primary,
  },
});
