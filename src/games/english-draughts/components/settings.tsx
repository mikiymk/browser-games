import { SelectRadio } from "@/components/input/select-radio";
import { HeaderPopup } from "@/components/page-header/header-popup";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";

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
        <dt>White player</dt>
        <dd>
          <SelectRadio name="white" values={playerValues} value={properties.white} setValue={properties.setWhite} />
        </dd>

        <dt>Black player</dt>
        <dd>
          <SelectRadio name="black" values={playerValues} value={properties.black} setValue={properties.setBlack} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
