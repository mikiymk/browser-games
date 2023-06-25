import {
  generateMoveMove,
  generateMoveCastling,
  generateMoveEnPassant,
  generateMovePromotion,
} from "./game/generate-move";
import {
  Mark,
  White,
  BoardData,
  Empty,
  WhitePawn,
  WhiteKnight,
  WhiteBishop,
  WhiteRook,
  WhiteQueen,
  WhiteKing,
  BlackPawn,
  BlackKnight,
  BlackBishop,
  BlackRook,
  BlackQueen,
  BlackKing,
  IsCastled,
  MoveTypeMove,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypePromotion,
  Piece,
  Index,
} from "./types";

export type PositionFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type PositionRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type PositionString = `${PositionFile}${PositionRank}`;
export type WasmPiece = "P" | "N" | "B" | "R" | "Q" | "K";
export type WasmMove =
  | ["m", PositionString, PositionString]
  | ["c", PositionString, PositionString]
  | ["e", PositionString, PositionString, PositionString]
  | ["p", PositionString, PositionString, WasmPiece];

export const convertMarkToWasmMark = (mark: Mark): number => {
  return mark === White ? 0 : 1;
};

export const convertBoardToWasmBoard = (board: BoardData): Uint8Array => {
  return new Uint8Array(
    board.map(
      (value) =>
        ({
          [Empty]: 0,
          [WhitePawn]: 1,
          [WhiteKnight]: 2,
          [WhiteBishop]: 3,
          [WhiteRook]: 4,
          [WhiteQueen]: 5,
          [WhiteKing]: 6,
          [BlackPawn]: 7,
          [BlackKnight]: 8,
          [BlackBishop]: 9,
          [BlackRook]: 10,
          [BlackQueen]: 11,
          [BlackKing]: 12,
        }[value]),
    ),
  );
};

export const convertEnPassantToWasmEnPassant = (enPassant: Index | false): number | undefined => {
  return enPassant === false ? undefined : enPassant;
};

export const convertCastlingToWasmCastling = (castling: IsCastled): Uint8Array => {
  return new Uint8Array(castling.map(Number));
};

export const parsePosition = (posString: PositionString) => {
  const [file, rank] = [...posString] as [PositionFile, PositionRank];
  const fileValue = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }[file];
  const rankValue = 8 - Number.parseInt(rank);

  return (rankValue * 8 + fileValue) as Index;
};

export const convertWasmMoveToMove = (
  wasmMove: WasmMove,
): MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion => {
  if (wasmMove[0] === "m") {
    return generateMoveMove(parsePosition(wasmMove[1]), parsePosition(wasmMove[2]));
  }

  if (wasmMove[0] === "c") {
    return generateMoveCastling(parsePosition(wasmMove[2]) as 0 | 7 | 56 | 63);
  }

  if (wasmMove[0] === "e") {
    return generateMoveEnPassant(parsePosition(wasmMove[1]), parsePosition(wasmMove[2]), parsePosition(wasmMove[3]));
  }

  return generateMovePromotion(
    parsePosition(wasmMove[1]),
    parsePosition(wasmMove[2]),
    convertWasmPieceToPiece(wasmMove[3]),
  );
};

const convertWasmPieceToPiece = (wasmPiece: WasmPiece): Piece => {
  return (
    {
      P: WhitePawn,
      N: WhiteKnight,
      B: WhiteBishop,
      R: WhiteRook,
      Q: WhiteQueen,
      K: WhiteKing,
    } satisfies Record<WasmPiece, Piece>
  )[wasmPiece];
};
