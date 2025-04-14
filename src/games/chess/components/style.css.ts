import { style, styleVariants } from "@vanilla-extract/css";

import { squareFrom, squareTarget, stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

const squareBase = style({
  cursor: "pointer",
  fill: "none",
});

export const square = styleVariants({
  from: [squareBase, { fill: squareFrom }],
  normal: [squareBase],
  target: [squareBase, { fill: squareTarget }],
});

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
