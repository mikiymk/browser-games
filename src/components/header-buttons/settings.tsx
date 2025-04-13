import { Close } from "@corvu/dialog";
import type { JSXElement, Setter } from "solid-js";
import { TEXT_BLACK_PLAYER, TEXT_SETTINGS, TEXT_WHITE_PLAYER } from "../../scripts/constants.ts";
import { playerValues } from "../../scripts/player.ts";
import type { PlayerType } from "../../scripts/player.ts";
import { Radio } from "../input/radio.tsx";
import { HeaderPopup } from "../page/header-popup.tsx";
import { setting } from "./style.css.ts";

type SettingsProperties = {
  readonly children: JSXElement;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class={setting}>{properties.children}</dl>

      <Close>Submit</Close>
      <Close>Cancel</Close>
    </HeaderPopup>
  );
};

type ItemProperties = {
  readonly label: JSXElement;
  readonly children: JSXElement;
};
export const SettingItem = (properties: ItemProperties): JSXElement => {
  return (
    <>
      <dt>{properties.label}</dt>
      <dd>{properties.children}</dd>
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
      <SettingItem label={TEXT_WHITE_PLAYER}>
        <Radio name="white" values={playerValues} value={properties.white} setValue={properties.setWhite} />
      </SettingItem>
      <SettingItem label={TEXT_BLACK_PLAYER}>
        <Radio name="black" values={playerValues} value={properties.black} setValue={properties.setBlack} />
      </SettingItem>
    </>
  );
};
