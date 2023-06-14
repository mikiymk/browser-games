import { Setter } from "solid-js";
import {
  GameState,
  Index,
  InputType,
  Mark,
  MoveTypes,
  Player,
  Promotion,
  PromotionPieces,
  Receiver,
  Reset,
  Resign,
  Sender,
} from "./types";
import { getCastling, getLegalMoves, getPiecesLegalMoves } from "./game/get-moves";
import { generateMovePromotion } from "./game/generate-move";
import { getMark } from "./game/mark";
import { randomSelect } from "@/common/random-select";

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

        const moves = [...getLegalMoves(board, enPassant, from)];
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
            const piece = await promotionInput();
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

export const aiPlayer: Player = {
  async getMove({ board, mark, castling, enPassant }: GameState): Promise<MoveTypes> {
    const moves = [...getPiecesLegalMoves(board, mark, enPassant), ...getCastling(board, castling, mark)];

    await sleep(100);

    return randomSelect(moves) ?? { type: Resign };
  },
};

const sleep = (millisecond: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), millisecond));
