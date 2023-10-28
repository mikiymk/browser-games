import { type Setter, Show } from "solid-js";

import checkedBox from "@/images/symbol/check-box-checked-black.svg";
import uncheckedBox from "@/images/symbol/check-box-unchecked-black.svg";
import { h2Style } from "@/styles/common.css";
import { disableStyle, settingCheckBoxStyle, settingItemStyle } from "@/styles/reversi.css";

import { AiPlayer, HumanPlayer } from "./const";

import { LabeledRadioInput } from "../common/labeled-radio/labeled-radio";

type SettingsProperties = {
  playing: boolean;

  black: number;
  setBlack: Setter<number>;
  white: number;
  setWhite: Setter<number>;

  enableWatch: boolean;
  setEnableWatch: Setter<boolean>;
};

export const Settings = (properties: SettingsProperties) => {
  return (
    <div>
      <h2 class={h2Style}>Settings</h2>

      <dl>
        <dt>Black Player</dt>
        <dd class={settingItemStyle}>
          <LabeledRadioInput
            label="Player"
            checked={properties.black === HumanPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setBlack(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.black === AiPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setBlack(AiPlayer);
            }}
          />
        </dd>

        <dt>White Player</dt>
        <dd class={settingItemStyle}>
          <LabeledRadioInput
            label="Player"
            checked={properties.white === HumanPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setWhite(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.white === AiPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setWhite(AiPlayer);
            }}
          />
        </dd>

        <dt>Game Clock</dt>
        <dd class={settingItemStyle}>
          <label class={properties.playing ? disableStyle : ""}>
            <input
              type="checkbox"
              disabled={properties.playing}
              onClick={() => {
                properties.setEnableWatch((previous) => !previous);
              }}
            />
            <Show
              when={properties.enableWatch}
              fallback={<img class={settingCheckBoxStyle} src={uncheckedBox.src} alt="disable" />}
            >
              <img class={settingCheckBoxStyle} src={checkedBox.src} alt="enable" />
            </Show>
            use game clock
          </label>
        </dd>
      </dl>
    </div>
  );
};