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

export const boardStyle = style({
  gridArea: "bd",
  placeSelf: "center",

  height: "min(60vmax, 80vmin)",
  width: "min(60vmax, 80vmin)",

  backgroundColor: "#2bd92b",

  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",

  rowGap: 0,
  columnGap: 0,
});

export const cellStyle = style({
  height: "min(7.5vmax, 10vmin)",
  width: "min(7.5vmax, 10vmin)",

  border: "2px solid black",
});

export const cellButtonStyle = style({
  height: "100%",
  width: "100%",
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

export const radioStyle = style({
  display: "inline-block",
  width: "5rem",
  boxSizing: "border-box",
});

export const checkedRadioStyle = style({
  border: "solid black 2px",
});
