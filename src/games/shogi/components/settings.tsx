import { Radio } from "@/components/input/radio";
import { HeaderPopup } from "@/components/page/header-popup";
import { TEXT_FIRST_PLAYER, TEXT_SECOND_PLAYER, TEXT_SETTINGS } from "@/scripts/constants";
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
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">
        <dt>{TEXT_FIRST_PLAYER}</dt>
        <dd>
          <Radio name="first" values={playerValues} value={properties.white} setValue={properties.setWhite} />
        </dd>

        <dt>{TEXT_SECOND_PLAYER}</dt>
        <dd>
          <Radio name="second" values={playerValues} value={properties.black} setValue={properties.setBlack} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
