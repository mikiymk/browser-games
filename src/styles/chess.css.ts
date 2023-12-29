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
  height: "10vmin",
  width: "10vmin",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "transparent",
  borderWidth: 0,
  padding: 0,
});

export const movableSquareStyle = style([
  squareStyle,
  {
    borderStyle: "double",
    borderWidth: "0.3rem",
    borderColor: "darkorange",
  },
]);

export const pieceStyle = style({
  height: "100%",
  width: " 100%",

  strokeWidth: "1.5px",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 4,
  strokeDasharray: "none",
  strokeOpacity: 1,
});

export const pieceBlackStyle = style({
  fill: "#ddd",
  stroke: "black",
});

export const pieceWhiteStyle = style({
  fill: "#333",
  stroke: "black",
});

export const selectedStyle = style({
  borderColor: "black",
});
