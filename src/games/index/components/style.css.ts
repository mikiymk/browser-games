import { style } from "@vanilla-extract/css";

import { hoveredText } from "../../../styles/colors.css.ts";

export const anchor = style({
  ":hover": {
    color: hoveredText,
  },

  textDecorationLine: "underline",
});

export const list = style({
  listStyle: "disc inside",
});

export const listItem = style({
  padding: "0.3rem 0",
});
