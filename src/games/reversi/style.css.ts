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

export const settingItemStyle = style({
  padding: "0 1rem",
});

export const disableStyle = style({
  color: "gray",
});

export const settingCheckBoxStyle = style({
  height: "1rem",
});

export const infoStyle = style({
  border: "#222 solid medium",
});

export const infoResultStyle = style({
  color: "red",
  fontSize: "min(4.5vmax, 6vmin)",
  textAlign: "center",

  gridColumn: "1 / 6",
});

export const infoStoneStyle = style({});

export const currentPlayerStyle = style({
  backgroundColor: "#f81",
});

export const infoStoneCountStyle = style({});

export const infoStoneSymbolStyle = style({
  height: "1.4rem",
});

export const infoTimeStyle = style({
  width: "100%",
  fontSize: "min(3vmax, 4vmin)",

  gridColumn: "1 / 6",

  display: "grid",
  gridTemplateColumns: "subgrid",
});

export const infoTimeBlackStyle = style({
  gridColumn: "1 / 3",
});

export const infoTimeWhiteStyle = style({
  gridColumn: "4 / 6",
});

export const infoPlayButtonStyle = style({});

export const settingStartStyle = style({
  width: "50%",
  textAlign: "center",
  border: "solid black 1px",
  background: "gray",
});
