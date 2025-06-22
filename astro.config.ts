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
    compress({
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      CSS: {
        csso: {
          forceMediaMerge: true,
        },
      },
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
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
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      Image: {
        sharp: {},
      },
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      JavaScript: {
        terser: {},
      },
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      SVG: {
        svgo: {
          multipass: true,
        },
      },
    }),
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
