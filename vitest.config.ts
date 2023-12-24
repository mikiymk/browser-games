/* eslint-disable import/no-unused-modules */
/* eslint-disable unicorn/prefer-module */

// eslint-disable-next-line import/no-unresolved

import { defineConfig } from "vitest/config";

import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: resolve(__dirname, "src/$1") }],
  },

  test: {
    reporters: "default",
  },
});
