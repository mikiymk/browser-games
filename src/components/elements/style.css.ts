import { style } from "@vanilla-extract/css";

import { hoveredText, text } from "../../styles/colors.css.ts";
import { symbols } from "../../styles/fonts.css.ts";

export const anchor = style({
  ":hover": {
    color: hoveredText,
  },

  textDecorationLine: "underline",
});

export const button = style({
  margin: "0 0.25rem",
  textDecorationColor: text,
  textDecorationLine: "underline",
  textDecorationStyle: "double",
});

export const icon = style({
  direction: "ltr",
  display: "inline-block",
  fontFamily: symbols,
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: "normal",
  letterSpacing: "normal",
  lineHeight: "1",
  textTransform: "none",
  whiteSpace: "nowrap",
  wordWrap: "normal",
});

export const list = style({
  listStyle: "disc inside",
});

export const listItem = style({
  padding: "0.3rem 0",
});

export const svg = style({
  aspectRatio: "1 / 1",
  display: "inline",
  height: "2rem",
  width: "2rem",
});

export const svgUse = style({
  fill: "none",
  stroke: text,
  strokeWidth: "2",
});
