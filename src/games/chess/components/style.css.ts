import { style } from "@vanilla-extract/css";

import { colorSquareFrom, colorSquareTarget } from "../../../styles/colors.css.ts";

export const squareFrom = style({ fill: colorSquareFrom });
export const squareTarget = style({ fill: colorSquareTarget });
