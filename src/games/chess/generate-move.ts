import type {
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
  PositionString,
  WasmPiece,
} from "@/games/chess/types";

export const generateMoveMove = (from: PositionString, to: PositionString): MoveTypeMove => {
  return ["m", from, to];
};

export const generateMoveCastling = (king: PositionString, rook: PositionString): MoveTypeCastling => {
  return ["c", king, rook];
};

export const generateMoveEnPassant = (
  from: PositionString,
  to: PositionString,
  capture: PositionString,
): MoveTypeEnPassant => {
  return ["e", from, to, capture];
};

export const generateMovePromotion = (
  from: PositionString,
  to: PositionString,
  piece: WasmPiece,
): MoveTypePromotion => {
  return ["p", from, to, piece];
};
