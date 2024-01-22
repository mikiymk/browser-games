import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5vmin",

  height: "100dvh",
  width: "100dvw",

  padding: "5vmin",
});

export const h1Style = style({
  fontSize: "3rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

export const h2Style = style({
  fontSize: "1.3rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
});

export const buttonStyle = style({
  padding: "0.2rem 0.5rem",
  background: "gray",
});

export const listStyle = style({
  listStyleType: "disc",
  listStylePosition: "inside",
});

export const listItemStyle = style({
  marginBottom: "0.3rem",
});

export const linkStyle = style({
  textDecorationLine: "underline",

  ":hover": {
    color: "#777",
  },
});

export const defaultIconStyle = style({
  height: "1.4rem",
  width: "1.4rem",
  verticalAlign: "text-bottom",
});

export const defaultStrokeStyle = style({
  fill: "none",
  stroke: "#222",
  strokeWidth: 3,
});
