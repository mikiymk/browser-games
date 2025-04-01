import { style } from "@vanilla-extract/css";
import { variables } from "../../styles/style.css.ts";

export const number = style({
  textAlign: "right",
  borderBottom: `solid ${variables.color.black} 2px`,
});

export const radio = style({
  padding: "0 0.5rem",
  borderRadius: "0.25rem",

  selectors: {
    "&:has(:checked)": {
      backgroundColor: "#d9f99d",
      borderBottom: `solid ${variables.color.black} 2px`,
    },
  },
});

export const radioInput = style({
  display: "none",
});
