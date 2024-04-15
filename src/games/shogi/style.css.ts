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

export const moveTargetStyle = style({
  fill: "#fa1",
});

export const handCellStyle = style({
  padding: "0.1rem",

  border: "1px solid #000",
  textAlign: "end",
});

export const handHeaderCellStyle = style([
  handCellStyle,
  {
    backgroundColor: "orange",
    textAlign: "center",
  },
]);
