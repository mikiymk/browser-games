import { style } from "@vanilla-extract/css";

export const gridStyle = style({
  margin: "auto",
  padding: "1vmin",
  width: "min-content",
  height: "min-content",

  display: "grid",

  gap: 0,
});

export const fieldStyle = style({
  height: "5vmin",
  width: "5vmin",

  border: "2px solid black",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const closeFieldStyle = style({
  fill: "gray",
});

export const openFieldStyle = style({
  fill: "white",
});

const graphStyle = style({
  fill: "none",
  stroke: "black",
  strokeWidth: 3,
});

export const number1Style = style([graphStyle, { stroke: "blue" }]);
export const number2Style = style([graphStyle, { stroke: "green" }]);
export const number3Style = style([graphStyle, { stroke: "red" }]);
export const number4Style = style([graphStyle, { stroke: "purple" }]);
export const number5Style = style([graphStyle, { stroke: "maroon" }]);
export const number6Style = style([graphStyle, { stroke: "darkturquoise" }]);
export const number7Style = style([graphStyle, { stroke: "black" }]);
export const number8Style = style([graphStyle, { stroke: "darkgray" }]);
export const mineStyle = style([graphStyle, { fill: "black" }]);
export const flagStyle = style([graphStyle, { fill: "red" }]);

export const frontRectStyle = style({
  fill: "#0000",
  stroke: "black",
  strokeWidth: 0.05,
});
