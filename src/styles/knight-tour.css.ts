import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  fontFamily: "serif",

  display: "grid",

  gridTemplateColumns: "1fr",
  gridTemplateAreas: "'tt' 'bd' 'rl' 'st' 'ht'",

  "@media": {
    "(1/1 < aspect-ratio)": {
      gridTemplateColumns: "1fr 40vmax",
      gridTemplateAreas: "'tt tt' 'bd ht' 'rl rl' 'st st'",
    },
  },
});

export const titleStyle = style({
  font: "bold 3rem serif",
  gridArea: "tt",
});

export const ruleStyle = style({
  gridArea: "rl",
});

export const h2Style = style({
  font: "bold 1rem serif",
});

export const settingStyle = style({
  gridArea: "st",
});

export const settingCheckStyle = style({
  display: "inline",

  height: "1rem",
});

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
