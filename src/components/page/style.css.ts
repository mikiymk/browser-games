import { style } from "@vanilla-extract/css";

export const header = style({
  height: "3rem",
  padding: "0 0.5rem",
  fontSize: "1.25rem",
  lineHeight: "1.75rem",
  backgroundColor: "#fdba74",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",
});

export const headerTitle = style({
  flex: "1 1 0%",
});

export const headerButton = style({
  width: "max-content",
  padding: "0 0.5rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",

  border: "4px #f97316 outset",
  borderRadius: "0.25rem",

  ":active": {
    borderStyle: "inset",
  },
});

export const headerIcon = style({
  height: "2rem",
  aspectRatio: "1 / 1",
});

export const headerText = style({
  display: "none",

  "@media": {
    "(width >= 640px)": {
      display: "inline",
    },
  },
});

export const body = style({
  height: "calc(100dvh - 3rem)",
  backgroundColor: "#fef3c7",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
