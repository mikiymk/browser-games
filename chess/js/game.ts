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
  Mark,
  Move,
  MoveTypes,
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

    const move = await player.getMove(board, mark);

    if (move.type === Reset) {
      break;
    }

    doAction(setBoard, move);

    mark = invertMark(mark);

    if (isFinished(board)) {
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

const invertMark = (mark: Mark) => {
  return mark === Black ? White : Black;
};

const isFinished = (board: Accessor<BoardData>) => {
  // チェックメイトの場合
  // キングの位置を探す
  // キングとその周りの位置が攻撃されているか調べる

  // ステイルメイトの場合
  // 全ての駒の動ける場所を調べる

  // チェックメイトできない場合
  // 駒の数を数えて、足りないか調べる

  // 同じ盤面が３回以上の場合

  return false;
};
