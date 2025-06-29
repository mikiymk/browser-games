import eslint from "@eslint/js";
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import biome from "eslint-config-biome";
import astro from "eslint-plugin-astro";
import importX from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import solid from "eslint-plugin-solid";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import typescript from "typescript-eslint";

export default typescript.config(
  {
    ignores: ["src/env.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
  },
  eslint.configs.recommended,
  typescript.configs.strictTypeChecked,
  typescript.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  solid.configs["flat/typescript"],
  astro.configs.recommended,
  jsxA11y.flatConfigs.strict,
  perfectionist.configs["recommended-natural"],
  jsdoc.configs["flat/recommended-typescript"],
  biome,
  {
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
      },
    },

    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // eslint
    rules: {},
  },
  {
    // unicorn
    rules: {
      "unicorn/number-literal-case": "off",
      "unicorn/prefer-query-selector": "off",
    },
  },
  {
    // typescript
    rules: {
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/prefer-destructuring": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-readonly-parameter-types": [
        "error",
        {
          allow: [
            {
              from: "lib",
              name: [
                "MouseEvent",
                // solid-jsのJSXElementに必要
                "Node",
                "Element",
              ],
            },
            {
              from: "package",
              name: [
                // solid-jsのJSXElementに必要
                "ArrayElement",
              ],
              package: "solid-js",
            },
          ],
          ignoreInferredTypes: true,
          treatMethodsAsReadonly: true,
        },
      ],
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/sort-type-constituents": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          // allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: true,
        },
      ],
      "class-methods-use-this": "off",
      "default-param-last": "off",
      "no-loop-func": "off",
      "no-return-await": "off",
      "no-unused-expressions": "off",
      "prefer-destructuring": "off",
    },
  },
  {
    // import
    plugins: { "import-x": importX },
    rules: {
      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import-x/newline-after-import": "error",
      "import-x/no-absolute-path": "error",
      "import-x/no-anonymous-default-export": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-empty-named-blocks": "error",
      "import-x/no-extraneous-dependencies": "off",
      "import-x/no-mutable-exports": "error",
      "import-x/no-named-default": "error",
      "import-x/no-unassigned-import": "error",
      "import-x/no-unresolved": "error",
      "import-x/no-unused-modules": ["error", { missingExports: true }],
      "import-x/no-useless-path-segments": "error",
      "import-x/order": ["error", { groups: [], "newlines-between": "never" }],
      "import-x/unambiguous": "error",
    },
  },
  {
    // eslint-comments
    plugins: { "@eslint-community/eslint-comments": eslintComments },
    rules: {
      "@eslint-community/eslint-comments/no-use": ["error", { allow: ["eslint-disable-next-line"] }],
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
  {
    // Astroファイル
    // 型を利用する検査を行わない
    extends: [typescript.configs.disableTypeChecked],
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
      "import-x/no-unused-modules": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            // biome-ignore lint/style/useNamingConvention: Astroのプロパティの型はPropsで表す
            Props: true,
          },
        },
      ],
      "unicorn/text-encoding-identifier-case": "off",
    },
  },
  {
    // jsdoc
    rules: {
      "jsdoc/check-indentation": "error",
      "jsdoc/no-blank-blocks": "error",
      "jsdoc/require-asterisk-prefix": "error",
      "jsdoc/require-hyphen-before-param-description": "error",
      "jsdoc/require-returns": ["error", { enableFixer: true }],
    },
  },
  {
    // ReactのルールからSolidでも利用できるもの
    plugins: { react },
    rules: {
      "react/checked-requires-onchange-or-readonly": "error",
      "react/iframe-missing-sandbox": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".astro"] }],
      "react/jsx-handler-names": "error",
      "react/jsx-max-depth": ["error", { max: 4 }],
      "react/jsx-pascal-case": "error",
      "react/jsx-props-no-spreading": "error",
      "react/no-adjacent-inline-elements": "error",
    },
  },
  {
    // perfectionist
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": "off",
      "@typescript-eslint/sort-type-constituents": "off",
      "import-x/order": "off",
      "react/jsx-sort-props": "off",
      "sort-imports": "off",
      "sort-keys": "off",
    },
  },
  {
    // typescriptで検出できるルール
    rules: {
      "import-x/default": "off",
      "import-x/export": "off",
      "import-x/named": "off",
      "import-x/namespace": "off",
      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
    },
  },
  {
    // Biomeで検出できるルール
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-misused-new": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-useless-constructor": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/prefer-for-of": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/prefer-literal-enum-member": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "barrel-files/avoid-barrel-files": "off",
      "barrel-files/avoid-namespace-import": "off",
      "barrel-files/avoid-re-export-all": "off",
      "default-case": "off",
      "for-direction": "off",
      "import-x/no-nodejs-modules": "off",
      "jest/no-disabled-tests": "off",
      "jest/no-done-callback": "off",
      "jest/no-standalone-expect": "off",
      "no-array-constructor": "off",
      "no-async-promise-executor": "off",
      "no-case-declarations": "off",
      "no-class-assign": "off",
      "no-compare-neg-zero": "off",
      "no-console": "off",
      "no-constant-condition": "off",
      "no-control-regex": "off",
      "no-debugger": "off",
      "no-duplicate-case": "off",
      "no-empty": "off",
      "no-empty-character-class": "off",
      "no-empty-function": "off",
      "no-empty-pattern": "off",
      "no-empty-static-block": "off",
      "no-ex-assign": "off",
      "no-extra-boolean-cast": "off",
      "no-fallthrough": "off",
      "no-global-assign": "off",
      "no-inner-declarations": "off",
      "no-misleading-character-class": "off",
      "no-new-wrappers": "off",
      "no-prototype-builtins": "off",
      "no-regex-spaces": "off",
      "no-self-assign": "off",
      "no-shadow-restricted-names": "off",
      "no-sparse-arrays": "off",
      "no-throw-literal": "off",
      "no-undef-init": "off",
      "no-unsafe-finally": "off",
      "no-unsafe-optional-chaining": "off",
      "no-unused-labels": "off",
      "no-unused-private-class-members": "off",
      "no-useless-catch": "off",
      "no-useless-concat": "off",
      "no-var": "off",
      "no-with": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-named-exports": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-objects": "off",
      "prefer-const": "off",
      "prefer-rest-params": "off",
      "require-yield": "off",
      "solid/jsx-no-duplicate-props": "off",
      "solid/no-react-specific-props": "off",
      "solid/self-closing-comp": "off",
      "unicorn/error-message": "off",
      "unicorn/explicit-length-check": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-for-loop": "off",
      "unicorn/no-instanceof-array": "off",
      "unicorn/no-negated-condition": "off",
      "unicorn/no-static-only-class": "off",
      "unicorn/no-thenable": "off",
      "unicorn/no-this-assignment": "off",
      "unicorn/prefer-array-flat-map": "off",
      "unicorn/prefer-date-now": "off",
      "unicorn/prefer-node-protocol": "off",
      "unicorn/prefer-number-properties": "off",
      "unicorn/require-number-to-fixed-digits-argument": "off",
      "unicorn/switch-case-braces": "off",
      "unicorn/throw-new-error": "off",
      "use-isnan": "off",
      "valid-typeof": "off",
      yoda: "off",
    },
  },
);
