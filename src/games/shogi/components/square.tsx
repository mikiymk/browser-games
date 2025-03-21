import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { BISHOP, COLOR, GOLD, KING, KNIGHT, LANCE, PAWN, PIECE, PROMOTED, ROOK, SILVER } from "../constants.ts";
import { UsePiece } from "./define.tsx";
import Styles from "./style.module.css";

type SquareProperties = {
  readonly x: number;
  readonly y: number;

  readonly square: number;
  readonly move: boolean;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const source = (): string | undefined => {
    if (!properties.square) {
      return;
    }

    switch (properties.square & (PIECE | PROMOTED)) {
      case KING:
        return properties.square & COLOR ? "玉将" : "王将";
      case ROOK:
        return "飛車";
      case BISHOP:
        return "角行";
      case GOLD:
        return "金将";
      case SILVER:
        return "銀将";
      case KNIGHT:
        return "桂馬";
      case LANCE:
        return "香車";
      case PAWN:
        return "歩兵";
      case ROOK | PROMOTED:
        return "龍王";
      case BISHOP | PROMOTED:
        return "龍馬";
      case SILVER | PROMOTED:
        return "成銀";
      case KNIGHT | PROMOTED:
        return "成桂";
      case LANCE | PROMOTED:
        return "成香";
      case PAWN | PROMOTED:
        return "と金";

      default:
        return;
    }
  };

  return (
    <>
      <Show when={properties.move}>
        <rect x={properties.x + 1} y={properties.y + 1} height={8} width={8} class={Styles.board} />
      </Show>
      <Show when={source()}>
        {(source) => (
          <UsePiece piece={source()} x={properties.x} y={properties.y} rotate={Boolean(properties.square & COLOR)} />
        )}
      </Show>
    </>
  );
};
