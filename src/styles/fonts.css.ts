import { fontFace } from "@vanilla-extract/css";

// Noto Sans Latin
const latin = fontFace({
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/latin-400-normal.woff2) format('woff2')",
});

// Noto Sans Japanese
const japanese = fontFace({
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.woff2) format('woff2')",
});

// Noto Color Emoji
const emoji = fontFace({
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/noto-color-emoji@latest/emoji-400-normal.woff2) format('woff2')",
});

// Material Symbols Rounded
const symbols = fontFace({
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "400",
  src: "url(https://cdn.jsdelivr.net/fontsource/fonts/material-symbols-rounded@latest/latin-400-normal.woff2) format('woff2')",
  unicodeRange:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
});

export { latin, japanese, emoji, symbols };
