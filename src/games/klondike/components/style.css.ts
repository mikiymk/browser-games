import { style } from "@vanilla-extract/css";

import { cardFieldBg, text } from "../../../styles/colors.css.ts";

export const field = style({
  fill: cardFieldBg,
});

export const selected = style({
  fill: "none",
  stroke: text,
});
