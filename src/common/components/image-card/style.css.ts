import { style } from "@vanilla-extract/css";

import { cardBg, colorBlack, colorRed, text } from "../../../styles/colors.css.ts";
import { latin } from "../../../styles/fonts.css.ts";

export const black = style({
  fill: colorBlack,
  stroke: "none",
});

export const red = style({
  fill: colorRed,
  stroke: "none",
});

export const cardText = style({
  font: `10px ${latin}`,
});

export const cardTextMiddle = style({
  font: `12px ${latin}`,
  textAnchor: "middle",
});

export const cardBackGround = style({
  fill: cardBg,
  stroke: text,
});
