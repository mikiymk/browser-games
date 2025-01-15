import { StyledSvg } from "@/components/styled-svg";
import { StatusDraw, StatusNextO, StatusNextX, StatusWinO, StatusWinX } from "@/games/nought-and-cross/types";
import type { Status } from "@/games/nought-and-cross/types";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";

type StatusButtonProperties = {
  readonly status: Status;
};
export const StatusButton = (properties: StatusButtonProperties): JSXElement => {
  return (
    <div>
      <Switch>
        <Match when={properties.status === StatusWinO}>
          win <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === StatusWinX}>
          win <StyledSvg src={cross.src} alt="cross" />
        </Match>
        <Match when={properties.status === StatusDraw}>Draw!</Match>
        <Match when={properties.status === StatusNextO}>
          next <StyledSvg src={nought.src} alt="nought" />
        </Match>
        <Match when={properties.status === StatusNextX}>
          next <StyledSvg src={cross.src} alt="cross" />
        </Match>
      </Switch>
    </div>
  );
};
