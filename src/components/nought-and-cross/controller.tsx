import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";
import { inlineImageStyle } from "@/styles/common.css";
import { restartButtonStyle } from "@/styles/nought-and-cross.css";

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
    <div>
      <button
        type="button"
        onClick={() => {
          properties.onReset();
        }}
        class={restartButtonStyle}
      >
        Restart
      </button>

      <output>{properties.statusMessage}</output>

      <dl>
        <dt>
          player
          <img src={nought.src} alt="nought" class={inlineImageStyle} />
        </dt>
        <dd>
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

        <dt>
          player
          <img src={cross.src} alt="cross" class={inlineImageStyle} />
        </dt>
        <dd>
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
    </div>
  );
};
