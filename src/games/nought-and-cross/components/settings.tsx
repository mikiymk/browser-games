import { StyledSvg } from "@/components/elements/styled-svg";
import { Item, Settings } from "@/components/header-buttons/settings";
import { Radio } from "@/components/input/radio";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";

type Properties = {
  readonly o: PlayerType;
  readonly x: PlayerType;

  readonly setO: Setter<PlayerType>;
  readonly setX: Setter<PlayerType>;
};
export const NoughtAndCrossSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <Item
        label={<StyledSvg src={nought.src} alt="nought" />}
        input={<Radio name="o" values={playerValues} value={properties.o} setValue={properties.setO} />}
      />
      <Item
        label={<StyledSvg src={cross.src} alt="cross" />}
        input={<Radio name="x" values={playerValues} value={properties.x} setValue={properties.setX} />}
      />
    </Settings>
  );
};
