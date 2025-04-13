import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import type { Hand } from "../constants.ts";

import { Board } from "../../../components/board/board.tsx";
import board from "../../../images/shogi/board.svg";
import { BLACK, WHITE } from "../constants.ts";
import { Hands } from "./hands.tsx";
import { Square } from "./square.tsx";
import { handHeader } from "./style.css.ts";

type BoardProperties = {
  readonly board: readonly { readonly moveTarget: boolean; readonly piece: number }[];
  readonly hands: readonly [Hand, Hand];
  readonly onSquareClick: (index: number) => void;
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <>
      <Board
        background={board.src}
        click={(_square, index) => {
          properties.onSquareClick(index);
        }}
        data={properties.board}
        height={9}
        width={9}
      >
        {(square, _index, x, y) => <Square move={square.moveTarget} square={square.piece} x={x} y={y} />}
      </Board>
      <table>
        <thead>
          <tr>
            <For each={["", "王", "飛", "角", "金", "銀", "桂", "香", "歩"]}>
              {(cell) => <th class={handHeader}>{cell}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <Hands color={WHITE} hands={properties.hands[0]} onClick={properties.onSquareClick} />
          <Hands color={BLACK} hands={properties.hands[1]} onClick={properties.onSquareClick} />
        </tbody>
      </table>
    </>
  );
};
