import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        noto: ["Noto Sans JP", "sans-serif"],
        "noto-emoji": ["Noto Color Emoji", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        ".anchor-mid": {
          textAnchor: "middle",
        },
      });
    }),
  ],
} satisfies Config;
