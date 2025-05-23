import { style, styleVariants } from "@vanilla-extract/css";

import { colorBlack, colorBlue, colorRed, stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

const stroke = style({
  fill: "none",
  strokeWidth: 2,
});

export const nought = style([stroke, { stroke: colorBlue }]);
export const cross = style([stroke, { stroke: colorRed }]);

export const blackLine = style([stroke, { stroke: text }]);
export const flagFill = style({
  fill: colorRed,
});
export const mineFill = style({
  fill: colorBlack,
});

export const stone = styleVariants({
  black: {
    fill: stoneDark,
    stroke: text,
  },
  white: {
    fill: stoneLight,
    stroke: text,
  },
});
