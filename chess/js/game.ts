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
  GameState,
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
} from "./types";
import { invertMark } from "./game/mark";
import {
  existsCheckmatePieces,
  isCheckmate,
  isFiftyMoveCountReset,
  isStalemate,
  updateThreefoldMap,
} from "./game/finish";
import { getNextBoard, getNextEnPassant } from "./game/get-next";
import { stateToFen } from "./game/fen";

export const gameLoop = async (
  players: Players,
  state: Accessor<GameState>,
  setState: Setter<GameState>,
  setMessage: Setter<string>,
) => {
  let mark: Mark = White;
  const castling: IsCastled = [true, true, true, true];
  let canEnPassant: false | Index = false;
  let fiftyMoveCount = 0;
  const threefoldRepetition = new Map<string, number>();

  initializeBoard(setState);

  console.log("start game");

  mainLoop: for (;;) {
    console.log(stateToFen(state()));

    const player = players[mark];

    setMessage(mark === Black ? "Black turn" : "White turn");

    const move = await player.getMove(state().board, mark, castling, canEnPassant);

    if (move.type === Reset) {
      break;
    }

    canEnPassant = getNextEnPassant(state().board, move);
    if (isFiftyMoveCountReset(state().board, move)) {
      fiftyMoveCount = 0;
    }

    setState((state) => {
      const newBoard = getNextBoard(state.board, move);

      updateThreefoldMap(threefoldRepetition, newBoard, mark);

      return {
        board: newBoard,
        mark: state.mark,
        castling: state.castling,
        enPassant: state.enPassant,
        fiftyMove: state.fiftyMove,
        threefold: state.threefold,
        moves: state.moves,
      };
    });

    mark = invertMark(mark);

    const checkmate = isCheckmate(state().board, mark, canEnPassant);
    if (checkmate === White) {
      console.log("white win");

      setMessage("White win");
      break;
    } else if (checkmate === Black) {
      console.log("black win");

      setMessage("Black win");
      break;
    }

    if (isStalemate(state().board, mark, canEnPassant)) {
      console.log("stalemate");

      setMessage("Draw - stalemate");
      break;
    }

    if (!existsCheckmatePieces(state().board)) {
      console.log("no checkmate pieces");

      setMessage("Draw - insufficient material");
      break;
    }

    if (fiftyMoveCount > 100) {
      console.log("no capture and no pawn while 50 moves");

      setMessage("Draw - fifty-move rule");
      break;
    }
    fiftyMoveCount++;

    for (const [boardString, value] of threefoldRepetition) {
      if (value >= 3) {
        console.log("threefold repetition " + boardString);

        setMessage("Draw - threefold repetition");
        break mainLoop;
      }
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
