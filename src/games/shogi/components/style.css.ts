import { style } from "@vanilla-extract/css";
import { variables } from "../../../styles/style.css.ts";

export const pieceStyle = style({
  fill: "#fde047",
  stroke: variables.color.black,
});

export const text = style({
  fontSize: 20,
  textAnchor: "middle",
});

export const black = style({
  fill: variables.color.black,
});

export const red = style({
  fill: variables.color.red,
});

export const reversed = style({
  transform: "translate(100%, 100%) rotate(180deg)",
});

export const board = style({
  fill: "#fbbf24",
});

export const hand = style({
  paddingLeft: "0.25rem",
  paddingRight: "0.25rem",
  textAlign: "center",
  border: `1px solid ${variables.color.black}`,
});

export const handHeader = style([hand, { backgroundColor: "#fbbf24" }]);
