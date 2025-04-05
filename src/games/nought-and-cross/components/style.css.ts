import { style } from "@vanilla-extract/css";

export const noughtStyle = style({
  fill: "none",
  stroke: "#2563eb",
  strokeWidth: 2,
});

export const crossStyle = style({
  fill: "none",
  stroke: "#dc2626",
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
