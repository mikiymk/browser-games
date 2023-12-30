export default {
  ignoreBinaries: ["zig"],
  ignoreDependencies: ["eslint-import-resolver-typescript"],
  compilers: {
    astro: (text: string) => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
};
