import { style, styleVariants } from "@vanilla-extract/css";

import { colorSquareFrom, colorSquareTarget, stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

const squareBase = style({
  cursor: "pointer",
  fill: "none",
});

export const square = styleVariants({
  from: [squareBase, { fill: colorSquareFrom }],
  normal: [squareBase],
  target: [squareBase, { fill: colorSquareTarget }],
});
export const squareFrom = style({ fill: colorSquareFrom });
export const squareTarget = style({ fill: colorSquareTarget });

export const define = style({
  display: "none",
});

const defineUseBase = style({
  stroke: text,
});

export const defineUse = styleVariants({
  black: [defineUseBase, { fill: stoneDark }],
  white: [defineUseBase, { fill: stoneLight }],
});
