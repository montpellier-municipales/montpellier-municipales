import { style } from "@vanilla-extract/css";
import { stack } from "../stack/stack.css";
import { vars } from "~/theme.css";

export const title = style([
  stack,
  {
    lineHeight: "20px",
    fontSize: "24px",
    margin: 0,
    color: vars.color.primaryHover,
  },
]);

export const subTitle = style({
  fontSize: "16px",
});
