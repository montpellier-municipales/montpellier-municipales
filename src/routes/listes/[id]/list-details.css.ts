import { style } from "@vanilla-extract/css";

export const container = style({
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "2rem",
  marginBottom: "3rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "2rem",
});

export const logo = style({
  width: "120px",
  height: "120px",
  objectFit: "contain",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const title = style({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#333",
  margin: "0 0 0.5rem 0",
});

export const subtitle = style({
  fontSize: "1.25rem",
  color: "#666",
  margin: 0,
});

export const programSection = style({
  marginTop: "2rem",
});

export const themeCard = style({
  backgroundColor: "white",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
});

export const themeTitle = style({
  fontSize: "1.5rem",
  color: "#2c3e50",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});
