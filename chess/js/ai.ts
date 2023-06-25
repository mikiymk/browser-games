import { get_ai_ply, get_selected_piece_moves } from "@/chess/wasm/pkg/chess_wasm";

import { generateMovePromotion } from "./game/generate-move";
import { getMark } from "./game/mark";
import { Castling, Promotion, Reset } from "./types";
import {
  convertMarkToWasmMark,
  convertBoardToWasmBoard,
  convertEnPassantToWasmEnPassant,
  convertCastlingToWasmCastling,
  convertWasmMoveToMove,
} from "./wasm-convert";

import type { GameState, Index, InputType, Mark, MoveTypes, Player, PromotionPieces, Receiver, Sender } from "./types";
import type { Setter } from "solid-js";

export const createMessenger = <T>(): [Sender<T>, Receiver<T>] => {
  let resolveFunction = (value: T): void => void value;

  const sender: Sender<T> = (value) => {
    resolveFunction(value);
  };

  const receiver = () => {
    return new Promise<T>((resolve) => (resolveFunction = resolve));
  };

  return [sender, receiver];
};

export const createHumanPlayer = (
  input: Receiver<InputType>,
  setMovable: Setter<Index[]>,
  promotionInput: Receiver<PromotionPieces>,
  openPromotionMark: Setter<Mark>,
): Player => {
  return {
    async getMove({ board, mark, castling, enPassant }: GameState): Promise<MoveTypes> {
      for (;;) {
        const from = await input();
        if (from === Reset) {
          return { type: Reset };
        }

        if (getMark(board[from]) !== mark) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const w_moves: string = get_selected_piece_moves(
          from,
          convertMarkToWasmMark(mark),
          convertBoardToWasmBoard(board),
          convertEnPassantToWasmEnPassant(enPassant),
          convertCastlingToWasmCastling(castling),
        );

        const movable = w_moves
          .split(":")
          .filter(Boolean)
          .map((value) => convertWasmMoveToMove(value));

        if (movable.length === 0) {
          continue;
        }

        setMovable(movable.map((move) => (move.type === Castling ? move.rook : move.to)));

        const to = await input();
        setMovable([]);
        if (to === Reset) {
          return { type: Reset };
        }

        const toMove = movable.find((move) => (move.type === Castling ? move.rook : move.to) === to);
        if (toMove !== undefined) {
          if (toMove.type === Promotion) {
            openPromotionMark(mark);
            const piece = await promotionInput();
            return generateMovePromotion(from, to, piece);
          }
          return toMove;
        }
      }
    },
  };
};

export const aiPlayer: Player = {
  getMove(state: GameState): MoveTypes {
    console.time("get move");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const move = get_ai_ply(
      convertBoardToWasmBoard(state.board),
      convertMarkToWasmMark(state.mark),
      convertCastlingToWasmCastling(state.castling),
      convertEnPassantToWasmEnPassant(state.enPassant),
    );

    console.timeEnd("get move");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return convertWasmMoveToMove(move);
  },
};
