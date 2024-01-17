const knipConfig = {
  ignoreBinaries: ["zig", "export"],
  ignoreDependencies: ["eslint-import-resolver-typescript"],
  compilers: {
    astro: (text: string): string => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
};

export default knipConfig;
