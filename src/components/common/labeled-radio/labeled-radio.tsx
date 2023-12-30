import { checkedDisableRadioStyle, checkedRadioStyle, disableRadioStyle, radioStyle } from "./labeled-radio.css";

import type { JSXElement } from "solid-js";

type LabeledRadioInputProperties = {
  label: JSXElement;
  checked: boolean;
  enable?: boolean;
  check: () => void;
};
export const LabeledRadioInput = (properties: LabeledRadioInputProperties) => {
  const styleClass = () => {
    const enable = properties.enable ?? true;
    const checked = properties.checked;
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
