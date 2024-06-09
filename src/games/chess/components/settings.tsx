import { HeaderButton } from "@/components/page-header/header-button";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement, Setter } from "solid-js";
import { createSignal } from "solid-js";
import history from "@/images/icon/history.svg";
import { SelectRadio } from "@/components/select-radio/select-radio";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";

type SettingsProperties = {
  readonly white: PlayerType;
  readonly black: PlayerType;

  readonly setWhite: Setter<PlayerType>;
  readonly setBlack: Setter<PlayerType>;
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
      <HeaderButton icon={history.src}>Settings</HeaderButton>

      <PopUp
        open={open()}
        outerClick={() => {
          setOpen(false);
        }}
      >
        <h2>Settings</h2>

        <dl class="grid grid-cols-2">
          <dt>White player</dt>
          <dd>
            <SelectRadio name="white" values={playerValues} value={properties.white} setValue={properties.setWhite} />
          </dd>

          <dt>Black player</dt>
          <dd>
            <SelectRadio name="black" values={playerValues} value={properties.black} setValue={properties.setBlack} />
          </dd>
        </dl>
      </PopUp>
    </button>
  );
};
