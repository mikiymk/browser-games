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
  marginLeft: "0.5rem",
  marginRight: 0,
  textAlign: "start",
});

export const historyItem = style({
  display: "inline",
});

export const historyButton = style({
  border: `1px solid ${text}`,
  textAlign: "center",
  width: "4rem",
});
