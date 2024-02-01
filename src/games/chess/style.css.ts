import { style } from "@vanilla-extract/css";

export const squareStyle = style({
  stroke: "none",
  strokeWidth: 4,

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
