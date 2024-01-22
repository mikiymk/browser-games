import { style } from "@vanilla-extract/css";

export const cellStyle = style({
  fill: "#0000",
  stroke: "black",

  cursor: "pointer",
});

export const oStyle = style({
  fill: "none",
  stroke: "red",

  strokeWidth: 3,
});

export const xStyle = style({
  fill: "none",
  stroke: "blue",

  strokeWidth: 3,
});

export const historyStyle = style({
  width: "100%",

  display: "flex",

  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
});

export const historyMoveStyle = style({
  display: "inline",

  height: "1lh",
  flex: "0 0 3rem",

  background: "lightgray",
  textAlign: "center",
  verticalAlign: "bottom",
});
