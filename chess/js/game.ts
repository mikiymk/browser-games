import { Accessor, Setter } from "solid-js";
import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardData,
  Castling,
  Empty,
  EnPassant,
  Index,
  IsCastled,
  Mark,
  Move,
  MoveTypeGenerator,
  MoveTypes,
  Piece,
  Players,
  Promotion,
  Reset,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "./types";

export const gameLoop = async (
  players: Players,
  board: Accessor<BoardData>,
  setBoard: Setter<BoardData>,
  setStatus: Setter<string>,
) => {
  let mark: Mark = White;
  let castling: IsCastled = [true, true, true, true];
  let canEnPassant: false | Index = false;
  initializeBoard(setBoard);

  console.log("start game");

  for (;;) {
    const player = players[mark];

    setStatus(mark === Black ? "Black turn" : "White turn");

    const move = await player.getMove(board(), mark);

    if (move.type === Reset) {
      break;
    }

    doAction(setBoard, move);

    mark = invertMark(mark);

    if (isFinished(board(), castling, canEnPassant)) {
      break;
    }
  }

  console.log("end game");
};

const initializeBoard = (setBoard: Setter<BoardData>) => {
  setBoard((board) => {
    const newBoard: BoardData = [...board];

    newBoard.fill(Empty);

    newBoard[0] = BlackRook;
    newBoard[1] = BlackKnight;
    newBoard[2] = BlackBishop;
    newBoard[3] = BlackQueen;
    newBoard[4] = BlackKing;
    newBoard[5] = BlackBishop;
    newBoard[6] = BlackKnight;
    newBoard[7] = BlackRook;

    newBoard[8] = BlackPawn;
    newBoard[9] = BlackPawn;
    newBoard[10] = BlackPawn;
    newBoard[11] = BlackPawn;
    newBoard[12] = BlackPawn;
    newBoard[13] = BlackPawn;
    newBoard[14] = BlackPawn;
    newBoard[15] = BlackPawn;

    newBoard[48] = WhitePawn;
    newBoard[49] = WhitePawn;
    newBoard[50] = WhitePawn;
    newBoard[51] = WhitePawn;
    newBoard[52] = WhitePawn;
    newBoard[53] = WhitePawn;
    newBoard[54] = WhitePawn;
    newBoard[55] = WhitePawn;

    newBoard[56] = WhiteRook;
    newBoard[57] = WhiteKnight;
    newBoard[58] = WhiteBishop;
    newBoard[59] = WhiteQueen;
    newBoard[60] = WhiteKing;
    newBoard[61] = WhiteBishop;
    newBoard[62] = WhiteKnight;
    newBoard[63] = WhiteRook;

    return newBoard;
  });
};

const doAction = (setBoard: Setter<BoardData>, move: MoveTypes) => {
  setBoard((board) => {
    return getNewBoard(board, move);
  });
};

const getNewBoard = (board: BoardData, move: MoveTypes): BoardData => {
  const newBoard: BoardData = [...board];

  switch (move.type) {
    case Reset: {
      return board;
    }

    case Move: {
      const from = move.from;
      const to = move.to;

      newBoard[to] = newBoard[from];
      newBoard[from] = Empty;

      return newBoard;
    }

    case Castling: {
      const rookFrom = move.rook;

      let kingFrom: Index = 1;
      let kingTo: Index = 2;
      let rookTo: Index = 4;

      switch (rookFrom) {
        case 0: {
          kingFrom = 4;
          kingTo = 2;
          rookTo = 3;

          break;
        }

        case 7: {
          kingFrom = 4;
          kingTo = 6;
          rookTo = 5;

          break;
        }

        case 56: {
          kingFrom = 60;
          kingTo = 58;
          rookTo = 59;

          break;
        }

        case 63: {
          kingFrom = 60;
          kingTo = 62;
          rookTo = 61;

          break;
        }

        // No default
      }

      newBoard[kingTo] = newBoard[kingFrom];
      newBoard[kingFrom] = Empty;

      newBoard[rookTo] = newBoard[rookFrom];
      newBoard[rookFrom] = Empty;

      return newBoard;
    }

    case EnPassant: {
      const from = move.from;
      const to = move.to;
      const capture = move.capture;

      newBoard[to] = newBoard[from];
      newBoard[from] = Empty;
      newBoard[capture] = Empty;

      return newBoard;
    }

    case Promotion: {
      const from = move.from;
      const to = move.to;
      const piece = move.piece;

      newBoard[to] = piece;
      newBoard[from] = Empty;

      return newBoard;
    }
  }
};

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

const getPiecesMoves = function* (board: BoardData, mark: Mark, canEnPassant: false | Index): MoveTypeGenerator {
  for (const [index, square] of board.entries()) {
    if (getMark(square) === mark) {
      yield* getMoves(board, canEnPassant, index as Index);
    }
  }
};

