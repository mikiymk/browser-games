import { style } from "@vanilla-extract/css";

export const boardStyle = style({
  border: "#222 solid medium",
});

export const blackStoneStyle = style({
  fill: "#1a1a1a",
  stroke: "#222",
});

export const whiteStoneStyle = style({
  fill: "#cacaca",
  stroke: "#222",
});

export const rectStyle = style({
  fill: "#0000",
});

export const infoStyle = style({
  border: "#222 solid medium",
});

export const currentPlayerStyle = style({
  backgroundColor: "#f81",
});

export const infoStoneSymbolStyle = style({
  height: "1.4rem",
});
