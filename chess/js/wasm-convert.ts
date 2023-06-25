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
  Move,
  Castling,
  EnPassant,
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

export const convertWasmBoardToBoard = (board: Uint8Array | undefined): BoardData => {
  if (board === undefined || board.length !== 64) {
    throw new Error("board is empty");
  }

  return [...board].map(
    (value) =>
      ({
        0: Empty,
        1: WhitePawn,
        2: WhiteKnight,
        3: WhiteBishop,
        4: WhiteRook,
        5: WhiteQueen,
        6: WhiteKing,
        7: BlackPawn,
        8: BlackKnight,
        9: BlackBishop,
        10: BlackRook,
        11: BlackQueen,
        12: BlackKing,
      }[value] ?? Empty),
  ) as BoardData;
};

export const convertEnPassantToWasmEnPassant = (enPassant: Index | false): number | undefined => {
  return enPassant === false ? undefined : enPassant;
};

export const convertWasmEnPassantToEnPassant = (enPassant: number | undefined): Index | false => {
  return enPassant === undefined ? false : (enPassant as Index);
};

export const convertCastlingToWasmCastling = (castling: IsCastled): Uint8Array => {
  return new Uint8Array(castling.map(Number));
};

export const convertWasmCastlingToCastling = (castling: Uint8Array | undefined): IsCastled => {
  if (castling === undefined || castling.length !== 4) {
    throw new Error("castling is empty");
  }

  return [castling[0] !== 0, castling[1] !== 0, castling[2] !== 0, castling[3] !== 0];
};

export const convertMoveToWasmMove = (
  move: MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion,
): WasmMove => {
  switch (move.type) {
    case Move: {
      return ["m", convertIndexToPosition(move.from), convertIndexToPosition(move.to)];
    }
    case Castling: {
      const king = move.rook === 0 || move.rook === 7 ? 4 : 60;
      return ["c", convertIndexToPosition(king), convertIndexToPosition(move.rook)];
    }
    case EnPassant: {
      return [
        "e",
        convertIndexToPosition(move.from),
        convertIndexToPosition(move.to),
        convertIndexToPosition(move.capture),
      ];
    }
    default: {
      return [
        "p",
        convertIndexToPosition(move.from),
        convertIndexToPosition(move.to),
        convertPieceToWasmPiece(move.piece),
      ];
    }
  }
};

export const convertIndexToPosition = (index: Index): PositionString => {
  const rank = Math.floor(index / 8);
  const file = index % 8;

  return ((["a", "b", "c", "d", "e", "f", "g", "h"][file] ?? "") + String(8 - rank)) as PositionString;
};

export const convertPositionToIndex = (posString: PositionString) => {
  const [file, rank] = [...posString] as [PositionFile, PositionRank];
  const fileValue = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }[file];
  const rankValue = 8 - Number.parseInt(rank);

  return (rankValue * 8 + fileValue) as Index;
};

export const convertWasmMoveToMove = (
  value: string,
): MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion => {
  const wasmMove = value.split(" ") as WasmMove;

  if (wasmMove[0] === "m") {
    return generateMoveMove(convertPositionToIndex(wasmMove[1]), convertPositionToIndex(wasmMove[2]));
  }

  if (wasmMove[0] === "c") {
    return generateMoveCastling(convertPositionToIndex(wasmMove[2]) as 0 | 7 | 56 | 63);
  }

  if (wasmMove[0] === "e") {
    return generateMoveEnPassant(
      convertPositionToIndex(wasmMove[1]),
      convertPositionToIndex(wasmMove[2]),
      convertPositionToIndex(wasmMove[3]),
    );
  }

  return generateMovePromotion(
    convertPositionToIndex(wasmMove[1]),
    convertPositionToIndex(wasmMove[2]),
    convertWasmPieceToPiece(wasmMove[3]),
  );
};

const convertPieceToWasmPiece = (wasmPiece: Piece): WasmPiece => {
  return (
    {
      [WhitePawn]: "P",
      [WhiteKnight]: "N",
      [WhiteBishop]: "B",
      [WhiteRook]: "R",
      [WhiteQueen]: "Q",
      [WhiteKing]: "K",
      [BlackPawn]: "P",
      [BlackKnight]: "N",
      [BlackBishop]: "B",
      [BlackRook]: "R",
      [BlackQueen]: "Q",
      [BlackKing]: "K",
    } satisfies Record<Piece, WasmPiece>
  )[wasmPiece];
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
