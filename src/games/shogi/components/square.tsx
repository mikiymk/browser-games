import { Show } from "solid-js";

import { UseImage } from "../../../common/components/use-image/use.tsx";
import { BISHOP, COLOR, GOLD, KING, KNIGHT, LANCE, PAWN, PIECE, PROMOTED, ROOK, SILVER } from "../constants.ts";
import { board } from "./style.css.ts";

import type { JSXElement } from "solid-js";

const source = (square: number): string | undefined => {
  if (!square) {
    return;
  }

  let piece = "";
  switch (square & PIECE) {
    case BISHOP:
      piece = "bishop";
      break;
    case GOLD:
      piece = "gold";
      break;
    case KING:
      piece = "king";
      break;
    case KNIGHT:
      piece = "knight";
      break;
    case LANCE:
      piece = "lance";
      break;
    case PAWN:
      piece = "pawn";
      break;
    case ROOK:
      piece = "rook";
      break;
    case SILVER:
      piece = "silver";
      break;
    default:
  }

  if (square & PROMOTED) {
    piece = `${piece}-promoted`;
  }

  piece = square & COLOR ? `${piece}-up` : `${piece}-down`;

  return piece;
};

type SquareProperties = {
  readonly move: boolean;
  readonly square: number;

  readonly x: number;
  readonly y: number;
};
export const Square = (properties: SquareProperties): JSXElement => {
  return (
    <>
      <Show when={properties.move}>
        <rect class={board} height={8} width={8} x={properties.x + 1} y={properties.y + 1} />
      </Show>
      <UseImage height={10} id={source(properties.square)} width={10} x={properties.x} y={properties.y} />
    </>
  );
};
