import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardData,
  Draw,
  Empty,
  EnPassant,
  GameEnd,
  Index,
  Mark,
  Move,
  MoveTypes,
  OddBoard,
  Piece,
  Promotion,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
  WinnerBlack,
  WinnerWhite,
} from "../types";
import { getNextEnPassant } from "./en-passant";
import { getPiecesMoves } from "./get-moves";
import { getNewBoard } from "./next-board";

export const isCheckmate = (board: BoardData, mark: Mark, canEnPassant: false | Index): GameEnd | false => {
  // チェックメイトの場合
  // キングの位置を探す
  // キングとその周りの位置が攻撃されているか調べる

  const whiteMoves = [...getPiecesMoves(board, White, canEnPassant)];
  const blackMoves = [...getPiecesMoves(board, Black, canEnPassant)];

  const whiteKingIndex = board.indexOf(WhiteKing) as Index | undefined;
  const blackKingIndex = board.indexOf(BlackKing) as Index | undefined;

  if (whiteKingIndex === undefined || blackKingIndex === undefined) {
    // キングが不在
    return OddBoard;
  }

  if (mark === White) {
    // 次は白の番
    if (canAttackThereByMove(blackMoves, whiteKingIndex)) {
      // チェック状態の場合、次に動いてチェック状態が解除される手があるか調べ、ない場合はチェックメイトになる
      for (const move of whiteMoves) {
        const nextBoard = getNewBoard(board, move);
        const kingIndex = nextBoard.indexOf(WhiteKing) as Index;

        if (canAttackThereByBoard(nextBoard, Black, getNextEnPassant(board, move), kingIndex)) {
          // チェックメイト
          return WinnerBlack;
        }
      }
    }
  } else {
    // 次は黒の番
    if (canAttackThereByMove(whiteMoves, blackKingIndex)) {
      // チェック状態の場合、次に動いてチェック状態が解除される手があるか調べ、ない場合はチェックメイトになる
      for (const move of blackMoves) {
        const nextBoard = getNewBoard(board, move);
        const kingIndex = nextBoard.indexOf(BlackKing) as Index;

        if (canAttackThereByBoard(nextBoard, White, getNextEnPassant(board, move), kingIndex)) {
          // チェックメイト
          return WinnerWhite;
        }
      }
    }
  }

  return false;
};

export const isStalemate = (board: BoardData, mark: Mark, canEnPassant: false | Index): GameEnd | false => {
  // ステイルメイトの場合

  const whiteMoves = [...getPiecesMoves(board, White, canEnPassant)];
  const blackMoves = [...getPiecesMoves(board, Black, canEnPassant)];

  // キャスリング以外の動きが１つ以上あるか調べる
  // キャスリングができる状況では確実にできる動きがある
  if (mark === White) {
    if (whiteMoves.length === 0) {
      return Draw;
    }
  } else {
    if (blackMoves.length === 0) {
      return Draw;
    }
  }

  return false;
};

