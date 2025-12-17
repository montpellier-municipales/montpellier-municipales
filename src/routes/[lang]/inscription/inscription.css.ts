import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  maxWidth: "800px", // Plus étroit pour la lecture
  margin: "0 auto",
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
});

export const content = style({
  lineHeight: "1.8",
  color: vars.color.text,
  fontSize: "1.1rem",
});

// Styles globaux pour le contenu HTML généré par le Markdown
globalStyle(`${content} h1`, {
  fontSize: "2.5rem",
  fontWeight: "800",
  color: vars.color.title,
  lineHeight: "1.2em",
  marginBottom: "2rem",
  textAlign: "center",
});

globalStyle(`${content} h2`, {
  marginTop: 24,
  marginBottom: 16,
  fontSize: "1.8rem",
  color: vars.color.title,
  display: "inline-block",
});

globalStyle(`${content} h3`, {
  marginTop: "2rem",
  marginBottom: "1rem",
  fontSize: "1.4rem",
  color: vars.color.text,
  fontWeight: "600",
});

globalStyle(`${content} p`, {
  marginBottom: "1.5rem",
});

globalStyle(`${content} ul`, {
  marginBottom: "1.5rem",
  paddingLeft: "1.5rem",
  listStyleType: "none", // On utilise des emojis dans le texte, mais attention si le markdown génère des <ul> standard
});

// Si le markdown génère des listes standards sans emojis manuelles
globalStyle(`${content} li`, {
  marginBottom: "0.5rem",
  position: "relative",
});

globalStyle(`${content} strong`, {
  fontWeight: "700",
  color: vars.color.primary,
});

globalStyle(`${content} hr`, {
  border: "0",
  height: "1px",
  backgroundColor: vars.color.border,
  margin: "3rem 0",
});

// Styles spécifiques pour les emojis/icônes si besoin
globalStyle(`${content} .icon`, {
  marginRight: "0.5rem",
});
