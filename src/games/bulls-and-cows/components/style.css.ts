import { style } from "@vanilla-extract/css";

export const inputContainer = style({
  display: "flex",
  gap: "0.5rem",
});

export const input = style({
  height: "2rem",
  width: "2rem",

  fontSize: "1.5rem",
  textAlign: "center",

  borderBottom: "2px solid black",
  outline: "none",
});
