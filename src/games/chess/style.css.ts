import { style } from "@vanilla-extract/css";

export const boardStyle = style({});

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
  fill: "#555",
  stroke: "#222",
});

export const pieceWhiteStyle = style({
  fill: "#eee",
  stroke: "#222",
});
