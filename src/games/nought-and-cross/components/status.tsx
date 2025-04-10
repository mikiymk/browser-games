import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
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
import type { GameStatus } from "../constants.ts";

type StatusButtonProperties = {
  readonly status: GameStatus;
};
export const StatusButton = (properties: StatusButtonProperties): JSXElement => {
  return (
    <div>
      <Switch>
        <Match when={properties.status === STATUS_WIN_NOUGHT}>
          win <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === STATUS_WIN_CROSS}>
          win <StyledSvg src={cross.src} alt="cross" />
        </Match>
        <Match when={properties.status === STATUS_DRAW}>Draw!</Match>
        <Match when={properties.status === STATUS_PLAY_NOUGHT}>
          next <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === STATUS_PLAY_CROSS}>
          next <StyledSvg src={cross.src} alt="cross" />
        </Match>
      </Switch>
    </div>
  );
};
