import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  margin: 0,
  padding: 0,
});

export const boardStyle = style({
  height: "80vmin",
  width: "80vmin",
});

export const cellStyle = style({
  fill: "#0000",
  stroke: "black",

  cursor: "pointer",
});

export const oStyle = style({
  color: "red",
});

export const xStyle = style({
  color: "blue",
});
