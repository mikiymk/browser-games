import { style } from "@vanilla-extract/css";
import { colorBlue, colorRed } from "../../../styles/colors.css.ts";

export const noughtStyle = style({
  fill: "none",
  stroke: colorBlue,
  strokeWidth: 2,
});

export const crossStyle = style({
  fill: "none",
  stroke: colorRed,
  strokeWidth: 2,
});

export const history = style({
  listStylePosition: "inside",
  listStyleType: "decimal",
});

export const historyItem = style({
  width: "8rem",
  margin: "auto",
  textAlign: "left",
});
