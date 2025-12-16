import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("body", {
  margin: 0,
  padding: 0,
  fontFamily: vars.font.body,
  backgroundColor: vars.color.background,
  color: vars.color.text,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

// New global style for RTL
globalStyle('body[dir="rtl"]', {
  textAlign: "right",
});

// Adjust main content for RTL if needed, common practice for flex containers
globalStyle('body[dir="rtl"] main', {
  // If the main content has elements that should align to the right in RTL,
  // this is a good place to add specific rules or let inherited 'text-align: right' handle it.
  // For 'flexDirection: column', this primarily means text alignment.
});

globalStyle("main", {
  flex: 1,
});

globalStyle("a", {
  color: vars.color.primary,
  textDecoration: "none",
});

globalStyle("a:hover", {
  textDecoration: "underline",
});

globalStyle("h1, h2, h3", {
  lineHeight: "1em",
  fontFamily: vars.font.heading,
  color: vars.color.text,
});

globalStyle("hr", {
  borderColor: vars.color.border,
  borderStyle: "solid",
  borderBottom: 0,
  margin: "24px 0",
  backgroundColor: "transparent",
});
