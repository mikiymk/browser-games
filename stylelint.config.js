/** @type {import('stylelint').Config} */
export default {
  extends: "stylelint-config-standard",
  ignoreFiles: ["dist/**/*.css"],

  rules: {
    // Biomeと被るルールを無効化
    "font-family-no-missing-generic-family-keyword": null,
  },
};
