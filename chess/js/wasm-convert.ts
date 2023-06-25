import type {
  BoardData,
  IsCastled,
  MoveTypeMove,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypePromotion,
  Index,
  PositionString,
  WasmPiece,
  PositionFile,
  PositionRank,
  PromotionPieces,
} from "./types";

export const convertBoardToWasmBoard = (board: BoardData): Uint8Array => {
  return new Uint8Array(board);
};

export const convertWasmBoardToBoard = (board: Uint8Array | undefined): BoardData => {
  if (board === undefined || board.length !== 64) {
    throw new Error("board is empty");
  }

  return [...board] as BoardData;
};

export const convertWasmCastlingToCastling = (castling: number | undefined): IsCastled => {
  if (castling === undefined) {
    throw new Error("castling is empty");
  }

  return castling;
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
  return value.split(" ") as MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion;
};

export const convertPieceToWasmPiece = (wasmPiece: PromotionPieces): WasmPiece => {
  return wasmPiece;
};
