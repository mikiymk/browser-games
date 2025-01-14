import { SelectRadio } from "@/components/input/select-radio";
import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HINT, TEXT_HINT_NONE, TEXT_HINT_NUMBER, TEXT_SETTINGS } from "@/scripts/constants";
import type { JSXElement, Setter } from "solid-js";

type SettingsProperties = {
  readonly hint: string;
  readonly setHint: Setter<string>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">
        <dt>{TEXT_HINT}</dt>
        <dd>
          <SelectRadio
            name="o"
            values={[
              { value: "hide", label: TEXT_HINT_NONE },
              { value: "number", label: TEXT_HINT_NUMBER },
            ]}
            value={properties.hint}
            setValue={properties.setHint}
          />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
