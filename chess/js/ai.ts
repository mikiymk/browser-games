import { get_ai_ply, get_selected_piece_moves } from "@/chess/wasm/pkg/chess_wasm";

import { generateMovePromotion } from "./game/generate-move";
import { getMark } from "./game/mark";
import { Reset } from "./types";
import {
  convertBoardToWasmBoard,
  convertIndexToPosition,
  convertPieceToWasmPiece,
  convertPositionToIndex,
  convertWasmMoveToMove,
} from "./wasm-convert";

import type { Setter } from "solid-js";
import type { GameState, Index, InputType, Mark, MoveTypes, Player, PromotionPieces, Receiver, Sender } from "./types";

export const createMessenger = <T>(): [Sender<T>, Receiver<T>] => {
  let resolveFunction = (value: T): void => void value;

  const sender: Sender<T> = (value) => {
    resolveFunction(value);
  };

  const receiver = () => {
    return new Promise<T>((resolve) => {
      resolveFunction = resolve;
    });
  };

  return [sender, receiver];
};

export const createHumanPlayer = (
  input: Receiver<InputType>,
  setMovable: Setter<Index[]>,
  promotionInput: Receiver<PromotionPieces>,
  openPromotionMark: Setter<Mark | undefined>,
): Player => {
  return {
    async getMove({ board, mark, castling, enPassant }: GameState): Promise<MoveTypes> {
      for (;;) {
        const from = await input();
        if (from === Reset) {
          return ["reset"];
        }

        if (getMark(board[from]) !== mark) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const w_moves: string = get_selected_piece_moves(
          from,
          mark,
          convertBoardToWasmBoard(board),
          enPassant,
          castling,
        );

        const movable = w_moves
          .split(":")
          .filter(Boolean)
          .map((value) => convertWasmMoveToMove(value));

        if (movable.length === 0) {
          continue;
        }

        setMovable(movable.map((move) => convertPositionToIndex(move[2])));

        const to = await input();
        setMovable([]);
        if (to === Reset) {
          return ["reset"];
        }

        const toMove = movable.find((move) => convertPositionToIndex(move[2]) === to);
        if (toMove !== undefined) {
          if (toMove[0] === "p") {
            openPromotionMark(mark);
            const piece = await promotionInput();
            return generateMovePromotion(
              convertIndexToPosition(from),
              convertIndexToPosition(to),
              convertPieceToWasmPiece(piece),
            );
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
    const move = get_ai_ply(convertBoardToWasmBoard(state.board), state.mark, state.castling, state.enPassant, 2);

    console.timeEnd("get move");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return convertWasmMoveToMove(move);
  },
};
