import { style } from "@vanilla-extract/css";
import { settingRadioSelected, text } from "../../styles/colors.css.ts";

export const number = style({
  textAlign: "right",
  borderBottom: `solid ${text} 2px`,
});

export const radio = style({
  padding: "0 0.5rem",

  selectors: {
    "&:has(:checked)": {
      backgroundColor: settingRadioSelected,
      borderBottom: `solid ${text} 2px`,
    },
  },
});

export const radioInput = style({
  display: "none",
});
