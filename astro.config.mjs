import solidJs from "@astrojs/solid-js";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import compress from "astro-compress";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mikiymk.github.io/",
  base: "js-html-game/",

  integrations: [
    solidJs({}),
    compress({
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      SVG: {
        multipass: true,

        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupIds: false,
              },
            },
          },
        ],
      },

      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      Logger: 1,
    }),
  ],

  // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
  compressHTML: true,

  vite: {
    plugins: [vanillaExtractPlugin()],

    esbuild: {
      mangleProps: /_$/,
    },

    build: {
      rollupOptions: {
        output: {
          assetFileNames: "_assets/[hash:16][extname]",
        },
      },
    },

    server: {
      watch: {
        ignored: ["**/zig-cache/**"],
      },
    },
  },
});
