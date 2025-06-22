const knipConfig = {
  compilers: {
    astro: (text: string): string => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
  ignoreBinaries: ["zig"],
};

export default knipConfig;
