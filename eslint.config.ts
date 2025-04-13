import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import eslint from "@eslint/js";
import biome from "eslint-config-biome";
import astro from "eslint-plugin-astro";
import pluginImport from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
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
        "error",
        {
          allow: [
            {
              from: "lib",
              name: [
                "MouseEvent",
                "Node", //  solid-jsのJSXElementに必要
                "Element", //  solid-jsのJSXElementに必要
              ],
            },
            {
              from: "package",
              package: "solid-js",
              name: [
                "ArrayElement", //  solid-jsのJSXElementに必要
              ],
            },
          ],
          ignoreInferredTypes: true,
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
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
        },
      ],
    },
  },
  {
    // import
    plugins: { import: pluginImport },
    rules: {
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/newline-after-import": "error",
      "import/no-absolute-path": "error",
      "import/no-anonymous-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-empty-named-blocks": "error",
      "import/no-extraneous-dependencies": "off",
      "import/no-mutable-exports": "error",
      "import/no-named-default": "error",
      "import/no-unassigned-import": "error",
      "import/no-unresolved": ["error", { ignore: ["\\.css$"] }],
      "import/no-unused-modules": ["error", { missingExports: true }],
      "import/no-useless-path-segments": "error",
      "import/order": ["error", { groups: [], "newlines-between": "never" }],
      "import/unambiguous": "error",
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
    files: ["**/*.astro"],
    extends: [typescript.configs.disableTypeChecked], // 型を利用する検査を行わない
    rules: {
      "import/no-unused-modules": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "unicorn/text-encoding-identifier-case": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            // biome-ignore lint/style/useNamingConvention: Astroのプロパティの型はPropsで表す
            Props: true,
          },
        },
      ],
    },
  },
  {
    // perfectionist
    rules: {
      "import/order": "off",
      "@typescript-eslint/adjacent-overload-signatures": "off",
      "@typescript-eslint/sort-type-constituents": "off",
      "react/jsx-sort-props": "off",
      "sort-imports": "off",
      "sort-keys": "off",
    },
  },
  {
    rules: {
      // typescriptで検出できるルール
      "import/export": "off",
      "import/default": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
    },
  },
  {
    rules: {
      // Biomeで検出できるルール
      "@typescript-eslint/ban-types": "off", // complexity/noBannedTypes
      "no-extra-boolean-cast": "off", // complexity/noExtraBooleanCast
      "unicorn/no-array-for-each": "off", // complexity/noForEach
      "no-regex-spaces": "off", // complexity/noMultipleSpacesInRegularExpressionLiterals
      "@typescript-eslint/no-extraneous-class": "off", // complexity/noStaticOnlyClass
      "unicorn/no-static-only-class": "off", // complexity/noStaticOnlyClass
      "no-useless-catch": "off", // complexity/noUselessCatch
      "@typescript-eslint/no-useless-constructor": "off", // complexity/noUselessConstructor
      "@typescript-eslint/no-this-alias": "off", // complexity/noUselessThisAlias
      "unicorn/no-this-assignment": "off", // complexity/noUselessThisAlias
      "@typescript-eslint/no-unnecessary-type-constraint": "off", // complexity/noUselessTypeConstraint
      "no-with": "off", // complexity/noWith
      "unicorn/prefer-array-flat-map": "off", // complexity/useFlatMap
      "@typescript-eslint/dot-notation": "off", // complexity/useLiteralKeys
      "@typescript-eslint/prefer-optional-chain": "off", // complexity/useOptionalChain

      "no-constant-condition": "off", // correctness/noConstantCondition
      "no-empty-character-class": "off", // correctness/noEmptyCharacterClassInRegex
      "no-empty-pattern": "off", // correctness/noEmptyPattern
      "no-inner-declarations": "off", // correctness/noInnerDeclarations
      "no-self-assign": "off", // correctness/noSelfAssign
      "no-unsafe-finally": "off", // correctness/noUnsafeFinally
      "no-unsafe-optional-chaining": "off", // correctness/noUnsafeOptionalChaining
      "no-unused-labels": "off", // correctness/noUnusedLabels
      "@typescript-eslint/no-unused-vars": "off", // correctness/noUnusedVariables
      "use-isnan": "off", // correctness/useIsNan
      "for-direction": "off", // correctness/useValidForDirection
      "require-yield": "off", // correctness/useYield

      "prefer-rest-params": "off", // style/noArguments
      "@typescript-eslint/no-namespace": "off", // style/noNamespace
      "unicorn/no-negated-condition": "off", // style/noNegationElse
      "@typescript-eslint/no-non-null-assertion": "off", // style/noNonNullAssertion
      "no-var": "off", // style/noVar
      "@typescript-eslint/prefer-as-const": "off", // style/useAsConstAssertion
      "prefer-const": "off", // style/useConst
      "@typescript-eslint/prefer-literal-enum-member": "off", // style/useLiteralEnumMembers
      "solid/self-closing-comp": "off", // style/useSelfClosingElements
      "@typescript-eslint/array-type": "off", // style/useShorthandArrayType
      "unicorn/switch-case-braces": "off", // style/useSingleCaseStatement
      "no-case-declarations": "off", // style/useSingleCaseStatement

      "no-async-promise-executor": "off", // suspicious/noAsyncPromiseExecutor
      "no-ex-assign": "off", // suspicious/noCatchAssign
      "no-class-assign": "off", // suspicious/noClassAssign
      "no-compare-neg-zero": "off", // suspicious/noCompareNegZero
      "@typescript-eslint/no-invalid-void-type": "off", // suspicious/noConfusingVoidType
      "no-control-regex": "off", // suspicious/noControlCharactersInRegex
      "no-debugger": "off", // suspicious/noDebugger
      "no-duplicate-case": "off", // suspicious/noDuplicateCase
      "solid/jsx-no-duplicate-props": "off", // suspicious/noDuplicateJsxProps
      "@typescript-eslint/no-explicit-any": "off", // suspicious/noExplicitAny
      "@typescript-eslint/no-extra-non-null-assertion": "off", // suspicious/noExtraNonNullAssertion
      "no-fallthrough": "off", // suspicious/noFallthroughSwitchClause
      "@typescript-eslint/no-misused-new": "off", // suspicious/noMisleadingInstantiator
      "no-prototype-builtins": "off", // suspicious/noPrototypeBuiltins
      "no-shadow-restricted-names": "off", // suspicious/noShadowRestrictedNames
      "no-sparse-arrays": "off", // suspicious/noSparseArray
      "@typescript-eslint/no-unsafe-declaration-merging": "off", // suspicious/noUnsafeDeclarationMerging
      "unicorn/no-instanceof-array": "off", // suspicious/useIsArray
      "@typescript-eslint/prefer-namespace-keyword": "off", // suspicious/useNamespaceKeyword
      "valid-typeof": "off", // suspicious/useValidTypeof

      // 1.6.0
      "no-unused-private-class-members": "off", // correctness/noUnusedPrivateClassMembers
      "@typescript-eslint/no-use-before-define": "off", // correctness/noInvalidUseBeforeDeclaration
      "@typescript-eslint/consistent-type-exports": "off", // style/useExportType
      "unicorn/filename-case": "off", // style/useFilenamingConvention
      "unicorn/no-for-loop": "off", // style/useForOf
      "@typescript-eslint/prefer-for-of": "off", // style/useForOf
      "@typescript-eslint/consistent-type-imports": "off", // style/useImportType
      "unicorn/prefer-node-protocol": "off", // style/useNodejsImportProtocol
      "unicorn/prefer-number-properties": "off", // style/useNumberNamespace
      "@typescript-eslint/prefer-function-type": "off", // style/useShorthandFunctionType
      "no-empty": "off", // suspicious/noEmptyBlockStatements
      "no-empty-static-block": "off", // suspicious/noEmptyBlockStatements
      "no-empty-function": "off", // suspicious/noEmptyBlockStatements
      "@typescript-eslint/no-empty-function": "off", // suspicious/noEmptyBlockStatements
      "no-global-assign": "off", // suspicious/noGlobalAssign
      "no-misleading-character-class": "off", // suspicious/noMisleadingCharacterClass
      "unicorn/no-thenable": "off", // suspicious/noThenProperty

      // 1.7.0
      "barrel-files/avoid-barrel-files": "off", // performance/noBarrelFile
      "barrel-files/avoid-re-export-all": "off", // performance/noReExportAll
      "barrel-files/avoid-namespace-import": "off", // style/noNamespaceImport
      // style/useNodeAssertStrict
      "jest/no-disabled-tests": "off", // suspicious/noSkippedTests

      // 1.8.0
      "import/no-nodejs-modules": "off", // correctness/noNodejsModules
      "no-array-constructor": "off", // correctness/useArrayLiterals
      // correctness/noConstantMathMinMaxClamp
      // correctness/noFlatMapIdentity

      // 1.9.0
      "no-useless-concat": "off", // complexity/noUselessStringConcat
      "no-undef-init": "off", // complexity/noUselessUndefinedInitialization
      "unicorn/prefer-date-now": "off", // complexity/useDateNow
      // correctness/noUndeclaredDependencies
      // correctness/noUnusedFunctionParameters
      // correctness/useImportExtensions
      // performance/useTopLevelRegex
      "jest/no-done-callback": "off", // style/noDoneCallback
      yoda: "off", // style/noYodaExpression
      "no-new-wrappers": "off", // style/useConsistentBuiltinInstantiation
      "default-case": "off", // style/useDefaultSwitchClause
      "unicorn/explicit-length-check": "off", // style/useExplicitLengthCheck
      "unicorn/throw-new-error": "off", // style/useThrowNewError
      "no-throw-literal": "off", // style/useThrowOnlyError
      "@typescript-eslint/only-throw-error": "off", // style/useThrowOnlyError
      "no-console": "off", // suspicious/noConsole
      // suspicious/noEvolvingTypes
      "jest/no-standalone-expect": "off", // suspicious/noMisplacedAssertion
      "solidjs/no-react-specific-props": "off", // suspicious/noReactSpecificProps
      "unicorn/error-message": "off", // suspicious/useErrorMessage
      "unicorn/require-number-to-fixed-digits-argument": "off", // suspicious/useNumberToFixedDigitsArgument
    },
  },
);
