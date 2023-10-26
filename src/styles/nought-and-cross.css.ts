import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  margin: 0,
  padding: 0,
});

export const boardStyle = style({
  margin: "5vmin",

  height: "80vmin",
  width: "80vmin",

  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  rowGap: 0,
  columnGap: 0,
});

export const cellStyle = style({
  height: "calc(80vmin / 3)",
  width: "calc(80vmin / 3)",
  background: "white",
  border: "1px solid black",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const charStyle = style({
  height: "100%",
  width: "100%",

  fill: "none",
  stroke: "black",
  strokeWidth: 5,
  strokeLinecap: "butt",
});

export const charOStyle = style([
  charStyle,
  {
    stroke: "red",
  },
]);

export const charXStyle = style([
  charStyle,
  {
    stroke: "blue",
  },
]);
