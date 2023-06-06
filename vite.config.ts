/* eslint-disable unicorn/prefer-module */

import { resolve } from "node:path";

// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        ox3: resolve(__dirname, "src/ox3/index.html"),
        chess: resolve(__dirname, "src/chess/index.html"),
      },
    },
  },

  test: {},
});
