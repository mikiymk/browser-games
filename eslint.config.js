import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-i";
import solid from "eslint-plugin-solid";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import { rules as prettier } from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/wasms/**/*", "vite.config.ts", "src/env.d.ts"],

    plugins: {
      "@typescript-eslint": typescript,
      import: pluginImport,
      unicorn,
      solid,
      vitest,
    },

    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
      },

      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        project: true,
        tsconfigRootDir: "./",
      },
    },

    settings: {
      "import/resolver": "typescript",
    },

    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs["eslint-recommended"].overrides[0].rules,
      ...typescript.configs["recommended-type-checked"].rules,
      ...typescript.configs["strict-type-checked"].rules,
      ...typescript.configs["stylistic-type-checked"].rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,
      ...unicorn.configs.recommended.rules,
      ...solid.configs.typescript.rules,
      ...vitest.configs.recommended.rules,
      ...prettier,

      // my custom
      "unicorn/number-literal-case": "off",
      "unicorn/prefer-query-selector": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": "error",

      "import/order": [
        "error",
        {
          groups: ["external", "internal", "sibling", "type"],
          "newlines-between": "always",
        },
      ],
    },
  },

  // not test
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/wasms/**/*", "vite.config.ts", "**/*.test.ts", "**/*.test.tsx"],

    plugins: {
      import: pluginImport,
    },

    rules: {
      "import/no-unused-modules": [
        "warn",
        {
          missingExports: true,
          // unusedExports: true,
        },
      ],
    },
  },

  // test
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    ignores: ["src/wasms/**/*"],

    plugins: {
      import: pluginImport,
    },

    rules: {
      "import/no-unused-modules": [
        "warn",
        // {
        //   unusedExports: true,
        // },
      ],
    },
  },
];
