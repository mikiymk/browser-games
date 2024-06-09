import type { JSXElement, Setter } from "solid-js";
import { SelectRadio } from "@/components/input/select-radio";
import { HeaderPopup } from "@/components/page-header/header-popup";

type SettingsProperties = {
  readonly hint: string;
  readonly setHint: Setter<string>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label="Settings">
      <h2>Settings</h2>

      <dl class="grid grid-cols-2">
        <dt>Square View</dt>
        <dd>
          <SelectRadio
            name="o"
            values={[
              { value: "hide", label: "Hide" },
              { value: "number", label: "Number" },
            ]}
            value={properties.hint}
            setValue={properties.setHint}
          />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
