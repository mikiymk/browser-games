import { Button } from "@/components/button";
import { StyledSvg } from "@/components/styled-svg";
import { StatusDraw, StatusNextO, StatusNextX, StatusWinO, StatusWinX } from "@/games/nought-and-cross/types";
import type { Status } from "@/games/nought-and-cross/types";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly statusMessage: Status;
  readonly onReset: () => void;
};
export const Controller = (properties: ControllerProperties): JSXElement => {
  return (
    <div>
      <output>
        <Switch>
          <Match when={properties.statusMessage === StatusWinO}>
            <StyledSvg src={nought.src} alt="nought" /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusWinX}>
            <StyledSvg src={cross.src} alt="cross" /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusDraw}>Draw!</Match>
          <Match when={properties.statusMessage === StatusNextO}>
            next <StyledSvg src={nought.src} alt="nought" />
          </Match>
          <Match when={properties.statusMessage === StatusNextX}>
            next <StyledSvg src={cross.src} alt="cross" />
          </Match>
        </Switch>
      </output>

      <Button
        onClick={() => {
          properties.onReset();
        }}
      >
        Restart
      </Button>
    </div>
  );
};
