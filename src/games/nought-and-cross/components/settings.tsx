import type { JSXElement, Setter } from "solid-js";

import type { PlayerType } from "../../../common/scripts/player.ts";

import { SettingItem, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { CROSS_ID, NOUGHT_ID } from "../../../common/components/image/id.ts";
import { Radio } from "../../../common/components/input/radio.tsx";
import { UseSvg } from "../../../common/components/use-svg/use-svg.tsx";
import { playerValues } from "../../../common/scripts/player.ts";

type Properties = {
  readonly o: PlayerType;
  readonly setO: Setter<PlayerType>;

  readonly setX: Setter<PlayerType>;
  readonly x: PlayerType;
};
export const NoughtAndCrossSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={<UseSvg alt="nought" id={NOUGHT_ID} />}>
        <Radio name="o" setValue={properties.setO} value={properties.o} values={playerValues} />
      </SettingItem>
      <SettingItem label={<UseSvg alt="cross" id={CROSS_ID} />}>
        <Radio name="x" setValue={properties.setX} value={properties.x} values={playerValues} />
      </SettingItem>
    </Settings>
  );
};
