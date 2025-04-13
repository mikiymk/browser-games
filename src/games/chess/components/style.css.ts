import { style, styleVariants } from "@vanilla-extract/css";
import { squareFrom, squareTarget, stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

const squareBase = style({
  fill: "none",
  cursor: "pointer",
});

export const square = styleVariants({
  normal: [squareBase],
  target: [squareBase, { fill: squareTarget }],
  from: [squareBase, { fill: squareFrom }],
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
