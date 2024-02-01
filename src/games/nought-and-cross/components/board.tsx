import { Board } from "@/components/board/board";
import { oStyle, xStyle } from "@/games/nought-and-cross/style.css";
import { MarkO, MarkX } from "@/games/nought-and-cross/types";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import board from "@/images/nought-and-cross/board.svg";
import type { JSXElement } from "solid-js";
import { Match, Switch } from "solid-js";

type CellProperties = {
  readonly mark: number;
  readonly x: number;
  readonly y: number;
};
const Cell = (properties: CellProperties): JSXElement => {
  return (
    <>
      <Switch>
        <Match when={properties.mark === MarkO}>
          <use href={`${nought.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={xStyle} />
        </Match>
        <Match when={properties.mark === MarkX}>
          <use href={`${cross.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={oStyle} />
        </Match>
      </Switch>
    </>
  );
};

type BoardProperties = {
  readonly board: readonly number[];

  readonly click: (index: number) => void;
};
export const NncBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      height={3}
      width={3}
      data={properties.board}
      background={board.src}
      click={(_, index) => {
        properties.click(index);
      }}
    >
      {(mark, _, x, y) => <Cell mark={mark} x={x()} y={y()} />}
    </Board>
  );
};
