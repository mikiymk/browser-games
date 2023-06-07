/* eslint-disable unicorn/prefer-module */

import { resolve } from "node:path";

// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  base: "/js-html-game/",
  plugins: [solidPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ox3: resolve(__dirname, "ox3/index.html"),
        chess: resolve(__dirname, "chess/index.html"),
      },
    },
  },

  test: {},
});
