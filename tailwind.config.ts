import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      noto: ["Noto Sans JP", "sans-serif"],
    },

    extend: {},
  },
  plugins: [],
} satisfies Config;
