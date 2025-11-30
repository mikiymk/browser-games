const knipConfig = {
  compilers: {
    astro: (text: string): string => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
  ignoreBinaries: ["zig"],
};

// biome-ignore lint/style/noDefaultExport: knipに従う
export default knipConfig;
