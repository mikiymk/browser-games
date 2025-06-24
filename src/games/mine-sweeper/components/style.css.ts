import { style } from "@vanilla-extract/css";

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
import { notoSans } from "../../../styles/fonts.css.ts";

const symbol = style({
  stroke: text,
  strokeWidth: 2,
});

export const closed = style([symbol, { fill: colorGray }]);
export const opened = style([symbol, { fill: "none" }]);

export const number = style([
  notoSans,
  {
    fontSize: 60,
    stroke: "none",
    textAnchor: "middle",
  },
]);

export const number1 = style([number, { fill: colorBlue }]);
export const number2 = style([number, { fill: colorGreen }]);
export const number3 = style([number, { fill: colorRed }]);
export const number4 = style([number, { fill: colorPurple }]);
export const number5 = style([number, { fill: colorBrown }]);
export const number6 = style([number, { fill: colorLightBlue }]);
export const number7 = style([number, { fill: colorBlack }]);
export const number8 = style([number, { fill: colorGray }]);
