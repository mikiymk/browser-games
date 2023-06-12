import {
  BoardData,
  Mark,
  MoveTypeGenerator,
  WhitePawn,
  BlackPawn,
  WhiteKnight,
  BlackKnight,
  WhiteBishop,
  BlackBishop,
  WhiteRook,
  BlackRook,
  WhiteQueen,
  BlackQueen,
  WhiteKing,
  BlackKing,
  Empty,
  IsCastled,
  Piece,
  Move,
  Index,
  Black,
  White,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
  MoveTypeCastling,
} from "../types";
import { canAttackThereByMove } from "./finish";
import { generateMoveCastling, generateMoveMove, generateMoveEnPassant, generateMovePromotion } from "./generate-move";
import { getMark, isOtherMark, isSameMark } from "./mark";

const knightMoves: [number, number][] = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
];

const bishopDirections: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const rookDirections: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const queenDirections: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const kingMoves: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

export const getPiecesMoves = function* (board: BoardData, mark: Mark, canEnPassant: false | Index): MoveTypeGenerator {
  for (const [index, square] of board.entries()) {
    if (getMark(square) === mark) {
      yield* getMoves(board, canEnPassant, index as Index);
    }
  }
};

export const getMoves = function* (
  board: BoardData,
  canEnPassant: false | Index,
  from: Index,
): Generator<MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion, void, undefined> {
  const fromPiece = board[from];

  switch (fromPiece) {
    case WhitePawn: {
      yield* getPawnMove(board, from, -1, canEnPassant);
      break;
    }

    case BlackPawn: {
      yield* getPawnMove(board, from, 1, canEnPassant);
      break;
    }

    case WhiteKnight:
    case BlackKnight: {
      yield* getJumpMove(board, from, knightMoves);
      break;
    }

    case WhiteBishop:
    case BlackBishop: {
      yield* getRunMove(board, from, bishopDirections);
      break;
    }

    case WhiteRook:
    case BlackRook: {
      yield* getRunMove(board, from, rookDirections);
      break;
    }

    case WhiteQueen:
    case BlackQueen: {
      yield* getRunMove(board, from, queenDirections);
      break;
    }

    case WhiteKing:
    case BlackKing: {
      yield* getJumpMove(board, from, kingMoves);
      break;
    }

    case Empty: {
      break;
    }
  }
};

export const getCastling = function* (
  board: BoardData,
  castling: IsCastled,
  mark: Mark,
): Generator<MoveTypeCastling, void, undefined> {
  switch (mark) {
    case Black: {
      // アンパサンはキングを攻撃することはないから false
      const whiteMoves = [...getPiecesMoves(board, White, false)];

      // black queen
      if (
        castling[0] &&
        board[0] === BlackRook &&
        board[1] === Empty &&
        board[2] === Empty &&
        board[3] === Empty &&
        board[4] === BlackKing &&
        !canAttackThereByMove(whiteMoves, 2) &&
        !canAttackThereByMove(whiteMoves, 3) &&
        !canAttackThereByMove(whiteMoves, 4)
      ) {
        yield generateMoveCastling(0);
      }

      // black king
      if (
        castling[1] &&
        board[4] === BlackKing &&
        board[5] === Empty &&
        board[6] === Empty &&
        board[7] === BlackRook &&
        !canAttackThereByMove(whiteMoves, 4) &&
        !canAttackThereByMove(whiteMoves, 5) &&
        !canAttackThereByMove(whiteMoves, 6)
      ) {
        yield generateMoveCastling(7);
      }
      break;
    }

    case White: {
      // アンパサンはキングを攻撃することはないから false
      const blackMoves = [...getPiecesMoves(board, Black, false)];

      // white queen
      if (
        castling[2] &&
        board[56] === WhiteRook &&
        board[57] === Empty &&
        board[58] === Empty &&
        board[59] === Empty &&
        board[60] === WhiteKing &&
        !canAttackThereByMove(blackMoves, 58) &&
        !canAttackThereByMove(blackMoves, 59) &&
        !canAttackThereByMove(blackMoves, 60)
      ) {
        yield generateMoveCastling(56);
      }

      // white king
      if (
        castling[3] &&
        board[60] === WhiteKing &&
        board[61] === Empty &&
        board[62] === Empty &&
        board[63] === WhiteRook &&
        !canAttackThereByMove(blackMoves, 60) &&
        !canAttackThereByMove(blackMoves, 61) &&
        !canAttackThereByMove(blackMoves, 62)
      ) {
        yield generateMoveCastling(63);
      }
      break;
    }
  }
};

