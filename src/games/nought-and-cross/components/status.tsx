import { StyledSvg } from "@/components/elements/styled-svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { STATUS_DRAW, STATUS_PLAY_BLACK, STATUS_PLAY_WHITE, STATUS_WIN_BLACK, STATUS_WIN_WHITE } from "../constants";
import type { GameStatus } from "../constants";

type StatusButtonProperties = {
  readonly status: GameStatus;
};
export const StatusButton = (properties: StatusButtonProperties): JSXElement => {
  return (
    <div>
      <Switch>
        <Match when={properties.status === STATUS_WIN_WHITE}>
          win <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === STATUS_WIN_BLACK}>
          win <StyledSvg src={cross.src} alt="cross" />
        </Match>
        <Match when={properties.status === STATUS_DRAW}>Draw!</Match>
        <Match when={properties.status === STATUS_PLAY_WHITE}>
          next <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === STATUS_PLAY_BLACK}>
          next <StyledSvg src={cross.src} alt="cross" />
        </Match>
      </Switch>
    </div>
  );
};
