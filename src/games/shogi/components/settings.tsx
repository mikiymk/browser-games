import { Settings } from "@/components/header-buttons/settings";
import { Radio } from "@/components/input/radio";
import { TEXT_FIRST_PLAYER, TEXT_SECOND_PLAYER } from "@/scripts/constants";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";

type SettingsProperties = {
  readonly white: PlayerType;
  readonly black: PlayerType;

  readonly setWhite: Setter<PlayerType>;
  readonly setBlack: Setter<PlayerType>;
};
export const ShogiSettings = (properties: SettingsProperties): JSXElement => {
  return (
    <Settings>
      <dt>{TEXT_FIRST_PLAYER}</dt>
      <dd>
        <Radio name="first" values={playerValues} value={properties.white} setValue={properties.setWhite} />
      </dd>

      <dt>{TEXT_SECOND_PLAYER}</dt>
      <dd>
        <Radio name="second" values={playerValues} value={properties.black} setValue={properties.setBlack} />
      </dd>
    </Settings>
  );
};
