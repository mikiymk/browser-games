import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-i";
import solid from "eslint-plugin-solid";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import typescript from "typescript-eslint";

export default typescript.config(
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/env.d.ts"],

    plugins: {
      "@typescript-eslint": typescript.plugin,
      import: pluginImport,
      unicorn,
      solid,
      vitest,
      "@eslint-community/eslint-comments": eslintComments,
    },

    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
      },

      parser: typescript.parser,
      parserOptions: {
        sourceType: "module",
        project: true,
        tsconfigRootDir: "./",
      },
    },

    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "error",
    },

    rules: {
      // extends
      ...eslint.configs.recommended.rules,
      ...typescript.plugin.configs["eslint-recommended"].overrides[0].rules,
      ...typescript.plugin.configs["recommended-type-checked"].rules,
      ...typescript.plugin.configs["strict-type-checked"].rules,
      ...typescript.plugin.configs["stylistic-type-checked"].rules,
      ...unicorn.configs.recommended.rules,
      ...solid.configs.typescript.rules,
      ...vitest.configs.recommended.rules,
      ...prettier.rules,

      // my custom

      // eslint

      // unicorn
      "unicorn/number-literal-case": "off",
      "unicorn/prefer-query-selector": "off",

      // typescript
      "class-methods-use-this": "off",
      "@typescript-eslint/class-methods-use-this": "error",
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/method-signature-style": "error",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/parameter-properties": "error",
      "prefer-destructuring": "off",
      "@typescript-eslint/prefer-destructuring": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-readonly-parameter-types": [
        "warn",
        {
          allow: [
            { from: "lib", name: ["MouseEvent", "KeyboardEvent", "HTMLInputElement", "HTMLSelectElement", "Node"] },
            { from: "package", package: "solid-js", name: ["JSX", "JSXElement", "JSX.Element", "JSX.ArrayElement"] },
          ],
          treatMethodsAsReadonly: true,
        },
      ],
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "no-return-await": "off",
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

      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
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

      // import
      "import/no-empty-named-blocks": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
          bundledDependencies: false,
        },
      ],
      "import/no-mutable-exports": "error",
      "import/unambiguous": "error",
      "import/no-absolute-path": "error",
      "import/no-useless-path-segments": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/newline-after-import": "error",
      "import/no-anonymous-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-named-default": "error",
      "import/no-unassigned-import": "error",

      "import/order": [
        "error",
        {
          groups: [],
          "newlines-between": "never",
        },
      ],

      // eslint-comments
      "@eslint-community/eslint-comments/no-use": ["error", { allow: ["eslint-disable-next-line"] }],
      "@eslint-community/eslint-comments/require-description": "error",

      // unnecessary with typescript

      "import/export": "off",
      "import/default": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/no-unresolved": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",

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

      // 1.6.0 promoted
      "no-unused-private-class-members": "off", // lint/correctness/noUnusedPrivateClassMembers
      "@typescript-eslint/no-use-before-define": "off", // lint/correctness/noInvalidUseBeforeDeclaration
      "@typescript-eslint/consistent-type-exports": "off", // lint/style/useExportType
      "unicorn/filename-case": "off", // lint/style/useFilenamingConvention
      "unicorn/no-for-loop": "off", // lint/style/useForOf
      "@typescript-eslint/prefer-for-of": "off", // lint/style/useForOf
      "@typescript-eslint/consistent-type-imports": "off", // lint/style/useImportType
      "unicorn/prefer-node-protocol": "off", // lint/style/useNodejsImportProtocol
      "unicorn/prefer-number-properties": "off", // lint/style/useNumberNamespace
      "@typescript-eslint/prefer-function-type": "off", // lint/style/useShorthandFunctionType
      "no-empty": "off", // lint/suspicious/noEmptyBlockStatements
      "no-empty-static-block": "off", // lint/suspicious/noEmptyBlockStatements
      "no-empty-function": "off", // lint/suspicious/noEmptyBlockStatements
      "@typescript-eslint/no-empty-function": "off", // lint/suspicious/noEmptyBlockStatements
      "no-global-assign": "off", // lint/suspicious/noGlobalAssign
      "no-misleading-character-class": "off", // lint/suspicious/noMisleadingCharacterClass
      "unicorn/no-thenable": "off", // lint/suspicious/noThenProperty

      // 1.7.0 promoted
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

    rules: {},
  },
);
