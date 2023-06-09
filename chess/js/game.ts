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

    if (isFinished(board())) {
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

const getMoves = (board: BoardData, castling: IsCastled, canEnPassant: false | Index, from: Index): MoveTypes[] => {
  const fromPiece = board[from];

  switch (fromPiece) {
    case WhitePawn: {
      return getPawnMove(board, from, -1, canEnPassant);
    }

    case BlackPawn: {
      return getPawnMove(board, from, 1, canEnPassant);
    }

    case WhiteKnight:
    case BlackKnight: {
      return getJumpMove(board, from, knightMoves);
    }

    case WhiteBishop:
    case BlackBishop: {
      return getRunMove(board, from, bishopDirections);
    }

    case WhiteRook:
    case BlackRook: {
      return getRunMove(board, from, rookDirections);
    }

    case WhiteQueen:
    case BlackQueen: {
      return getRunMove(board, from, queenDirections);
    }

    case WhiteKing:
    case BlackKing: {
      const moves = getJumpMove(board, from, kingMoves);

      // キャスリング
      if (fromPiece === BlackKing && castling[0]) {
        // black queen side (rook 0)
        moves.push(generateMoveCastling(0));
      }
      if (fromPiece === BlackKing && castling[1]) {
        // black king side (rook 7)
        moves.push(generateMoveCastling(7));
      }
      if (fromPiece === WhiteKing && castling[2]) {
        // white queen side (rook 56)
        moves.push(generateMoveCastling(56));
      }
      if (fromPiece === WhiteKing && castling[3]) {
        // white king side (rook 63)
        moves.push(generateMoveCastling(63));
      }

      return moves;
    }

    case Empty: {
      return [];
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

const getPawnMove = (board: BoardData, from: Index, direction: 1 | -1, canEnPassant: false | Index): MoveTypes[] => {
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
  const promotionMoves = moves.flatMap((move) => {
    if (move.type === Move && promotionRankRangeStart <= from && from <= promotionRankRangeEnd) {
      const promotionPieces: Piece[] = [WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen];
      return promotionPieces.map((piece) => generateMovePromotion(move.from, move.to, piece));
    }

    return move;
  });

  return promotionMoves;
};

const getJumpMove = (board: BoardData, from: Index, points: [number, number][]): MoveTypes[] => {
  const moves: MoveTypes[] = [];

  for (const [dx, dy] of points) {
    const to = validateMove(from, dx, dy);

    if (to !== undefined && !isSameMark(board, from, to)) {
      moves.push(generateMoveMove(from, to));
    }
  }

  return moves;
};

const getRunMove = (board: BoardData, from: Index, directions: [number, number][]): MoveTypes[] => {
  const moves: MoveTypes[] = [];

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

      moves.push(generateMoveMove(from, to));

      if (isOtherMark(board, from, to)) {
        break;
      }
    }
  }

  return moves;
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

const isFinished = (board: BoardData) => {
  // チェックメイトの場合
  // キングの位置を探す
  // キングとその周りの位置が攻撃されているか調べる

  let whiteKingIndex = 64;
  let blackKingIndex = 64;
  for (const [index, square] of board.entries()) {
    if (square === WhiteKing) {
      whiteKingIndex = index;
    } else if (square === BlackKing) {
      blackKingIndex = index;
    }
  }

  // ステイルメイトの場合
  // 全ての駒の動ける場所を調べる

  // チェックメイトできない場合
  // 駒の数を数えて、足りないか調べる

  // 同じ盤面が３回以上の場合

  return false;
};
