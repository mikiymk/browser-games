import { fontFace, style } from "@vanilla-extract/css";

/** Material Symbols Rounded */
export const symbols = fontFace({
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/material-symbols-rounded@latest/latin-400-normal.woff2) format('woff2')",
});

/** Noto Sans */
export const notoSans = style({
  fontFamily: '"Noto Sans", sans-serif',
  fontOpticalSizing: "auto",
  fontStyle: "normal",
  fontVariationSettings: '"wdth" 100',
  fontWeight: "400",
});

/** Noto Sans JP */
export const notoSansJp = style({
  fontFamily: '"Noto Sans JP", sans-serif',
  fontOpticalSizing: "auto",
  fontStyle: "normal",
  fontWeight: "400",
});

/** Noto Emoji */
export const notoEmoji = style({
  fontFamily: '"Noto Emoji", sans-serif',
  fontStyle: "normal",
  fontWeight: "400",
});
