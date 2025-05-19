import { styleVariants } from "@vanilla-extract/css";

import { stoneDark, stoneLight, text } from "../../../styles/colors.css.ts";

export const piece = styleVariants({
  black: {
    fill: stoneDark,
    stroke: text,
  },
  white: {
    fill: stoneLight,
    stroke: text,
  },
});
