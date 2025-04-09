import { style } from "@vanilla-extract/css";
import { stoneLight, text } from "../../../styles/colors.css.ts";

export const piece = style({
  fill: stoneLight,
  stroke: text,
});

export const number = style({
  fill: text,
});

export const figure = style({
  fill: "none",
  stroke: text,
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
  border: `1px solid ${text}`,
});
