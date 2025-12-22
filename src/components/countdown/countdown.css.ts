import { style } from "@vanilla-extract/css";
import { vars } from "~/theme.css";

export const container = style({
  textAlign: "center",
  margin: "1rem auto 3rem",
});

export const title = style({
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: vars.color.primary,
  marginBottom: "1.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const timerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
  marginBottom: "2rem",
  maxWidth: "500px", // Limite la largeur pour que les 2 blocs ne soient pas trop étirés
  margin: "0 auto 2rem auto", // Centre la grille
});

export const timeUnit = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.md,
  padding: "1rem",
  borderRadius: "8px",
});

export const number = style({
  fontSize: "2.5rem",
  fontWeight: "800",
  color: vars.color.title,
  lineHeight: "1",
  fontFamily: "monospace", // Pour l'alignement des chiffres
});

export const label = style({
  fontSize: "0.8rem",
  color: vars.color.textMuted,
  marginTop: "0.5rem",
  textTransform: "uppercase",
});

export const message = style({
  fontSize: "1.5rem",
  margin: "1rem auto 2rem auto",
  lineHeight: "1.4",
  textAlign: "center",
  maxWidth: 600,
});

export const link = style({
  display: "inline-block",
  backgroundColor: vars.color.secondary,
  color: vars.color.text, // Le texte sur le jaune est souvent foncé
  padding: "0.75rem 1.5rem",
  borderRadius: "50px",
  fontWeight: "bold",
  textDecoration: "none",
  transition: `transform 0.2s ${vars.defaultTransition}`,
  ":hover": {
    backgroundColor: vars.color.secondaryHover,
    transform: "scale(1.05)",
    textDecoration: "none",
  },
});
