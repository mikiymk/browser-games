import { style } from "@vanilla-extract/css";
import { japanese, latin } from "./fonts.css";
import { text } from "./colors.css.ts";

export const rootStyle = style({
  color: text,
  fontFamily: `${latin}, ${japanese}, sans-serif`,
});
