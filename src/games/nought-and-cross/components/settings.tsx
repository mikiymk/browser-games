import type { JSXElement, Setter } from "solid-js";

import type { PlayerType } from "../../../scripts/player.ts";

import { StyledSvg } from "../../../components/elements/styled-svg.tsx";
import { SettingItem, Settings } from "../../../components/header-buttons/settings.tsx";
import { Radio } from "../../../components/input/radio.tsx";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import { playerValues } from "../../../scripts/player.ts";

type Properties = {
  readonly o: PlayerType;
  readonly setO: Setter<PlayerType>;

  readonly setX: Setter<PlayerType>;
  readonly x: PlayerType;
};
export const NoughtAndCrossSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={<StyledSvg alt="nought" src={nought.src} />}>
        <Radio name="o" setValue={properties.setO} value={properties.o} values={playerValues} />
      </SettingItem>
      <SettingItem label={<StyledSvg alt="cross" src={cross.src} />}>
        <Radio name="x" setValue={properties.setX} value={properties.x} values={playerValues} />
      </SettingItem>
    </Settings>
  );
};
