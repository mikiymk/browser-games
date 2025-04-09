import { style, styleVariants } from "@vanilla-extract/css";
import { colorBlack, cardFieldBg, colorRed, text, cardBg } from "../../../styles/colors.css.ts";

export const field = style({
  fill: cardFieldBg,
});

const blackCard = style({
  fill: colorBlack,
});

const redCard = style({
  fill: colorRed,
});

export const suitColor = styleVariants({
  club: [blackCard],
  diamond: [redCard],
  heart: [redCard],
  spade: [blackCard],
});

const textBase = style({
  fontSize: 25,
});

export const textColor = styleVariants({
  club: [blackCard, textBase],
  diamond: [redCard, textBase],
  heart: [redCard, textBase],
  spade: [blackCard, textBase],
});

const rankBase = style({
  fontSize: 16,
});

export const rankColor = styleVariants({
  club: [blackCard, rankBase],
  diamond: [redCard, rankBase],
  heart: [redCard, rankBase],
  spade: [blackCard, rankBase],
});

export const reversed = style({
  transform: "translate(100%, 100%) rotate(180deg)",
});

export const card = style({
  fill: cardBg,
  stroke: text,
});

export const selected = style({
  fill: "none",
  stroke: text,
});
