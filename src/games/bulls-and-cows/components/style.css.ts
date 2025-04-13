import { style } from "@vanilla-extract/css";
import { colorWhite, pageBodyShadow, text } from "../../../styles/colors.css.ts";

export const digitsContainer = style({
  display: "inline flex",

  borderBottom: `2px solid ${text}`,

  margin: "0.5rem",

  textAlign: "center",
});

export const digits = style({
  height: "2rem",
  width: "2rem",

  fontSize: "1.5rem",
});

export const guessContainer = style({});

export const guess = style({
  margin: "0 0.5rem",
});

export const input = style({
  height: "2rem",
  width: "20rem",

  fontSize: "1.5rem",
  textAlign: "center",

  background: colorWhite,
  border: `2px solid ${text}`,
  borderRadius: "0.25rem",
  outline: "none",

  margin: "0.5rem",
});

export const submitButton = style({
  padding: "0.1rem",
  border: `4px outset ${pageBodyShadow}`,
  borderRadius: "0.25rem",

  ":active": {
    borderStyle: "inset",
  },
});
