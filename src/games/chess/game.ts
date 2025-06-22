import { createSignal } from "solid-js";

import { doNothingFunction } from "../../common/scripts/do-nothing.ts";
import { MultiPromise } from "../../common/scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../common/scripts/player.ts";
import { usePromise } from "../../common/scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../common/scripts/use-url-query.ts";
import { createBoard } from "../english-draughts/boards.ts";
import { CellEmpty, EndNotYet, White } from "./constants.ts";
import { gameLoop, getWasm } from "./game-loop.ts";

import type { Accessor, Setter } from "solid-js";

import type { PlayerType } from "../../common/scripts/player.ts";

export type BoardCell = {
  readonly mark: number;
  readonly piece: number;
};

type ChessGame = {
  black: Accessor<PlayerType>;
  board: Accessor<readonly BoardCell[]>;
  color: Accessor<number>;
  end: Accessor<number>;
  handleClick: (_square: BoardCell, index: number) => void;
  setBlack: Setter<PlayerType>;
  setWhite: Setter<PlayerType>;
  start: () => void;
  white: Accessor<PlayerType>;
};

export const createChessGame = (): ChessGame => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [board, setBoard] = createSignal<readonly BoardCell[]>(
    createBoard(8, 8, { mark: CellEmpty, piece: CellEmpty }),
  );

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(EndNotYet);

  const wasm = usePromise(getWasm);
  const { promise: humanInput, resolve } = MultiPromise.withResolvers<number>();

  let terminate = doNothingFunction;

  const setPiece = (pieces: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ mark: v.mark, piece: pieces[index] }) as BoardCell);
    });
  };

  const setMark = (marks: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ mark: marks[index], piece: v.piece }) as BoardCell);
    });
  };

  return {
    black,
    board,
    color,
    end,
    handleClick: (_square: BoardCell, index: number): void => {
      resolve(index);
    },
    setBlack,
    setWhite,
    start: (): void => {
      terminate();

      const wasmObject = wasm();
      if (wasmObject === undefined) {
        return;
      }
      terminate = gameLoop(wasmObject, setColor, setPiece, setEnd, setMark, humanInput, {
        black: black(),
        white: white(),
      });
    },
    white,
  };
};
