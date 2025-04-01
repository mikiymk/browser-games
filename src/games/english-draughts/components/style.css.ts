import { style } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

export const define = style({
  display: "none",
});

const stoneBase = style({
  stroke: variables.color.black,
  strokeWidth: 2,
});

export const stoneWhite = style([stoneBase, { fill: variables.color.light }]);
export const stoneBlack = style([stoneBase, { fill: variables.color.dark }]);
export const stoneMove = style([stoneBase, { fill: "none" }]);
