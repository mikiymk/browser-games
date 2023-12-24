export default {
  ignoreDependencies: ["eslint-import-resolver-typescript"],
  compilers: {
    astro: (text: string) => [...text.matchAll(/import[^;]+/g)].join("\n"),
  },
};
