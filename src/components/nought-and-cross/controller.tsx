import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";
import { inlineImageStyle } from "@/styles/common.css";
import {
  controllerOutputStyle,
  controllerPlayerNameStyle,
  controllerPlayerSelectRadioStyle,
  controllerPlayerStyle,
  controllerStyle,
  restartButtonStyle,
} from "@/styles/nought-and-cross.css";

import type { PlayerType } from "@/scripts/player";
import type { Setter } from "solid-js";

import { LabeledRadioInput } from "../common/labeled-radio/labeled-radio";

type ControllerProperties = {
  statusMessage: string;
  onReset: () => void;

  playerO: PlayerType;
  playerX: PlayerType;
  setPlayerO: Setter<PlayerType>;
  setPlayerX: Setter<PlayerType>;
};
export const Controller = (properties: ControllerProperties) => {
  return (
    <div class={controllerStyle}>
      <output class={controllerOutputStyle}>{properties.statusMessage}</output>

      <dl class={controllerPlayerStyle}>
        <dt class={controllerPlayerNameStyle}>
          player
          <img src={nought.src} alt="nought" class={inlineImageStyle} />
        </dt>
        <dd class={controllerPlayerSelectRadioStyle}>
          <LabeledRadioInput
            label="Player"
            check={() => {
              properties.setPlayerO(PlayerTypeHuman);
            }}
            checked={properties.playerO === PlayerTypeHuman}
          />
          <LabeledRadioInput
            label="AI"
            check={() => {
              properties.setPlayerO(PlayerTypeAI);
            }}
            checked={properties.playerO === PlayerTypeAI}
          />
        </dd>

        <dt class={controllerPlayerNameStyle}>
          player
          <img src={cross.src} alt="cross" class={inlineImageStyle} />
        </dt>
        <dd class={controllerPlayerSelectRadioStyle}>
          <LabeledRadioInput
            label="Player"
            check={() => {
              properties.setPlayerX(PlayerTypeHuman);
            }}
            checked={properties.playerX === PlayerTypeHuman}
          />
          <LabeledRadioInput
            label="AI"
            check={() => {
              properties.setPlayerX(PlayerTypeAI);
            }}
            checked={properties.playerX === PlayerTypeAI}
          />
        </dd>
      </dl>

      <button
        type="button"
        onClick={() => {
          properties.onReset();
        }}
        class={restartButtonStyle}
      >
        Restart
      </button>
    </div>
  );
};
