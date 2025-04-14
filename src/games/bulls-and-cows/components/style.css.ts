import { style } from "@vanilla-extract/css";

import { inputBg, pageBodyShadow, text } from "../../../styles/colors.css.ts";

export const digitsContainer = style({
  borderBottom: `2px solid ${text}`,
  display: "inline flex",
  margin: "0.5rem",
  textAlign: "center",
});

export const digits = style({
  fontSize: "1.5rem",
  height: "2rem",
  width: "2rem",
});

export const guess = style({
  margin: "0 0.5rem",
});

export const input = style({
  background: inputBg,
  border: `2px solid ${text}`,
  borderRadius: "0.25rem",
  fontSize: "1.5rem",
  height: "2rem",
  letterSpacing: "0.5rem",
  margin: "0.5rem",
  outline: "none",
  textAlign: "center",
  width: "15rem",
});

export const submitButton = style({
  ":active": {
    borderStyle: "inset",
  },
  border: `4px outset ${pageBodyShadow}`,
  borderRadius: "0.25rem",

  padding: "0.1rem",
});
