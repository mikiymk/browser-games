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
  Empty,
  Index,
  IsCastled,
  Mark,
  Players,
  Reset,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
  WinnerBlack,
  WinnerWhite,
} from "./types";
import { invertMark } from "./game/mark";
import {
  boardToFen,
  castlingToFen,
  enPassantToFen,
  existsCheckmatePieces,
  isCheckmate,
  isFiftyMoveCountReset,
  isStalemate,
  markToFen,
  updateThreefoldMap,
} from "./game/finish";
import { getNewBoard } from "./game/next-board";
import { getNextEnPassant } from "./game/en-passant";

export const gameLoop = async (
  players: Players,
  board: Accessor<BoardData>,
  setBoard: Setter<BoardData>,
  setStatus: Setter<string>,
) => {
  let mark: Mark = White;
  const castling: IsCastled = [true, true, true, true];
  let canEnPassant: false | Index = false;
  let fiftyMoveCount = 0;
  let turn = 1;
  const threefoldRepetition = new Map<string, number>();

  initializeBoard(setBoard);

  console.log("start game");

  mainLoop: for (;;) {
    console.log(
      `${boardToFen(board())} ${markToFen(mark)} ${castlingToFen(castling)} ${enPassantToFen(
        canEnPassant,
      )} ${fiftyMoveCount} ${turn}`,
    );

    const player = players[mark];

    setStatus(mark === Black ? "Black turn" : "White turn");

    const move = await player.getMove(board(), mark, castling, canEnPassant);

    if (move.type === Reset) {
      break;
    }

    canEnPassant = getNextEnPassant(board(), move);
    if (isFiftyMoveCountReset(board(), move)) {
      fiftyMoveCount = 0;
    }

    setBoard((board) => {
      const newBoard = getNewBoard(board, move);

      updateThreefoldMap(threefoldRepetition, newBoard, mark);

      return newBoard;
    });

    mark = invertMark(mark);

    const checkmate = isCheckmate(board(), mark, canEnPassant);
    if (checkmate === WinnerWhite) {
      console.log("white win");

      setStatus("White win");
      break;
    } else if (checkmate === WinnerBlack) {
      console.log("black win");

      setStatus("Black win");
      break;
    }

    if (isStalemate(board(), mark, canEnPassant)) {
      console.log("stalemate");

      setStatus("Draw - stalemate");
      break;
    }

    if (!existsCheckmatePieces(board())) {
      console.log("no checkmate pieces");

      setStatus("Draw - insufficient material");
      break;
    }

    if (fiftyMoveCount > 100) {
      console.log("no capture and no pawn while 50 moves");

      setStatus("Draw - fifty-move rule");
      break;
    }
    fiftyMoveCount++;

    for (const [boardString, value] of threefoldRepetition) {
      if (value >= 3) {
        console.log("threefold repetition " + boardString);

        setStatus("Draw - threefold repetition");
        break mainLoop;
      }
    }

    if (mark === Black) {
      turn++;
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
