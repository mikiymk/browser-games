import solid from "@astrojs/solid-js";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "astro/config";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  base: "browser-games/",
  // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
  compressHTML: true,

  integrations: [
    solid(),
    // biome-ignore-start lint/style/useNamingConvention: ライブラリに合わせる
    compress({
      CSS: {
        csso: {
          forceMediaMerge: true,
        },
      },
      HTML: {
        "html-minifier-terser": {
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          decodeEntities: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          sortAttributes: true,
          sortClassName: true,
        },
      },
      Image: {
        sharp: {},
      },
      JavaScript: {
        terser: {},
      },
      SVG: {
        svgo: {
          multipass: true,
        },
      },
    }),
    // biome-ignore-end lint/style/useNamingConvention: ライブラリに合わせる
  ],
  site: "https://mikiymk.github.io/",
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "_assets/[hash:16][extname]",
          chunkFileNames: "_astro/[hash:16].js",
          entryFileNames: "_astro/[hash:16].js",
        },
      },
    },
    esbuild: {
      mangleProps: /_$/,
    },
    plugins: [
      vanillaExtractPlugin({
        identifiers: "short",
      }),
    ],
    server: {
      watch: {
        ignored: ["**/.zig-cache/**"],
      },
    },
  },
});
