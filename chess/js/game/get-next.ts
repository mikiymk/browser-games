import {
  Reset,
  Move,
  Empty,
  Castling,
  EnPassant,
  Promotion,
  Resign,
  BlackPawn,
  WhitePawn,
  Black,
} from "@/chess/js/types";
import { get_next_board, get_next_castling, get_next_en_passant } from "@/chess/wasm/pkg/chess_wasm";

import { boardToFen, markToFen } from "./fen";
import { invertMark } from "./mark";

import type {
  BoardData,
  MoveTypes,
  Index,
  GameState,
  Mark,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
} from "@/chess/js/types";

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
