import {
  BoardData,
  MoveTypes,
  Reset,
  Move,
  Empty,
  Castling,
  EnPassant,
  Promotion,
  Index,
  Resign,
  GameState,
  Mark,
  BlackPawn,
  WhitePawn,
  Black,
  IsCastled,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
} from "@/chess/js/types";
import { invertMark } from "./mark";
import { boardToFen, markToFen } from "./fen";
import { get_next_board, get_next_castling, get_next_en_passant } from "@/chess/wasm/pkg/chess_wasm";
import {
  convertBoardToWasmBoard,
  convertCastlingToWasmCastling,
  convertMoveToWasmMove,
  convertWasmBoardToBoard,
  convertWasmCastlingToCastling,
  convertWasmEnPassantToEnPassant,
} from "../wasm-convert";

export const getNextState = (
  state: GameState,
  move: MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion,
): GameState => {
  const wasmMove = convertMoveToWasmMove(move).join(" ");
  const wasmBoard = convertBoardToWasmBoard(state.board);
  const nextBoard = convertWasmBoardToBoard(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_board(wasmBoard, wasmMove),
  );
  const nextCastling = convertWasmCastlingToCastling(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_castling(convertCastlingToWasmCastling(state.castling), wasmMove),
  );
  const nextEnPassant = convertWasmEnPassantToEnPassant(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_en_passant(wasmBoard, wasmMove),
  );

  return {
    board: nextBoard,
    mark: invertMark(state.mark),
    castling: nextCastling,
    enPassant: nextEnPassant,
    fiftyMove: getNextFiftyMove(state.fiftyMove, state.board, move),
    threefold: getNextThreefoldMap(state.threefold, nextBoard, state.mark),
    moves: nextMoves(state.moves, state.mark),
  };
};

export const getNextBoard = (board: BoardData, move: MoveTypes): BoardData => {
  const newBoard: BoardData = [...board];

  switch (move.type) {
    case Reset:
    case Resign: {
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

export const getNextCastling = (castling: IsCastled, move: MoveTypes): IsCastled => {
  const nextCastling: IsCastled = [...castling];

  if (move.type === Castling) {
    if (move.rook === 0 || move.rook === 7) {
      nextCastling[0] = false;
      nextCastling[1] = false;
    } else {
      nextCastling[2] = false;
      nextCastling[3] = false;
    }
  } else if (move.type === Move) {
    if (move.from === 4 || move.to === 4) {
      nextCastling[0] = false;
      nextCastling[1] = false;
    }
    if (move.from === 60 || move.to === 60) {
      nextCastling[2] = false;
      nextCastling[3] = false;
    }
    if (move.from === 0 || move.to === 0) {
      nextCastling[0] = false;
    }
    if (move.from === 7 || move.to === 7) {
      nextCastling[1] = false;
    }
    if (move.from === 56 || move.to === 56) {
      nextCastling[2] = false;
    }
    if (move.from === 63 || move.to === 63) {
      nextCastling[3] = false;
    }
  }

  return nextCastling;
};

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

export const getNextFiftyMove = (fiftyMove: number, board: BoardData, move: MoveTypes): number => {
  return move.type === EnPassant ||
    move.type === Promotion ||
    (move.type === Move &&
      (board[move.to] !== Empty || board[move.from] === BlackPawn || board[move.from] === WhitePawn))
    ? 0
    : fiftyMove + 1;
};

export const getNextThreefoldMap = (
  threefoldMap: Map<string, number>,
  board: BoardData,
  mark: Mark,
): Map<string, number> => {
  const newMap = new Map(threefoldMap);

  const boardString = `${boardToFen(board)} ${markToFen(mark)}`;
  newMap.set(boardString, (newMap.get(boardString) ?? 0) + 1);

  return newMap;
};

export const nextMoves = (moves: number, mark: Mark): number => {
  return mark === Black ? moves + 1 : moves;
};
