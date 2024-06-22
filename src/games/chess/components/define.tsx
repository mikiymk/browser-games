import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import bishop from "@/images/chess/bishop.svg";
import king from "@/images/chess/king.svg";
import knight from "@/images/chess/knight.svg";
import pawn from "@/images/chess/pawn.svg";
import queen from "@/images/chess/queen.svg";
import rook from "@/images/chess/rook.svg";
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
} from "@/games/chess/constants";

export const DefinePieces = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefinePiece name="bishop" color="black" />
      <DefinePiece name="king" color="black" />
      <DefinePiece name="knight" color="black" />
      <DefinePiece name="pawn" color="black" />
      <DefinePiece name="queen" color="black" />
      <DefinePiece name="rook" color="black" />

      <DefinePiece name="bishop" color="white" />
      <DefinePiece name="king" color="white" />
      <DefinePiece name="knight" color="white" />
      <DefinePiece name="pawn" color="white" />
      <DefinePiece name="queen" color="white" />
      <DefinePiece name="rook" color="white" />
    </svg>
  );
};

type DefinePieceProperties = {
  readonly name: "bishop" | "king" | "knight" | "pawn" | "queen" | "rook";
  readonly color: "black" | "white";
};
const DefinePiece = (properties: DefinePieceProperties): JSXElement => {
  const pieceImage = (): string => {
    const sourceFiles = {
      bishop: bishop.src,
      king: king.src,
      knight: knight.src,
      pawn: pawn.src,
      queen: queen.src,
      rook: rook.src,
    } as const;

    return `${sourceFiles[properties.name]}#root`;
  };

  return (
    <symbol id={`${properties.color}-${properties.name}`} viewBox="0 0 60 60">
      <use
        href={pieceImage()}
        class={properties.color === "black" ? "fill-stone-500 stroke-slate-900" : "fill-stone-200 stroke-slate-900"}
      />
    </symbol>
  );
};

type PieceProperties = {
  readonly piece: number;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: PieceProperties): JSXElement => {
  const id = (): string | undefined => {
    const ids: Record<number, string> = {
      [CellBlackBishop]: "black-bishop",
      [CellBlackKing]: "black-king",
      [CellBlackKnight]: "black-knight",
      [CellBlackPawn]: "black-pawn",
      [CellBlackQueen]: "black-queen",
      [CellBlackRook]: "black-rook",
      [CellWhiteBishop]: "white-bishop",
      [CellWhiteKing]: "white-king",
      [CellWhiteKnight]: "white-knight",
      [CellWhitePawn]: "white-pawn",
      [CellWhiteQueen]: "white-queen",
      [CellWhiteRook]: "white-rook",
    };

    return ids[properties.piece];
  };
  return (
    <Show when={id()}>
      {(id) => <use href={`#${id()}`} x={properties.x} y={properties.y} height={10} width={10} />}
    </Show>
  );
};
