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
        <use href={`${nought.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={noughtStyle} />
      </Match>
      <Match when={properties.mark === CROSS}>
        <use href={`${cross.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={crossStyle} />
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
      height={3}
      width={3}
      data={properties.board}
      background={board.src}
      click={(_, index) => {
        properties.click(index);
      }}
    >
      {(mark, _, x, y) => <Cell mark={mark} x={x} y={y} />}
    </Board>
  );
};
