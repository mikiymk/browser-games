import { style, globalStyle } from "@vanilla-extract/css";

globalStyle(":root", {
  font: "100% 'Noto Sans', sans-serif",
});

export const bodyStyle = style({
  margin: 0,
  padding: 0,

  height: "100dvh",
  width: "100dvw",

  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

export const boardStyle = style({
  height: "80vmin",
  width: "80vmin",

  margin: "0 10vmin",
});

export const cellStyle = style({
  fill: "#0000",
  stroke: "black",

  cursor: "pointer",
});

export const oStyle = style({
  color: "red",
});

export const xStyle = style({
  color: "blue",
});

export const controllerStyle = style({
  width: "80vmin",
});

export const controllerOutputStyle = style({
  font: "",
});

export const controllerPlayerStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
});

export const controllerPlayerNameStyle = style({});
export const controllerPlayerSelectRadioStyle = style({});

export const restartButtonStyle = style({
  background: "lightgray",
  padding: ".2rem",
  border: "solid 1px black",
});

export const historyStyle = style({
  display: "flex",
  width: "80vmin",

  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
});

export const historyTitleStyle = style({});

export const historyMoveStyle = style({
  display: "inline",

  height: ["1.4rem", "1lh"],
  flex: "0 0 3rem",

  background: "lightgray",
  textAlign: "center",
  verticalAlign: "bottom",
});
