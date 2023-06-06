import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "https://mikiymk.github.io/js-html-game/",

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
