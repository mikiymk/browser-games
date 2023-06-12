import { Castling, EnPassant, Index, Move, MoveTypes, Piece, Promotion } from "../types";

export const generateMoveMove = (from: Index, to: Index): MoveTypes => {
  return { type: Move, from, to };
};

export const generateMoveCastling = (rook: 0 | 7 | 56 | 63): MoveTypes => {
  return { type: Castling, rook };
};

export const generateMoveEnPassant = (from: Index, to: Index, capture: Index): MoveTypes => {
  return { type: EnPassant, from, to, capture };
};

export const generateMovePromotion = (from: Index, to: Index, piece: Piece): MoveTypes => {
  return { type: Promotion, from, to, piece };
};