const getMoves = function* (board: BoardData, canEnPassant: false | Index, from: Index): MoveTypeGenerator {
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
): MoveTypeGenerator {
  const moves: MoveTypes[] = [];

  const step1 = direction;
  const step2 = direction * 2;
  const initialRankRangeStart = 28 - 20 * direction; // 8 or 48
  const initialRankRangeEnd = 35 - 20 * direction; // 15 or 55
  const promotionRankRangeStart = 28 - 28 * direction; // 0 or 56
  const promotionRankRangeEnd = 35 - 28 * direction; // 7 or 63

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
  const promotionPieces: Piece[] = [WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen];

  for (const move of moves) {
    if (move.type === Move && promotionRankRangeStart <= from && from <= promotionRankRangeEnd) {
      for (const piece of promotionPieces) {
        yield generateMovePromotion(move.from, move.to, piece);
      }
    } else {
      yield move;
    }
  }
};

const getJumpMove = function* (board: BoardData, from: Index, points: [number, number][]): MoveTypeGenerator {
  for (const [dx, dy] of points) {
    const to = validateMove(from, dx, dy);

    if (to !== undefined && !isSameMark(board, from, to)) {
      yield generateMoveMove(from, to);
    }
  }
};

const getRunMove = function* (board: BoardData, from: Index, directions: [number, number][]): MoveTypeGenerator {
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

const generateMoveMove = (from: Index, to: Index): MoveTypes => {
  return { type: Move, from, to };
};

const generateMoveCastling = (rook: 0 | 7 | 56 | 63): MoveTypes => {
  return { type: Castling, rook };
};

const generateMoveEnPassant = (from: Index, to: Index, capture: Index): MoveTypes => {
  return { type: EnPassant, from, to, capture };
};

const generateMovePromotion = (from: Index, to: Index, piece: Piece): MoveTypes => {
  return { type: Promotion, from, to, piece };
};

const invertMark = (mark: Mark) => {
  return mark === Black ? White : Black;
};

const getMark = (piece: Piece | Empty): Mark | Empty => {
  switch (piece) {
    case WhitePawn:
    case WhiteKnight:
    case WhiteBishop:
    case WhiteRook:
    case WhiteQueen:
    case WhiteKing: {
      return White;
    }

    case BlackPawn:
    case BlackKnight:
    case BlackBishop:
    case BlackRook:
    case BlackQueen:
    case BlackKing: {
      return Black;
    }

    case Empty: {
      return Empty;
    }
  }
};

const isSameMark = (board: BoardData, from: Index, to: Index): boolean => {
  const fromMark = getMark(board[from]);
  const toMark = getMark(board[to]);

  if (fromMark === Empty || toMark === Empty) return false;
  return fromMark === toMark;
};

const isOtherMark = (board: BoardData, from: Index, to: Index): boolean => {
  const fromMark = getMark(board[from]);
  const toMark = getMark(board[to]);

  if (fromMark === Empty || toMark === Empty) return false;
  return fromMark !== toMark;
};

const isFinished = (board: BoardData, castling: IsCastled, canEnPassant: false | Index) => {
  // チェックメイトの場合
  // キングの位置を探す
  // キングとその周りの位置が攻撃されているか調べる

  const whiteMoves = [...getPiecesMoves(board, White, canEnPassant)];
  const blackMoves = [...getPiecesMoves(board, Black, canEnPassant)];

  const whiteKingIndex = board.indexOf(WhiteKing) as Index | undefined;
  const blackKingIndex = board.indexOf(BlackKing) as Index | undefined;

  if (whiteKingIndex === undefined || blackKingIndex === undefined) {
    // キングが不在
    return true;
  }

  if (canAttackThereByMove(whiteMoves, blackKingIndex)) {
    // チェック状態の場合、次に動いてチェック状態が解除される手があるか調べ、ない場合はチェックメイトになる
    for (const move of blackMoves) {
      const nextBoard = getNewBoard(board, move);
      const kingIndex = nextBoard.indexOf(BlackKing) as Index;

      if (canAttackThereByBoard(nextBoard, White, getNextEnPassant(board, move), kingIndex)) {
        // チェックメイト
        return true;
      }
    }
  }

  // 白のキング
  if (canAttackThereByMove(whiteMoves, blackKingIndex)) {
    // チェック状態の場合、次に動いてチェック状態が解除される手があるか調べ、ない場合はチェックメイトになる
    for (const move of blackMoves) {
      const nextBoard = getNewBoard(board, move);
      const kingIndex = nextBoard.indexOf(BlackKing) as Index;

      if (canAttackThereByBoard(nextBoard, White, getNextEnPassant(board, move), kingIndex)) {
        // チェックメイト
        return true;
      }
    }
  }

  // ステイルメイトの場合
  // 全ての駒の動ける場所を調べる

  // チェックメイトできない場合
  // 駒の数を数えて、足りないか調べる

  // 同じ盤面が３回以上の場合

  return false;
};

const canAttackThereByMove = (moves: MoveTypes[], target: Index) => {
  return moves.some((move) => isMoveAttackThere(move, target));
};

const canAttackThereByBoard = (board: BoardData, mark: Mark, canEnPassant: false | Index, target: Index): boolean => {
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

const getNextEnPassant = (board: BoardData, move: MoveTypes): false | Index => {
  // ポーンが縦に２つ進んでいる場合、アンパサン可能とする
  if (
    move.type === Move &&
    move.from - move.to === 16 &&
    (board[move.from] === BlackPawn || board[move.from] === WhitePawn)
  ) {
    return move.to;
  }
  return false;
};
