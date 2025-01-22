const knipConfig = {
  ignoreBinaries: ["zig"],
  ignoreDependencies: ["eslint-import-resolver-typescript", "@tsconfig/strictest"],
  compilers: {
    astro: (text: string): string => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
};

export default knipConfig;
