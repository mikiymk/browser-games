import { bodyStyle } from "@/styles/common.css";
import { style } from "@vanilla-extract/css";

export const knightTourBodyStyle = style([
  bodyStyle,
  {
    "@media": {
      "(1/1 < aspect-ratio)": {
        flexDirection: "row",
      },
    },
  },
]);

export const boardStyle = style({
  flex: "0 0 90vmin",
});

export const pieceStyle = style({
  fill: "#ccc",
  stroke: "#222",
});

export const blackNumberStyle = style({
  fill: "none",
  stroke: "#333",
});

export const whiteNumberStyle = style({
  fill: "none",
  stroke: "#ccc",
});

export const historyStyle = style({
  alignSelf: "stretch",

  border: "#222 solid 3px",

  overflowY: "scroll",

  height: "90vh",
  width: "auto",

  "@media": {
    "(1/1 < aspect-ratio)": {
      height: "auto",
      width: "90vw",
    },
  },
});

export const historyItemStyle = style({
  display: "inline",

  margin: "0.5rem",
});

export const historyButtonStyle = style({
  width: "3rem",

  background: "#ff8",
  border: "#222 solid 1px",

  textAlign: "center",
});
