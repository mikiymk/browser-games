import {
  Castling,
  EnPassant,
  Index,
  Move,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
  Piece,
  Promotion,
} from "@/chess/js/types";

export const generateMoveMove = (from: Index, to: Index): MoveTypeMove => {
  return { type: Move, from, to };
};

export const generateMoveCastling = (rook: 0 | 7 | 56 | 63): MoveTypeCastling => {
  return { type: Castling, rook };
};

export const generateMoveEnPassant = (from: Index, to: Index, capture: Index): MoveTypeEnPassant => {
  return { type: EnPassant, from, to, capture };
};

export const generateMovePromotion = (from: Index, to: Index, piece: Piece): MoveTypePromotion => {
  return { type: Promotion, from, to, piece };
};
