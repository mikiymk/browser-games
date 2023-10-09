import { style } from "@vanilla-extract/css";

export const boardStyle = style({
  height: "min(60vmax, 80vmin)",
  width: "min(60vmax, 80vmin)",

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
