import { Match, type Setter, Switch } from "solid-js";

import { LabeledRadioInput } from "@/components/common/labeled-radio/labeled-radio";
import {
  type Status,
  StatusDraw,
  StatusNextO,
  StatusNextX,
  StatusNone,
  StatusWinO,
  StatusWinX,
} from "@/games/nought-and-cross/types";
import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import { inlineImageStyle } from "@/styles/common.css";
import {
  controllerOutputStyle,
  controllerPlayerStyle,
  controllerStyle,
  restartButtonStyle,
} from "@/styles/nought-and-cross.css";

import type { PlayerType } from "@/scripts/player";

type ControllerProperties = {
  statusMessage: Status;
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
          <Match when={properties.statusMessage === StatusWinO}>
            <img src={nought.src} alt="nought" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusWinX}>
            <img src={cross.src} alt="cross" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusDraw}>Draw!</Match>
          <Match when={properties.statusMessage === StatusNextO}>
            next <img src={nought.src} alt="nought" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === StatusNextX}>
            next <img src={cross.src} alt="cross" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === StatusNone}>{""}</Match>
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
              properties.setPlayerO(PlayerTypeAi);
            }}
            checked={properties.playerO === PlayerTypeAi}
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
              properties.setPlayerX(PlayerTypeAi);
            }}
            checked={properties.playerX === PlayerTypeAi}
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
