import { SettingItem, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Radio } from "../../../common/components/input/radio.tsx";
import { TEXT_HINT, TEXT_HINT_NONE, TEXT_HINT_NUMBER } from "../../../common/scripts/constants.ts";

import type { JSXElement, Setter } from "solid-js";

const hintValues = [
  { label: TEXT_HINT_NONE, value: "hide" },
  { label: TEXT_HINT_NUMBER, value: "number" },
];

type Properties = {
  readonly hint: string;
  readonly setHint: Setter<string>;
};
export const KnightTourSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={TEXT_HINT}>
        <Radio name="hint" setValue={properties.setHint} value={properties.hint} values={hintValues} />
      </SettingItem>
    </Settings>
  );
};
