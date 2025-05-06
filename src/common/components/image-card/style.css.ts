import { style } from "@vanilla-extract/css";

import { colorBlack, colorRed } from "../../../styles/colors.css.ts";
import { latin } from "../../../styles/fonts.css.ts";

export const black = style({
  fill: colorBlack,
  stroke: "none",
});

export const red = style({
  fill: colorRed,
  stroke: "none",
});

export const text = style({
  font: `10px ${latin}`,
});

export const textMiddle = style({
  font: `12px ${latin}`,
  textAnchor: "middle",
});
