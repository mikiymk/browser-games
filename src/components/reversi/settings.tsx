import { Show } from "solid-js";

import { checkedRadioStyle, radioStyle } from "@/styles/reversi.css";
import { h2Style } from "@/styles/common.css";

import { AiPlayer, HumanPlayer } from "./const";

import type { Setter } from "solid-js";

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
        type="button"
        onClick={() => {
          properties.start();
        }}
      >
        Start
      </button>

      <div>
        Black:
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
      </div>
      <div>
        White:
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
      </div>

      <div>
        <button
          type="button"
          onClick={() => {
            properties.setEnableWatch((previous) => !previous);
          }}
        >
          <Show when={properties.enableWatch} fallback={"not use game-clock"}>
            use game-clock
          </Show>
        </button>
      </div>
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
        [radioStyle]: true,
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
