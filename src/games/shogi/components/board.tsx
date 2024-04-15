import { Board } from "@/components/board/board";
import board from "@/images/shogi/board.svg";
import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { Square } from "./square";
import type { Hand } from "../constants";
import { handCellStyle, handHeaderCellStyle } from "../style.css";

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
          <tr>
            <th class={handCellStyle}>☗</th>
            <For each={properties.hands[0]}>
              {(piece, index) => (
                <td
                  class={handCellStyle}
                  onClick={() => {
                    properties.onSquareClick(index() + 100);
                  }}
                  onKeyPress={() => {
                    properties.onSquareClick(index() + 100);
                  }}
                >
                  {piece}
                </td>
              )}
            </For>
          </tr>

          <tr>
            <th class={handCellStyle}>☖</th>
            <For each={properties.hands[1]}>
              {(piece, index) => (
                <td
                  class={handCellStyle}
                  onClick={() => {
                    properties.onSquareClick(index() + 100);
                  }}
                  onKeyPress={() => {
                    properties.onSquareClick(index() + 100);
                  }}
                >
                  {piece}
                </td>
              )}
            </For>
          </tr>
        </tbody>
      </table>
    </>
  );
};
