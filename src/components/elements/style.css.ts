import { style } from "@vanilla-extract/css";
import { hoveredText, text } from "../../styles/colors.css.ts";
import { symbols } from "../../styles/fonts.css.ts";

export const anchor = style({
  textDecorationLine: "underline",

  ":hover": {
    color: hoveredText,
  },
});

export const button = style({
  textDecorationLine: "underline",
  textDecorationColor: text,
  textDecorationStyle: "double",
  margin: "0 0.25rem",
});

export const icon = style({
  fontFamily: symbols,
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: "24px",
  display: "inline-block",
  lineHeight: "1",
  textTransform: "none",
  letterSpacing: "normal",
  wordWrap: "normal",
  whiteSpace: "nowrap",
  direction: "ltr",
});

export const list = style({
  listStyle: "disc inside",
});

export const listItem = style({
  padding: "0.3rem 0",
});

export const svg = style({
  height: "2rem",
  width: "2rem",
  display: "inline",
  aspectRatio: "1 / 1",
});

export const svgUse = style({
  fill: "none",
  stroke: text,
  strokeWidth: "2",
});
