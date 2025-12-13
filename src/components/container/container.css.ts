import { style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const container = style({
  maxWidth: vars.layout.maxWidth,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: "1 1 auto",
  margin: "auto",
});
