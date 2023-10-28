import { Match, type Setter, Switch } from "solid-js";

import { LabeledRadioInput } from "@/components/common/labeled-radio/labeled-radio";
import {
  type NnCStatus,
  NnCStatusDraw,
  NnCStatusNextO,
  NnCStatusNextX,
  NnCStatusNone,
  NnCStatusOWin,
  NnCStatusXWin,
} from "@/games/nought-and-cross/types";
import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";
import { inlineImageStyle } from "@/styles/common.css";
import {
  controllerOutputStyle,
  controllerPlayerStyle,
  controllerStyle,
  restartButtonStyle,
} from "@/styles/nought-and-cross.css";

import type { PlayerType } from "@/scripts/player";

type ControllerProperties = {
  statusMessage: NnCStatus;
  onReset: () => void;

  playerO: PlayerType;
  playerX: PlayerType;
  setPlayerO: Setter<PlayerType>;
  setPlayerX: Setter<PlayerType>;
};
export const Controller = (properties: ControllerProperties) => {
  return (
    <div class={controllerStyle}>
      <output class={controllerOutputStyle}>
        <Switch>
          <Match when={properties.statusMessage === NnCStatusOWin}>
            <img src={nought.src} alt="nought" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === NnCStatusXWin}>
            <img src={cross.src} alt="cross" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === NnCStatusDraw}>Draw!</Match>
          <Match when={properties.statusMessage === NnCStatusNextO}>
            next <img src={nought.src} alt="nought" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === NnCStatusNextX}>
            next <img src={cross.src} alt="cross" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === NnCStatusNone}>{""}</Match>
        </Switch>
      </output>

      <dl class={controllerPlayerStyle}>
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