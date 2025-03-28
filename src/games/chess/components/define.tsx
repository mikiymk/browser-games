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
import Styles from "./style.module.css";

export const DefinePieces = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class={Styles.define}>
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

    return sourceFiles[properties.name];
  };

  return (
    <DefineUse
      id={`${properties.color}-${properties.name}`}
      href={pieceImage()}
      class={properties.color === "black" ? Styles["define-black"] : Styles["define-white"]}
    />
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
