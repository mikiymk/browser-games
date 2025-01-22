import solidJs from "@astrojs/solid-js";
import type { AstroIntegration } from "astro";
import compress from "astro-compress";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mikiymk.github.io/",
  base: "browser-games/",
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
    }) as unknown as AstroIntegration,
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
          chunkFileNames: "_astro/[hash:16].js",
          entryFileNames: "_astro/[hash:16].js",
        },
      },
    },
    server: {
      watch: {
        ignored: ["**/.zig-cache/**"],
      },
    },
  },
});
