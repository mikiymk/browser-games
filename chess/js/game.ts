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
  Index,
  Mark,
  Move,
  MoveTypes,
  Players,
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

    doAction(setBoard, mark, move);

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

const doAction = (setBoard: Setter<BoardData>, mark: Mark, move: MoveTypes) => {
  switch (move.type) {
    case Reset: {
      return;
    }

    case Move: {
      const from = move.from;
      const to = move.to;

      setBoard((board) => {
        const newBoard: BoardData = [...board];

        newBoard[to] = newBoard[from];
        newBoard[from] = Empty;

        return newBoard;
      });

      return;
    }

    case Castling: {
      const side = move.side;

      let kingFrom: Index = 1;
      let kingTo: Index = 2;
      let rookFrom: Index = 3;
      let rookTo: Index = 4;
      if (mark === Black && side === WhiteQueen) {
        kingFrom = 4;
        kingTo = 2;
        rookFrom = 0;
        rookTo = 3;
      } else if (mark === Black && side === WhiteKing) {
        kingFrom = 4;
        kingTo = 6;
        rookFrom = 8;
        rookTo = 7;
      } else if (mark === White && side === WhiteQueen) {
        kingFrom = 60;
        kingTo = 58;
        rookFrom = 56;
        rookTo = 59;
      } else if (mark === White && side === WhiteKing) {
        kingFrom = 60;
        kingTo = 62;
        rookFrom = 63;
        rookTo = 61;
      }

      setBoard((board) => {
        const newBoard: BoardData = [...board];

        newBoard[kingTo] = newBoard[kingFrom];
        newBoard[kingFrom] = Empty;

        newBoard[rookTo] = newBoard[rookFrom];
        newBoard[rookFrom] = Empty;

        return newBoard;
      });

      return;
    }
  }
};

const invertMark = (mark: Mark) => {
  return mark === Black ? White : Black;
};

const isFinished = (board: Accessor<BoardData>) => {
  return false;
};
