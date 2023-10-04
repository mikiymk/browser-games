import { For, Match, Switch } from "solid-js";

import { GameAiPromise } from "@/games/ox3/ai";
import { OMark, XMark } from "@/games/ox3/types";

import type { BoardData, Empty, Index, Mark } from "@/games/ox3/types";

type BoardProperties = {
  board: BoardData;
};
export const Board = (properties: BoardProperties) => {
  return (
    <div class="board">
      <For each={properties.board}>{(mark, index) => <Cell mark={mark} index={index() as Index} />}</For>
    </div>
  );
};

type CellProperties = {
  mark: Mark | Empty;
  index: Index;
};
const Cell = (properties: CellProperties) => {
  const onClick = () => {
    console.log(properties.index);
    GameAiPromise.resolve(properties.index);
  };
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: fix it later
    <div class="cell" onClick={onClick}>
      <Switch fallback="">
        <Match when={properties.mark === OMark}>
          <OMarkSVG />
        </Match>
        <Match when={properties.mark === XMark}>
          <XMarkSVG />
        </Match>
      </Switch>
    </div>
  );
};

const OMarkSVG = () => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="char">
      <title>○</title>
      <circle cx="100" cy="100" r="70" class="char-o" />
    </svg>
  );
};

const XMarkSVG = () => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="char">
      <title>❌</title>
      <path d="M30,30 170,170 M30,170 170,30" class="char-x" />
    </svg>
  );
};
