import { BoardData, MoveTypes, Reset, Move, Empty, Castling, EnPassant, Promotion, Index } from "../types";

export const getNewBoard = (board: BoardData, move: MoveTypes): BoardData => {
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
