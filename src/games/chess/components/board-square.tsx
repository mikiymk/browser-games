import { Match, Switch } from "solid-js";

import {
  CellBlackBishop,
  CellBlackKing,
  CellBlackKnight,
  CellBlackPawn,
  CellBlackQueen,
  CellBlackRook,
  CellWhiteBishop,
  CellWhiteKing,
  CellWhiteKnight,
  CellWhitePawn,
  CellWhiteQueen,
  CellWhiteRook,
} from "../constants";
import { pieceBlackStyle, pieceWhiteStyle } from "@/styles/chess.css";
import piece from "@/images/chess/piece.svg";

type BoardSquareProperties = {
  piece: number;
  mark: number;
};

export const BoardSquare = (properties: BoardSquareProperties) => {
  return (
    <svg
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      class={
        properties.piece === CellBlackPawn ||
        properties.piece === CellBlackKnight ||
        properties.piece === CellBlackBishop ||
        properties.piece === CellBlackRook ||
        properties.piece === CellBlackQueen ||
        properties.piece === CellBlackKing
          ? pieceBlackStyle
          : pieceWhiteStyle
      }
    >
      <title>chess pieces</title>

      <Switch>
        <Match when={properties.piece === CellBlackPawn || properties.piece === CellWhitePawn}>
          <use href={`${piece.src}#pawn`} />
        </Match>

        <Match when={properties.piece === CellBlackKnight || properties.piece === CellWhiteKnight}>
          <use href={`${piece.src}#knight`} />
        </Match>

        <Match when={properties.piece === CellBlackBishop || properties.piece === CellWhiteBishop}>
          <use href={`${piece.src}#bishop`} />
        </Match>

        <Match when={properties.piece === CellBlackRook || properties.piece === CellWhiteRook}>
          <use href={`${piece.src}#rook`} />
        </Match>

        <Match when={properties.piece === CellBlackQueen || properties.piece === CellWhiteQueen}>
          <use href={`${piece.src}#queen`} />
        </Match>

        <Match when={properties.piece === CellBlackKing || properties.piece === CellWhiteKing}>
          <use href={`${piece.src}#king`} />
        </Match>
      </Switch>
    </svg>
  );
};
