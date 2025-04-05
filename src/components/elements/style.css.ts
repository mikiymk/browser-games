import { style } from "@vanilla-extract/css";
import { symbols } from "../../styles/fonts.css.ts";
import { variables } from "../../styles/style.css.ts";

export const anchor = style({
  textDecorationLine: "underline",

  ":hover": {
    color: "#64748b",
  },
});

export const button = style({
  textDecorationLine: "underline",
  textDecorationColor: variables.color.black,
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
  stroke: variables.color.black,
  strokeWidth: "2",
});
