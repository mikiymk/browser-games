import type { JSXElement, Setter } from "solid-js";
import { Item, Settings } from "../../../components/header-buttons/settings.tsx";
import { Radio } from "../../../components/input/radio.tsx";
import { TEXT_HINT, TEXT_HINT_NONE, TEXT_HINT_NUMBER } from "../../../scripts/constants.ts";

const hintValues = [
  { value: "hide", label: TEXT_HINT_NONE },
  { value: "number", label: TEXT_HINT_NUMBER },
];

type Properties = {
  readonly hint: string;
  readonly setHint: Setter<string>;
};
export const KnightTourSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <Item
        label={TEXT_HINT}
        input={<Radio name="hint" values={hintValues} value={properties.hint} setValue={properties.setHint} />}
      />
    </Settings>
  );
};
