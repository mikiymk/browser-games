import { style } from "@vanilla-extract/css";

export const boardStyle = style({
  margin: "5vmin",
  height: "80vmin",
  width: "80vmin",
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  rowGap: 0,
  columnGap: 0,
});

export const squareStyle = style({
  fill: "#0000",
  stroke: "none",
  strokeWidth: "0.03",

  cursor: "pointer",
});

export const movableSquareStyle = style([
  squareStyle,
  {
    stroke: "darkorange",
  },
]);

export const selectedStyle = style([
  squareStyle,
  {
    stroke: "black",
  },
]);

export const pieceBlackStyle = style({
  fill: "#333",
  stroke: "#222",
});

export const pieceWhiteStyle = style({
  fill: "#ccc",
  stroke: "#222",
});

