import { BlackPawn, BoardData, Index, Move, MoveTypes, WhitePawn } from "@/chess/js/types";

export const getNextEnPassant = (board: BoardData, move: MoveTypes): false | Index => {
  // ポーンが縦に２つ進んでいる場合、アンパサン可能とする
  if (
    move.type === Move &&
    Math.abs(move.from - move.to) === 16 &&
    (board[move.from] === BlackPawn || board[move.from] === WhitePawn)
  ) {
    return move.to;
  }
  return false;
};
