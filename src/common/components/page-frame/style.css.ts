import { keyframes, style } from "@vanilla-extract/css";

import { pageBody, pageHeader, pageHeaderShadow, text } from "../../../styles/colors.css.ts";

export const header = style({
  alignItems: "center",
  backgroundColor: pageHeader,
  display: "flex",
  flexDirection: "row",
  fontSize: "1.25rem",
  gap: "0.5rem",
  height: "3rem",
  lineHeight: "1.75rem",
  padding: "0 0.5rem",
});

export const headerTitle = style({
  flex: "1 1 0%",
});

export const headerButton = style({
  ":active": {
    borderStyle: "inset",
  },
  alignItems: "center",
  border: `4px ${pageHeaderShadow} outset`,
  borderRadius: "0.25rem",
  display: "flex",
  flexDirection: "row",

  gap: "0.5rem",
  padding: "0 0.5rem",

  width: "max-content",
});

export const headerIcon = style({
  aspectRatio: "1 / 1",
  height: "2rem",
});

export const headerText = style({
  "@media": {
    "(width >= 640px)": {
      display: "inline",
    },
  },

  display: "none",
});

export const body = style({
  alignItems: "center",
  backgroundColor: pageBody,
  display: "flex",
  flexDirection: "column",
  height: "calc(100dvh - 3rem)",
});

const fade = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const overlay = style({
  background: "#0001",
  inset: 0,
  position: "fixed",
});

export const content = style({
  animation: `${fade} 0.1s`,
  backgroundColor: pageBody,
  border: `2px solid ${text}`,
  left: "50%",

  padding: "1rem",
  position: "fixed",
  top: "50%",

  transform: "translate(-50%, -50%)",
});
