import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-i";
import solid from "eslint-plugin-solid";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import globals from "globals";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/env.d.ts"],

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
      ...prettier.rules,

      // my custom
      "unicorn/number-literal-case": "off",
      "unicorn/prefer-query-selector": "off",

      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": "error",

      "import/order": [
        "error",
        {
          groups: ["external", "internal", "sibling", "type"],
          "newlines-between": "always",
        },
      ],

      // unnecessary with Biome

      "@typescript-eslint/ban-types": "off", // lint/complexity/noBannedTypes
      "no-extra-boolean-cast": "off", // lint/complexity/noExtraBooleanCast
      "unicorn/no-array-for-each": "off", // lint/complexity/noForEach
      "no-regex-spaces": "off", // lint/complexity/noMultipleSpacesInRegularExpressionLiterals
      "@typescript-eslint/no-extraneous-class": "off", // lint/complexity/noStaticOnlyClass
      "unicorn/no-static-only-class": "off", // lint/complexity/noStaticOnlyClass
      "no-useless-catch": "off", // lint/complexity/noUselessCatch
      "@typescript-eslint/no-useless-constructor": "off", // lint/complexity/noUselessConstructor
      "@typescript-eslint/no-this-alias": "off", // lint/complexity/noUselessThisAlias
      "unicorn/no-this-assignment": "off", // lint/complexity/noUselessThisAlias
      "@typescript-eslint/no-unnecessary-type-constraint": "off", // lint/complexity/noUselessTypeConstraint
      "no-with": "off", // lint/complexity/noWith
      "unicorn/prefer-array-flat-map": "off", // lint/complexity/useFlatMap
      "@typescript-eslint/dot-notation": "off", // lint/complexity/useLiteralKeys
      "@typescript-eslint/prefer-optional-chain": "off", // lint/complexity/useOptionalChain

      "no-constant-condition": "off", // lint/correctness/noConstantCondition
      "no-empty-character-class": "off", // lint/correctness/noEmptyCharacterClassInRegex
      "no-empty-pattern": "off", // lint/correctness/noEmptyPattern
      "no-inner-declarations": "off", // lint/correctness/noInnerDeclarations
      // "unicorn/new-for-builtin": "off", // lint/correctness/noInvalidNewBuiltin
      "no-self-assign": "off", // lint/correctness/noSelfAssign
      "no-unsafe-finally": "off", // lint/correctness/noUnsafeFinally
      "no-unsafe-optional-chaining": "off", // lint/correctness/noUnsafeOptionalChaining
      "no-unused-labels": "off", // lint/correctness/noUnusedLabels
      "@typescript-eslint/no-unused-vars": "off", // lint/correctness/noUnusedVariables
      "use-isnan": "off", // lint/correctness/useIsNan
      "for-direction": "off", // lint/correctness/useValidForDirection
      "require-yield": "off", // lint/correctness/useYield

      "prefer-rest-params": "off", // lint/style/noArguments
      "@typescript-eslint/no-namespace": "off", // lint/style/noNamespace
      "unicorn/no-negated-condition": "off", // lint/style/noNegationElse
      "@typescript-eslint/no-non-null-assertion": "off", // lint/style/noNonNullAssertion
      "no-var": "off", // lint/style/noVar
      "@typescript-eslint/prefer-as-const": "off", // lint/style/useAsConstAssertion
      "prefer-const": "off", // lint/style/useConst
      "@typescript-eslint/prefer-literal-enum-member": "off", // lint/style/useLiteralEnumMembers
      "solid/self-closing-comp": "off", // lint/style/useSelfClosingElements
      "@typescript-eslint/array-type": "off", // lint/style/useShorthandArrayType
      "unicorn/switch-case-braces": "off", // lint/style/useSingleCaseStatement
      "no-case-declarations": "off", // lint/style/useSingleCaseStatement

      "no-async-promise-executor": "off", // lint/suspicious/noAsyncPromiseExecutor
      "no-ex-assign": "off", // lint/suspicious/noCatchAssign
      "no-class-assign": "off", // lint/suspicious/noClassAssign
      "no-compare-neg-zero": "off", // lint/suspicious/noCompareNegZero
      "@typescript-eslint/no-invalid-void-type": "off", // lint/suspicious/noConfusingVoidType
      "no-control-regex": "off", // lint/suspicious/noControlCharactersInRegex
      "no-debugger": "off", // lint/suspicious/noDebugger
      "no-duplicate-case": "off", // lint/suspicious/noDuplicateCase
      "solid/jsx-no-duplicate-props": "off", // lint/suspicious/noDuplicateJsxProps
      "@typescript-eslint/no-explicit-any": "off", // lint/suspicious/noExplicitAny
      "@typescript-eslint/no-extra-non-null-assertion": "off", // lint/suspicious/noExtraNonNullAssertion
      "no-fallthrough": "off", // lint/suspicious/noFallthroughSwitchClause
      "@typescript-eslint/no-misused-new": "off", // lint/suspicious/noMisleadingInstantiator
      "no-prototype-builtins": "off", // lint/suspicious/noPrototypeBuiltins
      "no-shadow-restricted-names": "off", // lint/suspicious/noShadowRestrictedNames
      "no-sparse-arrays": "off", // lint/suspicious/noSparseArray
      "@typescript-eslint/no-unsafe-declaration-merging": "off", // lint/suspicious/noUnsafeDeclarationMerging
      "unicorn/no-instanceof-array": "off", // lint/suspicious/useIsArray
      "@typescript-eslint/prefer-namespace-keyword": "off", // lint/suspicious/useNamespaceKeyword
      "valid-typeof": "off", // lint/suspicious/useValidTypeof
    },
  },

  // not test
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/env.d.ts", "**/*.test.ts", "**/*.test.tsx"],

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
    ignores: [],

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
