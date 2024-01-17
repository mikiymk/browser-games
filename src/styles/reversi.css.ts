import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  fontFamily: "serif",

  display: "grid",
  gridTemplateAreas: "'tt'" + "'if'" + "'bd'" + "'st'" + "'rl'",
});

export const titleStyle = style({
  font: "bold 3rem serif",
  gridArea: "tt",
});

export const ruleStyle = style({
  gridArea: "rl",
});

export const boardStyle = style({
  gridArea: "bd",
  placeSelf: "center",

  height: "min(60vmax, 80vmin)",
  width: "min(60vmax, 80vmin)",

  border: "solid",

  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",

  rowGap: 0,
  columnGap: 0,
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
  gridArea: "if",
  placeSelf: "center",

  border: "solid black 3px",

  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
});

export const infoResultStyle = style({
  color: "red",
  fontSize: "min(4.5vmax, 6vmin)",
  textAlign: "center",

  gridColumn: "1 / 6",
});

export const infoStoneStyle = style({
  textAlign: "center",
  fontSize: "min(6vmax, 8vmin)",

  gridColumn: "1 / 6",

  display: "grid",
  gridTemplateColumns: "subgrid",
});

export const infoStoneCurrentPlayerStyle = style({
  backgroundColor: "#ff8811",
});

export const infoStoneCountStyle = style({
  display: "inline-block",
  width: "min(7.5vmax, 10vmin)",
  lineHeight: "min(7.5vmax, 10vmin)",
  textAlign: "right",
});

export const infoStoneSymbolStyle = style({
  height: "min(7.5vmax, 10vmin)",
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

export const infoPlayButtonStyle = style({
  gridColumn: "1 / 6",

  font: "bold min(3vmax, 4vmin) sans-serif",
});

export const settingStartStyle = style({
  width: "50%",
  textAlign: "center",
  border: "solid black 1px",
  background: "gray",
});
