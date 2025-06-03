import type { JSXElement, Setter } from "solid-js";

import type { PlayerType } from "../../../common/scripts/player.ts";

import { Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Radio } from "../../../common/components/input/radio.tsx";
import { TEXT_FIRST_PLAYER, TEXT_SECOND_PLAYER } from "../../../common/scripts/constants.ts";
import { playerValues } from "../../../common/scripts/player.ts";

type SettingsProperties = {
  readonly black: PlayerType;
  readonly setBlack: Setter<PlayerType>;

  readonly setWhite: Setter<PlayerType>;
  readonly white: PlayerType;
};
export const ShogiSettings = (properties: SettingsProperties): JSXElement => {
  return (
    <Settings>
      <dt>{TEXT_FIRST_PLAYER}</dt>
      <dd>
        <Radio name="first" setValue={properties.setWhite} value={properties.white} values={playerValues} />
      </dd>

      <dt>{TEXT_SECOND_PLAYER}</dt>
      <dd>
        <Radio name="second" setValue={properties.setBlack} value={properties.black} values={playerValues} />
      </dd>
    </Settings>
  );
};
