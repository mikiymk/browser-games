import { style } from "@vanilla-extract/css";
import { colorBlack, colorRed, shogiBoard, shogiPiece, text } from "../../../styles/colors.css.ts";

export const pieceStyle = style({
  fill: shogiPiece,
  stroke: text,
});

export const pieceText = style({
  fontSize: 20,
  textAnchor: "middle",
});

export const blackText = style({
  fill: colorBlack,
});

export const redText = style({
  fill: colorRed,
});

export const reversed = style({
  transform: "translate(100%, 100%) rotate(180deg)",
});

export const board = style({
  fill: shogiBoard,
});

export const hand = style({
  paddingLeft: "0.25rem",
  paddingRight: "0.25rem",
  textAlign: "center",
  border: `1px solid ${text}`,
});

export const handHeader = style([hand, { backgroundColor: shogiBoard }]);