export const existsCheckmatePieces = (board: BoardData): boolean => {
  // チェックメイトできない場合
  // 駒の数を数えて、足りないか調べる

  const pieces: Record<Piece | Empty, number> = {
    [Empty]: 0,
    [BlackPawn]: 0,
    [BlackKnight]: 0,
    [BlackBishop]: 0,
    [BlackRook]: 0,
    [BlackQueen]: 0,
    [BlackKing]: 0,
    [WhitePawn]: 0,
    [WhiteKnight]: 0,
    [WhiteBishop]: 0,
    [WhiteRook]: 0,
    [WhiteQueen]: 0,
    [WhiteKing]: 0,
  };
  for (const square of board) {
    pieces[square]++;
  }

  if (
    pieces[BlackPawn] === 0 &&
    pieces[BlackKnight] === 0 &&
    pieces[BlackBishop] === 0 &&
    pieces[BlackRook] === 0 &&
    pieces[BlackQueen] === 0
  ) {
    // 黒がキングのみ
    if (pieces[WhitePawn] >= 1) {
      // ポーンがある (プロモーションができる)
      return true;
    }
    if (pieces[WhiteKnight] >= 1 && pieces[WhiteBishop] >= 1) {
      // ナイトとビショップがある
      return true;
    }
    if (pieces[WhiteBishop] >= 2) {
      // ビショップが２つある
      return true;
    }
    if (pieces[WhiteRook] >= 1) {
      // ルークがある
      return true;
    }
    if (pieces[WhiteQueen] >= 1) {
      // クイーンがある
      return true;
    }

    return false;
  }
  if (
    pieces[WhitePawn] === 0 &&
    pieces[WhiteKnight] === 0 &&
    pieces[WhiteBishop] === 0 &&
    pieces[WhiteRook] === 0 &&
    pieces[WhiteQueen] === 0
  ) {
    // 白がキングのみ
    if (pieces[BlackPawn] >= 1) {
      // ポーンがある (プロモーションができる)
      return true;
    }
    if (pieces[BlackKnight] >= 1 && pieces[BlackBishop] >= 1) {
      // ナイトとビショップがある
      return true;
    }
    if (pieces[BlackBishop] >= 2) {
      // ビショップが２つある
      return true;
    }
    if (pieces[BlackRook] >= 1) {
      // ルークがある
      return true;
    }
    if (pieces[BlackQueen] >= 1) {
      // クイーンがある
      return true;
    }

    return false;
  }

  return true;
};

const charsMap: Record<Piece | Empty, string> = {
  [Empty]: "E",
  [BlackPawn]: "p",
  [BlackKnight]: "n",
  [BlackBishop]: "b",
  [BlackRook]: "r",
  [BlackQueen]: "q",
  [BlackKing]: "k",
  [WhitePawn]: "P",
  [WhiteKnight]: "N",
  [WhiteBishop]: "B",
  [WhiteRook]: "R",
  [WhiteQueen]: "Q",
  [WhiteKing]: "K",
};

export const updateThreefoldMap = (threefoldMap: Map<string, number>, board: BoardData, mark: Mark) => {
  const boardString = `${boardToFen(board)} ${markToFen(mark)}`;

  const count = threefoldMap.get(boardString);
  if (count === undefined) {
    threefoldMap.set(boardString, 1);
  } else {
    threefoldMap.set(boardString, count + 1);
  }
};

const boardToFen = (board: BoardData): string => {
  let emptyCount = 0;
  const stringArray: string[] = [];
  for (const [index, square] of board.entries()) {
    if (index % 8 === 0) {
      if (emptyCount !== 0) {
        stringArray.push(String(emptyCount));
      }
      emptyCount = 0;
      stringArray.push("/");
    }
    if (square === Empty) {
      emptyCount++;
    } else {
      if (emptyCount !== 0) {
        stringArray.push(String(emptyCount));
      }
      emptyCount = 0;
      stringArray.push(charsMap[square]);
    }
  }

  return stringArray.slice(1).join("");
};

const markToFen = (mark: Mark): string => {
  return mark === White ? "w" : "b";
};

export const isFiftyMoveCountReset = (board: BoardData, move: MoveTypes): boolean => {
  return (
    move.type === EnPassant ||
    move.type === Promotion ||
    (move.type === Move &&
      (board[move.to] !== Empty || board[move.from] === BlackPawn || board[move.from] === WhitePawn))
  );
};

export const canAttackThereByMove = (moves: MoveTypes[], target: Index) => {
  return moves.some((move) => isMoveAttackThere(move, target));
};

export const canAttackThereByBoard = (
  board: BoardData,
  mark: Mark,
  canEnPassant: false | Index,
  target: Index,
): boolean => {
  for (const move of getPiecesMoves(board, mark, canEnPassant)) {
    if (isMoveAttackThere(move, target)) {
      return true;
    }
  }

  return false;
};

const isMoveAttackThere = (move: MoveTypes, target: Index): boolean => {
  return (move.type === Move || move.type === EnPassant || move.type === Promotion) && move.to === target;
};
