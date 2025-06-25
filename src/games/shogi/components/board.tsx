import { For } from "solid-js";

import { Board } from "../../../common/components/game-board/board.tsx";
import { shogiBoard } from "../../../images/image-sources.ts";
import { BLACK, WHITE } from "../constants.ts";
import { Hands } from "./hands.tsx";
import { Square } from "./square.tsx";
import { handHeader } from "./style.css.ts";

import type { JSXElement } from "solid-js";

import type { Hand } from "../constants.ts";

type BoardProperties = {
  readonly board: readonly { readonly moveTarget: boolean; readonly piece: number }[];
  readonly handleSquareClick: (index: number) => void;
  readonly hands: readonly [Hand, Hand];
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <>
      <Board
        backgroundImage={shogiBoard}
        data={properties.board}
        height={9}
        onClick={(_square, index) => {
          properties.handleSquareClick(index);
        }}
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
          <Hands color={WHITE} hands={properties.hands[0]} onClick={properties.handleSquareClick} />
          <Hands color={BLACK} hands={properties.hands[1]} onClick={properties.handleSquareClick} />
        </tbody>
      </table>
    </>
  );
};
