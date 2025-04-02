import { style } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

export const white = style({
  fill: variables.color.light,
});

export const black = style({
  fill: variables.color.dark,
});

export const stone = style({
  stroke: variables.color.black,
  strokeWidth: 0.5,
});

export const stoneWhite = style([stone, white]);
export const stoneBlack = style([stone, black]);

export const next = style({
  border: `2px solid ${variables.color.black}`,
  borderRadius: "0.25rem",
});

export const iconOuter = style({
  height: "2rem",
  width: "2rem",
  display: "inline",
  aspectRatio: "1 / 1",
});

export const icon = style({
  stroke: variables.color.black,
});

export const iconWhite = style([icon, white]);
export const iconBlack = style([icon, black]);
