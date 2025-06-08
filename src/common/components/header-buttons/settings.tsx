import type { JSXElement, Setter } from "solid-js";

import { Close } from "@corvu/dialog";

import type { PlayerType } from "../../scripts/player.ts";

import { TEXT_BLACK_PLAYER, TEXT_SETTINGS, TEXT_WHITE_PLAYER } from "../../scripts/constants.ts";
import { playerValues } from "../../scripts/player.ts";
import { Radio } from "../input/radio.tsx";
import { HeaderPopup } from "../page-frame/header-popup.tsx";
import { setting } from "./style.css.ts";

type SettingsProperties = {
  readonly children: JSXElement;
};

/**
 * 設定を表示する
 */
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
  /** 設定項目の内容 */
  readonly children: JSXElement;
  /** 設定項目のラベル */
  readonly label: JSXElement;
};

/**
 *  設定項目
 */
export const SettingItem = (properties: ItemProperties): JSXElement => {
  return (
    <>
      <dt>{properties.label}</dt>
      <dd>{properties.children}</dd>
    </>
  );
};

type PlayerSettingProperties = {
  /** 現在の黒のプレイヤーの種類 */
  readonly black: PlayerType;
  /** 黒のプレイヤーを設定する */
  readonly setBlack: Setter<PlayerType>;
  /** 白のプレイヤーを設定する */
  readonly setWhite: Setter<PlayerType>;
  /** 現在の白のプレイヤーの種類 */
  readonly white: PlayerType;
};

/**
 * プレイヤーの設定
 */
export const PlayerSetting = (properties: PlayerSettingProperties): JSXElement => {
  return (
    <>
      <SettingItem label={TEXT_WHITE_PLAYER}>
        <Radio name="white" setValue={properties.setWhite} value={properties.white} values={playerValues} />
      </SettingItem>
      <SettingItem label={TEXT_BLACK_PLAYER}>
        <Radio name="black" setValue={properties.setBlack} value={properties.black} values={playerValues} />
      </SettingItem>
    </>
  );
};
