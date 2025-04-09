import { style } from "@vanilla-extract/css";
import { emoji } from "../../../styles/fonts.css.ts";
import {
  colorBlack,
  colorBlue,
  colorBrown,
  colorGray,
  colorGreen,
  colorLightBlue,
  colorPurple,
  colorRed,
  text,
} from "../../../styles/colors.css.ts";

const symbol = style({
  stroke: text,
  strokeWidth: 2,
});

export const closed = style([symbol, { fill: colorGray }]);
export const opened = style([symbol, { fill: "none" }]);
export const mineStyle = style([symbol, { fill: colorBlack }]);
export const flagStyle = style([symbol, { fill: colorRed }]);

export const number = style({
  fontSize: 60,
  textAnchor: "middle",
  stroke: "none",
});

export const number1 = style({ fill: colorBlue });
export const number2 = style({ fill: colorGreen });
export const number3 = style({ fill: colorRed });
export const number4 = style({ fill: colorPurple });
export const number5 = style({ fill: colorBrown });
export const number6 = style({ fill: colorLightBlue });
export const number7 = style({ fill: colorBlack });
export const number8 = style({ fill: colorGray });

export const fontEmoji = style({
  fontFamily: emoji,
});
