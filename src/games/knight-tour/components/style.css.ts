import { style } from "@vanilla-extract/css";

import { text } from "../../../styles/colors.css.ts";
import { notoSans } from "../../../styles/fonts.css.ts";

export const number = style([
  notoSans,
  {
    fill: text,
  },
]);

export const history = style({
  marginLeft: "0.5rem",
  marginRight: 0,
  textAlign: "start",
});

export const historyItem = style({
  display: "inline",
});

export const historyButton = style({
  border: `1px solid ${text}`,
  textAlign: "center",
  width: "4rem",
});
