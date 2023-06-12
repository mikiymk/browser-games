import { Setter } from "solid-js";
import {
  BoardData,
  Index,
  InputType,
  IsCastled,
  Mark,
  Player,
  Promotion,
  PromotionPieces,
  Receiver,
  Reset,
  Sender,
} from "./types";
import { getCastling, getMoves } from "./game/get-moves";
import { generateMovePromotion } from "./game/generate-move";

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
  propotionInput: Receiver<PromotionPieces>,
  openPromotionMark: Setter<Mark>,
): Player => {
  return {
    async getMove(board: BoardData, mark: Mark, castling: IsCastled, canEnPassant: false | Index) {
      for (;;) {
        const from = await input();
        if (from === Reset) {
          return { type: Reset };
        }

        const moves = [...getMoves(board, canEnPassant, from)];
        const castlingMoves = from === 4 || from === 60 ? [...getCastling(board, castling, mark)] : [];

        if (moves.length === 0 && castlingMoves.length === 0) {
          continue;
        }

        setMovable([...moves.map((move) => move.to), ...castlingMoves.map((move) => move.rook)]);

        const to = await input();
        setMovable([]);
        if (to === Reset) {
          return { type: Reset };
        }

        const toMove = moves.find((move) => move.to === to);
        if (toMove !== undefined) {
          if (toMove.type === Promotion) {
            openPromotionMark(mark);
            const piece = await propotionInput();
            return generateMovePromotion(from, to, piece);
          }
          return toMove;
        }

        const toCastlingMove = castlingMoves.find((move) => move.rook === to);
        if (toCastlingMove !== undefined) {
          return toCastlingMove;
        }
      }
    },
  };
};
