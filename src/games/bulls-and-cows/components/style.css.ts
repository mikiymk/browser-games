import { style } from "@vanilla-extract/css";
import { colorWhite, text } from "../../../styles/colors.css.ts";

export const inputContainer = style({
  display: "flex",
  gap: "0.5rem",
});

export const input = style({
  height: "2rem",
  width: "2rem",

  fontSize: "1.5rem",
  textAlign: "center",

  background: colorWhite,
  border: `2px solid ${text}`,
  borderRadius: "0.25rem",
  outline: "none",
});
