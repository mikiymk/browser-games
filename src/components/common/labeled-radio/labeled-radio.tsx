import type { JSXElement } from "solid-js";
import { checkedDisableRadioStyle, checkedRadioStyle, disableRadioStyle, radioStyle } from "./labeled-radio.css";

type LabeledRadioInputProperties = {
  readonly label: JSXElement;
  readonly checked: boolean;
  readonly enable?: boolean;
  readonly check: () => void;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const LabeledRadioInput = (properties: LabeledRadioInputProperties): JSXElement => {
  const styleClass = (): string => {
    const { checked, enable = true } = properties;
    if (enable && !checked) {
      return radioStyle;
    }
    if (enable && checked) {
      return checkedRadioStyle;
    }
    if (!(enable || checked)) {
      return disableRadioStyle;
    }

    return checkedDisableRadioStyle;
  };

  return (
    <label class={styleClass()}>
      {properties.label}
      <input
        type="radio"
        checked={properties.checked}
        disabled={properties.enable === false}
        onClick={() => {
          properties.check();
        }}
      />
    </label>
  );
};
