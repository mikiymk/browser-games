import { Radio } from "@/components/input/radio";
import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_BLACK_PLAYER, TEXT_SETTINGS, TEXT_WHITE_PLAYER } from "@/scripts/constants";
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
        <dt>{TEXT_WHITE_PLAYER}</dt>
        <dd>
          <Radio name="white" values={playerValues} value={properties.white} setValue={properties.setWhite} />
        </dd>

        <dt>{TEXT_BLACK_PLAYER}</dt>
        <dd>
          <Radio name="black" values={playerValues} value={properties.black} setValue={properties.setBlack} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
