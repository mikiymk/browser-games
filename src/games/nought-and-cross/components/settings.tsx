import { Radio } from "@/components/input/radio";
import { HeaderPopup } from "@/components/page-header/header-popup";
import { StyledSvg } from "@/components/styled-svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { TEXT_SETTINGS } from "@/scripts/constants";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";

type SettingsProperties = {
  readonly o: PlayerType;
  readonly x: PlayerType;

  readonly setO: Setter<PlayerType>;
  readonly setX: Setter<PlayerType>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">
        <dt>
          <StyledSvg src={nought.src} alt="nought" />
        </dt>
        <dd>
          <Radio name="o" values={playerValues} value={properties.o} setValue={properties.setO} />
        </dd>

        <dt>
          <StyledSvg src={cross.src} alt="cross" />
        </dt>
        <dd>
          <Radio name="x" values={playerValues} value={properties.x} setValue={properties.setX} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
