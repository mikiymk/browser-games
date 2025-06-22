import { Match, Switch } from "solid-js";

import { CROSS_ID, NOUGHT_ID } from "../../../common/components/image/id.ts";
import { UseSvg } from "../../../common/components/use-svg/use-svg.tsx";
import {
  STATUS_DRAW,
  STATUS_PLAY_CROSS,
  STATUS_PLAY_NOUGHT,
  STATUS_WIN_CROSS,
  STATUS_WIN_NOUGHT,
} from "../constants.ts";

import type { JSXElement } from "solid-js";

import type { GameStatus } from "../constants.ts";

type StatusButtonProperties = {
  readonly status: GameStatus;
};
export const StatusButton = (properties: StatusButtonProperties): JSXElement => {
  return (
    <div>
      <Switch>
        <Match when={properties.status === STATUS_WIN_NOUGHT}>
          win <UseSvg alt="nought" id={NOUGHT_ID} />
        </Match>
        <Match when={properties.status === STATUS_WIN_CROSS}>
          win <UseSvg alt="cross" id={CROSS_ID} />
        </Match>
        <Match when={properties.status === STATUS_DRAW}>Draw!</Match>
        <Match when={properties.status === STATUS_PLAY_NOUGHT}>
          next <UseSvg alt="nought" id={NOUGHT_ID} />
        </Match>
        <Match when={properties.status === STATUS_PLAY_CROSS}>
          next <UseSvg alt="cross" id={CROSS_ID} />
        </Match>
      </Switch>
    </div>
  );
};
