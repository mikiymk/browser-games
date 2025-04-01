import { style, styleVariants } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

export const field = style({
  fill: "#15803d",
});

const black = style({
  fill: variables.color.black,
});

const red = style({
  fill: variables.color.red,
});

export const suitColor = styleVariants({
  club: [black],
  diamond: [red],
  heart: [red],
  spade: [black],
});

const text = style({
  fontSize: 25,
});

export const textColor = styleVariants({
  club: [black, text],
  diamond: [red, text],
  heart: [red, text],
  spade: [black, text],
});

const rank = style({
  fontSize: 16,
});

export const rankColor = styleVariants({
  club: [black, rank],
  diamond: [red, rank],
  heart: [red, rank],
  spade: [black, rank],
});

export const reversed = style({
  transform: "translate(100%, 100%) rotate(180deg)",
});

export const card = style({
  fill: "#e2e8f0",
  stroke: variables.color.black,
});

export const selected = style({
  fill: "none",
  stroke: variables.color.black,
});
