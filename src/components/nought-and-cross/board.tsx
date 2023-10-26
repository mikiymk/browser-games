import { For, Match, Switch } from "solid-js";

import { OMark, XMark } from "@/games/nought-and-cross/types";
import cross from "@/images/symbol/cross.svg";
import nought from "@/images/symbol/nought.svg";
import { boardStyle, cellStyle, oStyle, xStyle } from "@/styles/nought-and-cross.css";

type BoardProperties = {
  board: number[];

  click: (index: number) => void;
};
export const Board = (properties: BoardProperties) => {
  return (
    <>
      <svg viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg" class={boardStyle}>
        <title>noughts and crosses board</title>

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
      </svg>
    </>
  );
};

type CellProperties = {
  mark: number;
  index: number;

  click: () => void;
};
const Cell = (properties: CellProperties) => {
  const x = () => (properties.index % 3) * 30 + 1;
  const y = () => Math.floor(properties.index / 3) * 30 + 1;
  const handleClick = () => {
    properties.click();
  };

  return (
    <>
      <Switch>
        <Match when={properties.mark === OMark}>
          <use href={`${nought.src}#root`} x={x()} y={y()} height={30} width={30} class={xStyle} />
        </Match>
        <Match when={properties.mark === XMark}>
          <use href={`${cross.src}#root`} x={x()} y={y()} height={30} width={30} class={oStyle} />
        </Match>
      </Switch>
      <rect
        x={x()}
        y={y()}
        height={30}
        width={30}
        class={cellStyle}
        tabindex={0}
        onClick={handleClick}
        onKeyPress={handleClick}
      />
    </>
  );
};
