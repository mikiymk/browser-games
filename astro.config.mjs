import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import topLevelAwaitPlugin from "vite-plugin-top-level-await";
import wasmPlugin from "vite-plugin-wasm";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://mikiymk.github.io/",
  base: "js-html-game/",
  integrations: [
    solidJs({}),
    compress({
      SVG: {
        multipass: true,
      },
    }),
  ],

  compressHTML: false,

  vite: {
    plugins: [
      // solidPlugin(),
      vanillaExtractPlugin(),
      wasmPlugin(),
      topLevelAwaitPlugin(),
    ],

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
        },
      },
    },
  },
});
