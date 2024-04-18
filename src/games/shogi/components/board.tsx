import { Board } from "@/components/board/board";
import board from "@/images/shogi/board.svg";
import type { JSXElement } from "solid-js";
import { BLACK, WHITE } from "../constants";
import type { Hand } from "../constants";
import { handHeaderCellStyle, hiddenStyle } from "../style.css";
import { Hands } from "./hands";
import { DefinePiece } from "./piece";
import { Square } from "./square";

type BoardProperties = {
  readonly board: readonly { readonly piece: number; readonly moveTarget: boolean }[];
  readonly hands: readonly [Hand, Hand];
  readonly onSquareClick: (index: number) => void;
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <>
      <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class={hiddenStyle}>
        <title>Define pieces</title>

        <DefinePiece id="王将" pieces={["王", "将"]} />
        <DefinePiece id="玉将" pieces={["玉", "将"]} />
        <DefinePiece id="飛車" pieces={["飛", "車"]} />
        <DefinePiece id="角行" pieces={["角", "行"]} />
        <DefinePiece id="金将" pieces={["金", "将"]} />
        <DefinePiece id="銀将" pieces={["銀", "将"]} />
        <DefinePiece id="桂馬" pieces={["桂", "馬"]} />
        <DefinePiece id="香車" pieces={["香", "車"]} />
        <DefinePiece id="歩兵" pieces={["歩", "兵"]} />
        <DefinePiece id="龍王" pieces={["龍", "王"]} promoted />
        <DefinePiece id="龍馬" pieces={["龍", "馬"]} promoted />
        <DefinePiece id="成銀" pieces={["成", "銀"]} promoted />
        <DefinePiece id="成桂" pieces={["成", "桂"]} promoted />
        <DefinePiece id="成香" pieces={["成", "香"]} promoted />
        <DefinePiece id="と金" pieces={["と", "金"]} promoted />
      </svg>
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
