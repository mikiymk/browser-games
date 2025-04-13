import type { JSXElement } from "solid-js";

import { DefineUse } from "../../../components/define/define-use.tsx";
import { Use } from "../../../components/define/use.tsx";
import bishop from "../../../images/chess/bishop.svg";
import king from "../../../images/chess/king.svg";
import knight from "../../../images/chess/knight.svg";
import pawn from "../../../images/chess/pawn.svg";
import queen from "../../../images/chess/queen.svg";
import rook from "../../../images/chess/rook.svg";
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
} from "../constants.ts";
import { define, defineUse } from "./style.css.ts";

export const DefinePieces = (): JSXElement => {
  return (
    <svg class={define} viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
      <title>define cards</title>

      <DefinePiece color="black" name="bishop" />
      <DefinePiece color="black" name="king" />
      <DefinePiece color="black" name="knight" />
      <DefinePiece color="black" name="pawn" />
      <DefinePiece color="black" name="queen" />
      <DefinePiece color="black" name="rook" />

      <DefinePiece color="white" name="bishop" />
      <DefinePiece color="white" name="king" />
      <DefinePiece color="white" name="knight" />
      <DefinePiece color="white" name="pawn" />
      <DefinePiece color="white" name="queen" />
      <DefinePiece color="white" name="rook" />
    </svg>
  );
};

type DefinePieceProperties = {
  readonly color: "black" | "white";
  readonly name: "bishop" | "king" | "knight" | "pawn" | "queen" | "rook";
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

    return sourceFiles[properties.name];
  };

  return (
    <DefineUse class={defineUse[properties.color]} href={pieceImage()} id={`${properties.color}-${properties.name}`} />
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

  return <Use id={id()} x={properties.x} y={properties.y} />;
};
