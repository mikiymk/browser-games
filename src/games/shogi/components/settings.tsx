import type { JSXElement, Setter } from "solid-js";
import { SelectRadio } from "@/components/input/select-radio";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { HeaderPopup } from "@/components/page-header/header-popup";

type SettingsProperties = {
  readonly white: PlayerType;
  readonly black: PlayerType;

  readonly setWhite: Setter<PlayerType>;
  readonly setBlack: Setter<PlayerType>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label="Settings">
      <h2>Settings</h2>

      <dl class="grid grid-cols-2">
        <dt>First player</dt>
        <dd>
          <SelectRadio name="first" values={playerValues} value={properties.white} setValue={properties.setWhite} />
        </dd>

        <dt>Second player</dt>
        <dd>
          <SelectRadio name="second" values={playerValues} value={properties.black} setValue={properties.setBlack} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
