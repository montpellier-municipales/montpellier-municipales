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
globalStyle("main p", {
  textWrap: "pretty",
});

globalStyle("a", {
  color: vars.color.primary,
  textDecoration: "none",
});

globalStyle("a:hover", {
  textDecoration: "underline",
});

globalStyle("h1, h2, h3", {
  lineHeight: "1.3em",
  fontFamily: vars.font.heading,
  textWrap: "balance",
  color: vars.color.text,
  position: "relative",
});

// Highlight effect applied to a span inside h2 for perfect multi-line support
globalStyle("h2 span", {
  backgroundImage: `linear-gradient(to top, ${vars.color.secondary} 0.3em, transparent 0.2em)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
  padding: "0 0.1em",
});

globalStyle("blockquote", {
  fontFamily: "ui-serif, Georgia, Cambria, serif",
  fontSize: "1.5rem",
  lineHeight: "1.4",
  fontStyle: "italic",
  margin: "3rem 0",
  padding: "0.5rem 1.5rem",
  borderLeft: `5px solid ${vars.color.primary}`,
  color: vars.color.text,
  textWrap: "balance",
});

globalStyle('body[dir="rtl"] blockquote', {
  borderLeft: "none",
  borderRight: `5px solid ${vars.color.primary}`,
  textWrap: "balance",
});

globalStyle("hr", {
  borderColor: vars.color.border,
  borderStyle: "solid",
  borderBottom: 0,
  margin: "24px 0",
  backgroundColor: "transparent",
});
