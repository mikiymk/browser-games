import { For, Match, Switch } from "solid-js";

import { OMark, XMark } from "@/games/nought-and-cross/types";
import { boardStyle, cellStyle, charOStyle, charXStyle } from "@/styles/nought-and-cross.css";

type BoardProperties = {
  board: number[];

  click: (index: number) => void;
};
export const Board = (properties: BoardProperties) => {
  return (
    <div class={boardStyle}>
      <For each={properties.board}>
        {(mark, index) => (
          <Cell
            mark={mark}
            index={index()}
            click={() => {
              properties.click(index());
            }}
          />
        )}
      </For>
    </div>
  );
};

type CellProperties = {
  mark: number;
  index: number;

  click: () => void;
};
const Cell = (properties: CellProperties) => {
  const onClick = () => {
    properties.click();
  };
  return (
    <button type="button" class={cellStyle} onClick={onClick}>
      <Switch fallback="">
        <Match when={properties.mark === OMark}>
          <OMarkSVG />
        </Match>
        <Match when={properties.mark === XMark}>
          <XMarkSVG />
        </Match>
      </Switch>
    </button>
  );
};

const OMarkSVG = () => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class={charOStyle}>
      <title>○</title>
      <circle cx="100" cy="100" r="70" />
    </svg>
  );
};

const XMarkSVG = () => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class={charXStyle}>
      <title>❌</title>
      <path d="M30,30 170,170 M30,170 170,30" />
    </svg>
  );
};
