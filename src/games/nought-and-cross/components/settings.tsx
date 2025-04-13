import type { JSXElement, Setter } from "solid-js";
import { StyledSvg } from "../../../components/elements/styled-svg.tsx";
import { SettingItem, Settings } from "../../../components/header-buttons/settings.tsx";
import { Radio } from "../../../components/input/radio.tsx";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import { playerValues } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";

type Properties = {
  readonly o: PlayerType;
  readonly x: PlayerType;

  readonly setO: Setter<PlayerType>;
  readonly setX: Setter<PlayerType>;
};
export const NoughtAndCrossSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={<StyledSvg src={nought.src} alt="nought" />}>
        <Radio name="o" values={playerValues} value={properties.o} setValue={properties.setO} />
      </SettingItem>
      <SettingItem label={<StyledSvg src={cross.src} alt="cross" />}>
        <Radio name="x" values={playerValues} value={properties.x} setValue={properties.setX} />
      </SettingItem>
    </Settings>
  );
};
