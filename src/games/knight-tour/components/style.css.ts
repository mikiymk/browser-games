import { style } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

export const piece = style({
  fill: variables.color.light,
  stroke: variables.color.black,
});

export const number = style({
  fill: variables.color.black,
});

export const figure = style({
  fill: "none",
  stroke: variables.color.black,
  strokeWidth: 4,
});

export const history = style({
  marginRight: 0,
  marginLeft: "0.5rem",
  textAlign: "start",
});

export const historyItem = style({
  display: "inline",
});

export const historyButton = style({
  width: "4rem",
  textAlign: "center",
  border: `1px solid ${variables.color.black}`,
});
