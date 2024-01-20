import {
  StatusDraw,
  StatusNextO,
  StatusNextX,
  StatusNone,
  StatusWinO,
  StatusWinX,
} from "@/games/nought-and-cross/types";
import type { Status } from "@/games/nought-and-cross/types";
import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { inlineImageStyle } from "@/styles/common.css";
import { controllerOutputStyle, controllerStyle, restartButtonStyle } from "@/styles/nought-and-cross.css";
import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { StyledSvg } from "../common/styled-svg";

type ControllerProperties = {
  readonly statusMessage: Status;
  readonly onReset: () => void;
};
export const Controller = (properties: ControllerProperties): JSXElement => {
  return (
    <div class={controllerStyle}>
      <output class={controllerOutputStyle}>
        <Switch>
          <Match when={properties.statusMessage === StatusWinO}>
            <StyledSvg src={nought.src} alt="nought" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusWinX}>
            <StyledSvg src={cross.src} alt="cross" class={inlineImageStyle} /> Win!
          </Match>
          <Match when={properties.statusMessage === StatusDraw}>Draw!</Match>
          <Match when={properties.statusMessage === StatusNextO}>
            next <StyledSvg src={nought.src} alt="nought" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === StatusNextX}>
            next <StyledSvg src={cross.src} alt="cross" class={inlineImageStyle} />
          </Match>
          <Match when={properties.statusMessage === StatusNone}>{""}</Match>
        </Switch>
      </output>

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
