import type { JSXElement } from "solid-js";

import { Match, Switch } from "solid-js";

import { Board } from "../../../components/board/board.tsx";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import board from "../../../images/nought-and-cross/board.svg";
import { CROSS, NOUGHT } from "../constants.ts";
import { crossStyle, noughtStyle } from "./style.css.ts";

type CellProperties = {
  readonly mark: number;
  readonly x: number;
  readonly y: number;
};
const Cell = (properties: CellProperties): JSXElement => {
  return (
    <Switch>
      <Match when={properties.mark === NOUGHT}>
        <use class={noughtStyle} height={10} href={`${nought.src}#root`} width={10} x={properties.x} y={properties.y} />
      </Match>
      <Match when={properties.mark === CROSS}>
        <use class={crossStyle} height={10} href={`${cross.src}#root`} width={10} x={properties.x} y={properties.y} />
      </Match>
    </Switch>
  );
};

type BoardProperties = {
  readonly board: readonly number[];

  readonly click: (index: number) => void;
};
export const NncBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      background={board.src}
      click={(_, index) => {
        properties.click(index);
      }}
      data={properties.board}
      height={3}
      width={3}
    >
      {(mark, _, x, y) => <Cell mark={mark} x={x} y={y} />}
    </Board>
  );
};
