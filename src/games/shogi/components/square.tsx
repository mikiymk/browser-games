import type { JSXElement } from "solid-js";

import { Show } from "solid-js";

import { BISHOP, COLOR, GOLD, KING, KNIGHT, LANCE, PAWN, PIECE, PROMOTED, ROOK, SILVER } from "../constants.ts";
import { UsePiece } from "./define.tsx";
import { board } from "./style.css.ts";

type SquareProperties = {
  readonly move: boolean;
  readonly square: number;

  readonly x: number;
  readonly y: number;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const source = (): string | undefined => {
    if (!properties.square) {
      return;
    }

    switch (properties.square & (PIECE | PROMOTED)) {
      case BISHOP:
        return "角行";
      case BISHOP | PROMOTED:
        return "龍馬";
      case GOLD:
        return "金将";
      case KING:
        return properties.square & COLOR ? "玉将" : "王将";
      case KNIGHT:
        return "桂馬";
      case KNIGHT | PROMOTED:
        return "成桂";
      case LANCE:
        return "香車";
      case LANCE | PROMOTED:
        return "成香";
      case PAWN:
        return "歩兵";
      case PAWN | PROMOTED:
        return "と金";
      case ROOK:
        return "飛車";
      case ROOK | PROMOTED:
        return "龍王";
      case SILVER:
        return "銀将";
      case SILVER | PROMOTED:
        return "成銀";

      default:
        return;
    }
  };

  return (
    <>
      <Show when={properties.move}>
        <rect class={board} height={8} width={8} x={properties.x + 1} y={properties.y + 1} />
      </Show>
      <Show when={source()}>
        {(source) => (
          <UsePiece piece={source()} rotate={Boolean(properties.square & COLOR)} x={properties.x} y={properties.y} />
        )}
      </Show>
    </>
  );
};