const validateMove = (from: Index, dx: number, dy: number): Index | undefined => {
  const to = from + dx * 8 + dy;

  // 縦を飛び出した場合
  if (to < 0 || 63 < to) return;

  // 横を飛び出した場合
  const moveHorizon = (from % 8) + dy;
  if (moveHorizon < 0 || 7 < moveHorizon) {
    return;
  }

  return to as Index;
};

const getPawnMove = function* (
  board: BoardData,
  from: Index,
  direction: 1 | -1,
  canEnPassant: false | Index,
): Generator<MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion, void, undefined> {
  const moves: (MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion)[] = [];

  const step1 = direction;
  const step2 = direction * 2;
  const initialRankRangeStart = 28 - 20 * direction; // 8 or 48
  const initialRankRangeEnd = 35 - 20 * direction; // 15 or 55
  const promotionRankRangeStart = 28 + 28 * direction; // 0 or 56
  const promotionRankRangeEnd = 35 + 28 * direction; // 7 or 63

  const move1 = validateMove(from, step1, 0);
  if (move1 !== undefined && board[move1] === Empty) {
    // 敵・味方の駒がいない場合のみ
    moves.push(generateMoveMove(from, move1));
  }

  // ランク２では２マス進める
  if (initialRankRangeStart <= from && from <= initialRankRangeEnd) {
    const move2 = validateMove(from, step2, 0);
    if (move1 !== undefined && move2 !== undefined && board[move1] === Empty && board[move2] === Empty) {
      moves.push(generateMoveMove(from, move2));
    }
  }

  // 敵の駒を取る場合は斜めに進める
  for (const dy of [1, -1]) {
    const capture = validateMove(from, step1, dy);

    if (capture !== undefined && isOtherMark(board, from, capture)) {
      moves.push(generateMoveMove(from, capture));
    } else {
      // アンパサン
      const enPassantCapture = validateMove(from, 0, dy);
      if (capture !== undefined && enPassantCapture === canEnPassant) {
        moves.push(generateMoveEnPassant(from, capture, enPassantCapture));
      }
    }
  }

  // ランク８に到達したらプロモーション
  const promotionWhitePieces: Piece[] = [WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen];
  const promotionBlackPieces: Piece[] = [BlackKnight, BlackBishop, BlackRook, BlackQueen];

  const promotionPieces = direction === -1 ? promotionWhitePieces : promotionBlackPieces;

  for (const move of moves) {
    if (move.type === Move && promotionRankRangeStart <= move.to && move.to <= promotionRankRangeEnd) {
      for (const piece of promotionPieces) {
        yield generateMovePromotion(move.from, move.to, piece);
      }
    } else {
      yield move;
    }
  }
};

const getJumpMove = function* (
  board: BoardData,
  from: Index,
  points: [number, number][],
): Generator<MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion, void, undefined> {
  for (const [dx, dy] of points) {
    const to = validateMove(from, dx, dy);

    if (to !== undefined && !isSameMark(board, from, to)) {
      yield generateMoveMove(from, to);
    }
  }
};

const getRunMove = function* (
  board: BoardData,
  from: Index,
  directions: [number, number][],
): Generator<MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion, void, undefined> {
  for (const [ddx, ddy] of directions) {
    let dx = 0;
    let dy = 0;
    for (;;) {
      dx += ddx;
      dy += ddy;

      const to = validateMove(from, dx, dy);

      if (to === undefined || isSameMark(board, from, to)) {
        break;
      }

      yield generateMoveMove(from, to);

      if (isOtherMark(board, from, to)) {
        break;
      }
    }
  }
};
