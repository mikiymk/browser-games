import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
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
      HTML: {
        "html-minifier-terser": {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          decodeEntities: true,
          removeAttributeQuotes: true,
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
      CSS: {
        csso: {
          forceMediaMerge: true,
        },
      },
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      JavaScript: {
        terser: {},
      },
      // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
      SVG: {
        svgo: {
          multipass: true,
          plugins: [
            {
              name: "cleanupIds",
              params: {
                preserve: ["root"],
              },
            },
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
      },
    }),
    tailwind(),
  ],
  // biome-ignore lint/style/useNamingConvention: ライブラリに合わせる
  compressHTML: true,
  vite: {
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
