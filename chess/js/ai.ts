import { Setter } from "solid-js";
import { getMoves } from "./game";
import {
  BoardData,
  Castling,
  EnPassant,
  Index,
  InputType,
  IsCastled,
  Mark,
  Move,
  Player,
  Promotion,
  Receiver,
  Reset,
  Sender,
} from "./types";

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

export const createHumanPlayer = (input: Receiver<InputType>, setMovable: Setter<Index[]>): Player => {
  return {
    async getMove(board: BoardData, mark: Mark, castling: IsCastled, canEnPassant: false | Index) {
      for (;;) {
        const from = await input();
        if (from === Reset) {
          return { type: Reset };
        }

        const moves = getMoves(board, canEnPassant, from);

        setMovable(
          [...moves].flatMap((move) => {
            if (move.type === Move || move.type === EnPassant || move.type === Promotion) {
              return [move.to];
            }
            if (move.type === Castling) {
              return [move.rook];
            }
            return [];
          }),
        );

        const to = await input();
        if (to === Reset) {
          return { type: Reset };
        }
        return { type: Move, from, to };
      }
    },
  };
};
