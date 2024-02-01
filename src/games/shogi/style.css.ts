import { style } from "@vanilla-extract/css";

export const pieceStyle = style({
  fill: "#ee6",
  stroke: "#000",
});

export const kanjiStyle = style({
  textAnchor: "middle",
  fontSize: 20,
  fontFamily: "'Noto Sans JP', sans-serif",
});

export const redKanjiStyle = style([
  kanjiStyle,
  {
    fill: "red",
  },
]);
