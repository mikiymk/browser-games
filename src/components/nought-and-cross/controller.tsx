import { Switch, type Setter, Match } from "solid-js";

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
import {
  NnCStatusOWin,
  type NnCStatus,
  NnCStatusDraw,
  NnCStatusXWin,
  NnCStatusNextO,
  NnCStatusNextX,
  NnCStatusNone,
} from "@/games/nought-and-cross/types";

import type { PlayerType } from "@/scripts/player";

import { LabeledRadioInput } from "../common/labeled-radio/labeled-radio";

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
