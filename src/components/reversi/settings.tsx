import { checkedRadioStyle, radioStyle } from "@/styles/reversi.css";
import { h2Style } from "@/styles/common.css";

import { AiPlayer, HumanPlayer } from "./const";

type SettingsProperties = {
  start: () => void;

  black: number;
  setBlack: (n: number) => void;
  white: number;
  setWhite: (n: number) => void;
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
