import { Empty, BlackPawn, WhitePawn, Black } from "@/chess/js/types";
import { get_next_board, get_next_castling, get_next_en_passant } from "@/chess/wasm/pkg/chess_wasm";

import { boardToFen, markToFen } from "./fen";
import { invertMark } from "./mark";

import type {
  BoardData,
  MoveTypes,
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
  convertPositionToIndex,
  convertWasmBoardToBoard,
  convertWasmCastlingToCastling,
} from "../wasm-convert";

export const getNextState = (
  state: GameState,
  move: MoveTypeMove | MoveTypeCastling | MoveTypeEnPassant | MoveTypePromotion,
): GameState => {
  const wasmMove = move.join(" ");
  const wasmBoard = convertBoardToWasmBoard(state.board);
  const nextBoard = convertWasmBoardToBoard(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_board(wasmBoard, wasmMove),
  );
  const nextCastling = convertWasmCastlingToCastling(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_castling(convertCastlingToWasmCastling(state.castling), wasmMove),
  );
  const nextEnPassant =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    get_next_en_passant(wasmBoard, wasmMove);

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

export const getNextFiftyMove = (fiftyMove: number, board: BoardData, move: MoveTypes): number => {
  return move[0] === "e" ||
    move[0] === "p" ||
    (move[0] === "m" &&
      (board[convertPositionToIndex(move[2])] !== Empty ||
        board[convertPositionToIndex(move[1])] === BlackPawn ||
        board[convertPositionToIndex(move[1])] === WhitePawn))
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
