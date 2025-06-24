import { style, styleVariants } from "@vanilla-extract/css";

import { cardBg, colorBlack, colorRed, stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";
import { notoSans, notoSansJp } from "../../../styles/fonts.css.ts";

export const suitBlack = style({
  fill: colorBlack,
  stroke: "none",
});

export const suitRed = style({
  fill: colorRed,
  stroke: "none",
});

export const cardText = style([
  notoSans,
  {
    fontSize: "10px",
  },
]);

export const cardTextMiddle = style([
  notoSans,
  {
    fontSize: "12px",
    textAnchor: "middle",
  },
]);

export const cardBackGround = style({
  fill: cardBg,
  stroke: text,
});

export const cardEmpty = style({
  fill: "none",
  stroke: text,
});

export const chessPiece = styleVariants({
  black: {
    fill: stoneDark,
    stroke: text,
  },
  white: {
    fill: stoneLight,
    stroke: text,
  },
});

export const shogiPieceShape = style({
  fill: "none",
  stroke: text,
});

const redText = style({ fill: colorRed });

export const shogiPieceTextUp = style([notoSansJp, { fontSize: 20, textAnchor: "middle" }]);
export const shogiPieceTextDown = style([shogiPieceTextUp, { transform: "translate(100%, 100%) rotate(180deg)" }]);
export const shogiPieceTextPromotedUp = style([shogiPieceTextUp, redText]);
export const shogiPieceTextPromotedDown = style([shogiPieceTextDown, redText]);

const stroke = style({
  fill: "none",
  strokeWidth: 2,
});

export const symbolMark = style([stroke, { stroke: text }]);

export const symbolFlagFill = style({ fill: colorRed });
export const symbolMineFill = style({ fill: colorBlack });

export const stone = styleVariants({
  black: {
    fill: stoneDark,
    stroke: text,
  },
  white: {
    fill: stoneLight,
    stroke: text,
  },
});
