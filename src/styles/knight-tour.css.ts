import { style } from "@vanilla-extract/css";

export const historyStyle = style({
  gridArea: "ht",

  border: "inset black 3px",
  height: "10.5rem",
  overflowY: "scroll",

  "@media": {
    "(1/1 < aspect-ratio)": {
      height: "min(60vmax, 80vmin)",
    },
  },
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

export const rectStyle = style({
  fill: "#0000",
});
