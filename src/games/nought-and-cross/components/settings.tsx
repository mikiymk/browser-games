import { HeaderButton } from "@/components/page-header/header-button";
import { StyledSvg } from "@/components/styled-svg";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement, Setter } from "solid-js";
import { createSignal } from "solid-js";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { SelectRadio } from "@/components/input/select-radio";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";

type SettingsProperties = {
  readonly o: PlayerType;
  readonly x: PlayerType;

  readonly setO: Setter<PlayerType>;
  readonly setX: Setter<PlayerType>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  const [open, setOpen] = createSignal(false);

  return (
    <button
      type="button"
      onClick={() => {
        setOpen(true);
      }}
    >
      <HeaderButton icon="settings">Settings</HeaderButton>

      <PopUp
        open={open()}
        outerClick={() => {
          setOpen(false);
        }}
      >
        <h2>Settings</h2>

        <dl class="grid grid-cols-2">
          <dt>
            <StyledSvg src={nought.src} alt="nought" /> player
          </dt>
          <dd>
            <SelectRadio name="o" values={playerValues} value={properties.o} setValue={properties.setO} />
          </dd>

          <dt>
            <StyledSvg src={cross.src} alt="cross" /> player
          </dt>
          <dd>
            <SelectRadio name="x" values={playerValues} value={properties.x} setValue={properties.setX} />
          </dd>
        </dl>
      </PopUp>
    </button>
  );
};
