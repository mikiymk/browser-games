/* eslint-disable import/no-unused-modules */
/* eslint-disable unicorn/prefer-module */

// eslint-disable-next-line import/no-unresolved

import solidPlugin from "vite-plugin-solid";
import topLevelAwaitPlugin from "vite-plugin-top-level-await";
import wasmPlugin from "vite-plugin-wasm";
import { defineConfig } from "vitest/config";

import { resolve } from "node:path";

export default defineConfig({
  base: "/js-html-game/",
  plugins: [solidPlugin(), wasmPlugin(), topLevelAwaitPlugin()],

  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: resolve(__dirname, "$1") }],
  },

  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ox3: resolve(__dirname, "ox3/index.html"),
        chess: resolve(__dirname, "chess/index.html"),
        "mine-sweeper": resolve(__dirname, "mine-sweeper/index.html"),
        "knight-tour": resolve(__dirname, "knight-tour/index.html"),
      },
    },
  },

  test: {
    reporters: "default",
  },
});
