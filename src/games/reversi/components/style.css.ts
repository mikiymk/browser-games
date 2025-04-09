import { style } from "@vanilla-extract/css";
import { stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

export const white = style({
  fill: stoneLight,
});

export const black = style({
  fill: stoneDark,
});

const stone = style({
  stroke: text,
  strokeWidth: 0.5,
});

export const stoneWhite = style([stone, white]);
export const stoneBlack = style([stone, black]);

export const next = style({
  border: `2px solid ${text}`,
  borderRadius: "0.25rem",
});

export const iconOuter = style({
  height: "2rem",
  width: "2rem",
  display: "inline",
  aspectRatio: "1 / 1",
});
