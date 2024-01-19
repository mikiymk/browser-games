import { style } from "@vanilla-extract/css";

export const boardStyle = style({
  height: "80vmin",
  width: "80vmin",

  margin: "0 10vmin",
});

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

export const controllerStyle = style({
  width: "80vmin",
});

export const controllerOutputStyle = style({
  font: "",
});

export const restartButtonStyle = style({
  background: "lightgray",
  padding: ".2rem",
  border: "solid 1px black",
});

export const historyStyle = style({
  display: "flex",
  width: "80vmin",

  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
});

export const historyMoveStyle = style({
  display: "inline",

  height: ["1.4rem", "1lh"],
  flex: "0 0 3rem",

  background: "lightgray",
  textAlign: "center",
  verticalAlign: "bottom",
});
