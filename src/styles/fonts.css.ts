import { fontFace } from "@vanilla-extract/css";

/** Noto Sans Latin */
export const latin = fontFace({
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/latin-400-normal.woff2) format('woff2')",
});

/** Noto Sans Japanese */
export const japanese = fontFace({
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.woff2) format('woff2')",
});

/** Noto Color Emoji */
export const emoji = fontFace({
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-color-emoji@latest/emoji-400-normal.woff2) format('woff2')",
});

/** Material Symbols Rounded */
export const symbols = fontFace({
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/material-symbols-rounded@latest/latin-400-normal.woff2) format('woff2')",
});
