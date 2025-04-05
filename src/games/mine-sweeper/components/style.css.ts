import { style } from "@vanilla-extract/css";
import { emoji } from "../../../styles/fonts.css.ts";
import { variables } from "../../../styles/style.css.ts";

const symbol = style({
  stroke: variables.color.black,
  strokeWidth: 2,
});

export const closed = style([symbol, { fill: "#94a3b8" }]);
export const opened = style([symbol, { fill: "none" }]);
export const mineStyle = style([symbol, { fill: "#0f172a" }]);
export const flagStyle = style([symbol, { fill: "#ef4444" }]);

export const number = style({
  fontSize: 60,
  textAnchor: "middle",
  stroke: "none",
});

export const number1 = style({ fill: "#3b82f6" });
export const number2 = style({ fill: "#22c55e" });
export const number3 = style({ fill: "#ef4444" });
export const number4 = style({ fill: "#d946ef" });
export const number5 = style({ fill: "#991b1b" });
export const number6 = style({ fill: "#2dd4bf" });
export const number7 = style({ fill: "#0f172a" });
export const number8 = style({ fill: "#78716c" });

export const fontEmoji = style({
  fontFamily: emoji,
});
