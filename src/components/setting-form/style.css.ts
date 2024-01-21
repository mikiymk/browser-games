import { style } from "@vanilla-extract/css";

export const formStyle = style({
  padding: "0.6rem",
  width: "max-content",
  backgroundColor: "#ff6",

  display: "flex",
  flexDirection: "column",

  border: "orange solid 1rem",
});

export const settingListStyle = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "1rem",
  margin: "1rem 0",
});

export const startButtonStyle = style({
  alignSelf: "center",
  padding: "0.2rem 0.4rem",
  background: "#aaa",
});

export const inputLabelStyle = style({
  padding: "0 0.3rem",
  border: "#0000 solid 0.1rem",

  selectors: {
    "&:has(:checked)": {
      borderColor: "#222",
    },
  },
});

export const inputNumberStyle = style({
  width: "5rem",
  background: "#ccc",
  borderBottom: "#222 solid 0.2rem",
});
