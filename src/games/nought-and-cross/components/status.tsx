import type { JSXElement } from "solid-js";

import { Match, Switch } from "solid-js";

import type { GameStatus } from "../constants.ts";

import { StyledSvg } from "../../../components/elements/styled-svg.tsx";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import {
  STATUS_DRAW,
  STATUS_PLAY_CROSS,
  STATUS_PLAY_NOUGHT,
  STATUS_WIN_CROSS,
  STATUS_WIN_NOUGHT,
} from "../constants.ts";

type StatusButtonProperties = {
  readonly status: GameStatus;
};
export const StatusButton = (properties: StatusButtonProperties): JSXElement => {
  return (
    <div>
      <Switch>
        <Match when={properties.status === STATUS_WIN_NOUGHT}>
          win <StyledSvg alt="nought" src={nought.src} />
        </Match>
        <Match when={properties.status === STATUS_WIN_CROSS}>
          win <StyledSvg alt="cross" src={cross.src} />
        </Match>
        <Match when={properties.status === STATUS_DRAW}>Draw!</Match>
        <Match when={properties.status === STATUS_PLAY_NOUGHT}>
          next <StyledSvg alt="nought" src={nought.src} />
        </Match>
        <Match when={properties.status === STATUS_PLAY_CROSS}>
          next <StyledSvg alt="cross" src={cross.src} />
        </Match>
      </Switch>
    </div>
  );
};
