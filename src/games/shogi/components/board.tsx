import { Board } from "@/components/board/board";
import board from "@/images/shogi/board.svg";
import type { JSXElement } from "solid-js";
import { Square } from "./square";
import { BLACK, WHITE } from "../constants";
import type { Hand } from "../constants";
import { handHeaderCellStyle } from "../style.css";
import { Hands } from "./hands";

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
        {(square, _index, x, y) => <Square x={x()} y={y()} square={square.piece} move={square.moveTarget} />}
      </Board>
      <table>
        <thead>
          <tr>
            <th class={handHeaderCellStyle} />
            <th class={handHeaderCellStyle}>王</th>
            <th class={handHeaderCellStyle}>飛</th>
            <th class={handHeaderCellStyle}>角</th>
            <th class={handHeaderCellStyle}>金</th>
            <th class={handHeaderCellStyle}>銀</th>
            <th class={handHeaderCellStyle}>桂</th>
            <th class={handHeaderCellStyle}>香</th>
            <th class={handHeaderCellStyle}>歩</th>
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
