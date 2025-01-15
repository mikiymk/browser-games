import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_BLACK_PLAYER, TEXT_SETTINGS, TEXT_WHITE_PLAYER } from "@/scripts/constants";
import { playerValues } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";
import { Radio } from "../input/radio";

type SettingsProperties = {
  readonly children: JSXElement;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">{properties.children}</dl>
    </HeaderPopup>
  );
};

type ItemProperties = {
  readonly label: JSXElement;
  readonly input: JSXElement;
};
export const Item = (properties: ItemProperties): JSXElement => {
  return (
    <>
      <dt>{properties.label}</dt>
      <dd>{properties.input}</dd>
    </>
  );
};

type PlayerSettingProperties = {
  readonly white: PlayerType;
  readonly black: PlayerType;

  readonly setWhite: Setter<PlayerType>;
  readonly setBlack: Setter<PlayerType>;
};
export const PlayerSetting = (properties: PlayerSettingProperties): JSXElement => {
  return (
    <>
      <Item
        label={TEXT_WHITE_PLAYER}
        input={<Radio name="white" values={playerValues} value={properties.white} setValue={properties.setWhite} />}
      />
      <Item
        label={TEXT_BLACK_PLAYER}
        input={<Radio name="black" values={playerValues} value={properties.black} setValue={properties.setBlack} />}
      />
    </>
  );
};
