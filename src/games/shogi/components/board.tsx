import { Board } from "@/components/board/board";
import board from "@/images/shogi/board.svg";
import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { BLACK, WHITE } from "../constants";
import type { Hand } from "../constants";
import { Hands } from "./hands";
import { Square } from "./square";

type BoardProperties = {
  readonly board: readonly { readonly piece: number; readonly moveTarget: boolean }[];
  readonly hands: readonly [Hand, Hand];
  readonly onSquareClick: (index: number) => void;
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <>
      <Board
        height={9}
        width={9}
        data={properties.board}
        background={board.src}
        click={(_square, index) => {
          properties.onSquareClick(index);
        }}
      >
        {(square, _index, x, y) => <Square x={x} y={y} square={square.piece} move={square.moveTarget} />}
      </Board>
      <table>
        <thead>
          <tr>
            <For each={["", "王", "飛", "角", "金", "銀", "桂", "香", "歩"]}>
              {(cell) => <th class="px-1 bg-amber-400 text-center border border-slate-900 border-solid">{cell}</th>}
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
