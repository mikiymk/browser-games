import { style } from "@vanilla-extract/css";

const disableStyle = style({
  color: "gray",
});

export const radioStyle = style({
  display: "inline-block",
  width: "5rem",
  boxSizing: "border-box",
  border: "solid white 2px",
});

export const checkedRadioStyle = style([
  radioStyle,
  {
    borderColor: "black",
  },
]);

export const disableRadioStyle = style([radioStyle, disableStyle]);
export const checkedDisableRadioStyle = style([checkedRadioStyle, disableStyle]);
