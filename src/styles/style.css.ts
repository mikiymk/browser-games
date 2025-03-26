import { createTheme, style } from "@vanilla-extract/css";
import { japanese, latin } from "./fonts.css";

const [theme, variables] = createTheme({
  color: {
    black: "#091323",
    red: "#dc2626",
    dark: "#78716c",
    light: "#e7e5e4",
  },
});

const rootStyle = style([
  theme,
  {
    color: variables.color.black,
    fontFamily: `${latin}, ${japanese}, sans-serif`,
  },
]);

export { rootStyle, variables };
