import { style } from "@vanilla-extract/css";

import { colorRed, text } from "../../../styles/colors.css.ts";

export const pieceShape = style({
  fill: "none",
  stroke: text,
});

export const pieceTextUp = style({
  fontSize: 20,
  textAnchor: "middle",
});

export const pieceTextDown = style([
  pieceTextUp,
  {
    transform: "translate(100%, 100%) rotate(180deg)",
  },
]);

export const redText = style({
  fill: colorRed,
});

export const pieceTextPromotedUp = style([pieceTextUp, redText]);
export const pieceTextPromotedDown = style([pieceTextDown, redText]);
