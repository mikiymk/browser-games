import { style } from "@vanilla-extract/css";

import { shogiBoard, text } from "../../../styles/colors.css.ts";

export const board = style({
  fill: shogiBoard,
});

export const hand = style({
  border: `1px solid ${text}`,
  paddingLeft: "0.25rem",
  paddingRight: "0.25rem",
  textAlign: "center",
});

export const handHeader = style([hand, { backgroundColor: shogiBoard }]);

export const button = style({
  margin: "0 0.25rem",
  textDecorationColor: text,
  textDecorationLine: "underline",
  textDecorationStyle: "double",
});
