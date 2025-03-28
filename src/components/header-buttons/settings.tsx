import type { JSXElement, Setter } from "solid-js";
import { HeaderPopup } from "../page/header-popup.tsx";
import { TEXT_BLACK_PLAYER, TEXT_SETTINGS, TEXT_WHITE_PLAYER } from "../../scripts/constants.ts";
import { playerValues } from "../../scripts/player.ts";
import type { PlayerType } from "../../scripts/player.ts";
import { Radio } from "../input/radio.tsx";
import Styles from "./style.module.css";

type SettingsProperties = {
  readonly children: JSXElement;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class={Styles.settings}>{properties.children}</dl>
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
