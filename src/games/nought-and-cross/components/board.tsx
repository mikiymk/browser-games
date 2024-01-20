import { boardStyle, cellStyle, oStyle, xStyle } from "@/games/nought-and-cross/style.css";
import { MarkO, MarkX } from "@/games/nought-and-cross/types";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import type { JSXElement } from "solid-js";
import { For, Match, Switch } from "solid-js";

type CellProperties = {
  readonly mark: number;
  readonly index: number;

  readonly click: () => void;
};
const Cell = (properties: CellProperties): JSXElement => {
  const x = (): number => (properties.index % 3) * 30 + 1;
  const y = (): number => Math.floor(properties.index / 3) * 30 + 1;
  const handleClick = (): void => {
    properties.click();
  };

  return (
    <>
      <Switch>
        <Match when={properties.mark === MarkO}>
          <use href={`${nought.src}#root`} x={x()} y={y()} height={30} width={30} class={xStyle} />
        </Match>
        <Match when={properties.mark === MarkX}>
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

type BoardProperties = {
  readonly board: readonly number[];

  readonly click: (index: number) => void;
};
export const Board = (properties: BoardProperties): JSXElement => {
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
