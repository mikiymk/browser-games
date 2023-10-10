import solidJs from "@astrojs/solid-js";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import compress from "astro-compress";
import { defineConfig } from "astro/config";
import topLevelAwaitPlugin from "vite-plugin-top-level-await";
import wasmPlugin from "vite-plugin-wasm";

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

    esbuild: {
      mangleProps: /_$/,
    },
  },
});
