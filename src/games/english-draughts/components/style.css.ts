import { style } from "@vanilla-extract/css";

import { stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

export const define = style({
  display: "none",
});

const stoneBase = style({
  stroke: text,
  strokeWidth: 2,
});

export const stoneWhite = style([stoneBase, { fill: stoneLight }]);
export const stoneBlack = style([stoneBase, { fill: stoneDark }]);
export const stoneMove = style([stoneBase, { fill: "none" }]);
