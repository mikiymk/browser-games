import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { Board } from "../../../components/board/board.tsx";
import board from "../../../images/shogi/board.svg";
import { classes } from "../../../scripts/classes.ts";
import { BLACK, WHITE } from "../constants.ts";
import type { Hand } from "../constants.ts";
import { Hands } from "./hands.tsx";
import { Square } from "./square.tsx";
import Styles from "./style.module.css";

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
              {(cell) => <th class={classes(Styles.hand, Styles["hand-header"])}>{cell}</th>}
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
