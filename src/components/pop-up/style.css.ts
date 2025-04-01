import { style } from "@vanilla-extract/css";
import { variables } from "../../styles/style.css.ts";

export const popup = style({
  backgroundColor: "#fef9c3",
  border: `2px solid ${variables.color.black}`,

  "::backdrop": {
    position: "fixed",
    inset: 0,
    backgroundColor: "#0001",
  },
});

export const popupInner = style({
  padding: "1rem",
});
