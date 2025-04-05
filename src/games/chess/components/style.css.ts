import { style, styleVariants } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

const squareBase = style({
  fill: "none",
  cursor: "pointer",
});

export const square = styleVariants({
  normal: [squareBase],
  target: [squareBase, { fill: "#f97316" }],
  from: [squareBase, { fill: "#64748b" }],
});

export const define = style({
  display: "none",
});

const defineUseBase = style({
  stroke: variables.color.black,
});

export const defineUse = styleVariants({
  black: [defineUseBase, { fill: variables.color.dark }],
  white: [defineUseBase, { fill: variables.color.light }],
});
