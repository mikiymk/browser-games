/** @type {import('stylelint').Config} */
export default {
  extends: "stylelint-config-standard",

  rules: {
    // Biomeと被るルールを無効化

    // Biome 1.9.0
    "font-family-no-missing-generic-family-keyword": null, // a11y/useGenericFontNames
    "function-linear-gradient-no-nonstandard-direction": null, // correctness/noInvalidDirectionInLinearGradient
    "named-grid-areas-no-invalid": null, // correctness/noInvalidGridAreas
    "no-invalid-position-at-import-rule": null, // correctness/noInvalidPositionAtImportRule
    "function-no-unknown": null, // correctness/noUnknownFunction
    "media-feature-name-no-unknown": null, // correctness/noUnknownMediaFeatureName
    "property-no-unknown": null, // correctness/noUnknownProperty
    "unit-no-unknown": null, // correctness/noUnknownUnit
    "selector-anb-no-unmatchable": null, // correctness/noUnmatchableAnbSelector
    "no-duplicate-at-import-rules": null, // suspicious/noDuplicateAtImportRules
    "font-family-no-duplicate-names": null, // suspicious/noDuplicateFontNames
    "keyframe-block-no-duplicate-selectors": null, // suspicious/noDuplicateSelectorsKeyframeBlock
    "block-no-empty": null, // suspicious/noEmptyBlock
    "keyframe-declaration-no-important": null, // suspicious/noImportantInKeyframe
    "declaration-block-no-shorthand-property-overrides": null, // suspicious/noShorthandPropertyOverrides
  },
};
