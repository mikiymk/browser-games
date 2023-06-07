import { For, Switch, Match } from "solid-js";
import { BoardData, Mark, Empty, OMark, XMark, Index } from "./types";
import { GameAiPromise } from "./ai";

interface BoardProperties {
  board: BoardData;
}
export const Board = (properties: BoardProperties) => {
  return (
    <div class="board">
      <For each={properties.board}>{(mark, index) => <Cell mark={mark} index={index() as Index} />}</For>
    </div>
  );
};

interface CellProperties {
  mark: Mark | Empty;
  index: Index;
}
const Cell = (properties: CellProperties) => {
  const onClick = () => {
    console.log(properties.index)
    GameAiPromise.resolve(properties.index);
  };
  return (
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
      <circle cx="100" cy="100" r="70" class="char-o" />
    </svg>
  );
};

const XMarkSVG = () => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="char">
      <path d="M30,30 170,170 M30,170 170,30" class="char-x" />
    </svg>
  );
};
