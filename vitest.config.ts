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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [solidPlugin(), wasmPlugin(), topLevelAwaitPlugin()],

  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: resolve(__dirname, "src/$1") }],
  },

  test: {
    reporters: "default",
  },
});
