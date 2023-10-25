import { Show, type Setter } from "solid-js";

import {
  checkedRadioStyle,
  radioStyle,
  settingCheckBoxStyle,
  settingItemStyle,
  settingStartStyle,
} from "@/styles/reversi.css";
import { h2Style } from "@/styles/common.css";
import checkedBox from "@/images/symbol/check-box-checked-black.svg";
import uncheckedBox from "@/images/symbol/check-box-unchecked-black.svg";

import { AiPlayer, HumanPlayer } from "./const";

type SettingsProperties = {
  start: () => void;

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

      <button
        class={settingStartStyle}
        type="button"
        onClick={() => {
          properties.start();
        }}
      >
        Start Game
      </button>

      <dl>
        <dt>Black Player</dt>
        <dd class={settingItemStyle}>
          <LabeledRadioInput
            label="Player"
            checked={properties.black === HumanPlayer}
            check={() => {
              properties.setBlack(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.black === AiPlayer}
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
            check={() => {
              properties.setWhite(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.white === AiPlayer}
            check={() => {
              properties.setWhite(AiPlayer);
            }}
          />
        </dd>

        <dt>Game Clock</dt>
        <dd class={settingItemStyle}>
          <label>
            <input
              type="checkbox"
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

type LabeledRadioInputProperties = {
  label: string;
  checked: boolean;
  check: () => void;
};
const LabeledRadioInput = (properties: LabeledRadioInputProperties) => {
  return (
    <label
      classList={{
        [radioStyle]: !properties.checked,
        [checkedRadioStyle]: properties.checked,
      }}
    >
      {properties.label}
      <input
        type="radio"
        checked={properties.checked}
        onClick={() => {
          properties.check();
        }}
      />
    </label>
  );
};
