import { style } from "@vanilla-extract/css";

import { text } from "./colors.css.ts";
import { japanese, latin } from "./fonts.css";

export const rootStyle = style({
  color: text,
  fontFamily: `${latin}, ${japanese}, sans-serif`,
});
