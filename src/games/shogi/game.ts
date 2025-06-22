import { createSignal } from "solid-js";

import { doNothingFunction } from "../../common/scripts/do-nothing.ts";
import { MultiPromise } from "../../common/scripts/multi-promise.ts";
import { usePromise } from "../../common/scripts/use-promise.ts";
import { BLACK, MOVE_TARGET, WHITE } from "./constants.ts";
import { gameLoop } from "./game-loop.ts";
import { getWasm } from "./wasm.ts";

import type { Accessor, Setter } from "solid-js";

import type { PlayerType } from "../../common/scripts/player.ts";
import type { Hand } from "./constants.ts";

type Board = readonly { moveTarget: boolean; piece: number }[];
type Game = {
  blackHands: Accessor<Hand>;
  board: Accessor<Board>;
  gameOver: Accessor<number>;
  handleBoardClick: (index: number) => void;
  promotion: Accessor<boolean>;
  resolve: (value: number) => void;
  setGameOver: Setter<number>;
  start: () => void;
  whiteHands: Accessor<Hand>;
};
export const createShogiGame = (white: Accessor<PlayerType>, black: Accessor<PlayerType>): Game => {
  const [board, setFullBoard] = createSignal<Board>(
    Array.from({ length: 81 }, () => ({ moveTarget: false, piece: 0 })),
  );
  const [whiteHands, setWhiteHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [blackHands, setBlackHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [gameOver, setGameOver] = createSignal<number>(0);
  const [promotion, setPromotion] = createSignal(false);
  const wasm = usePromise(getWasm);

  const setBoard = (board: readonly number[]): void => {
    setFullBoard(
      (
        previousBoard: readonly {
          readonly moveTarget: boolean;
          readonly piece: number;
        }[],
      ) => {
        const newBoard = previousBoard.map((element, index) => ({
          ...element,
          piece: board[index] ?? 0,
        }));

        return newBoard;
      },
    );
  };

  const setMove = (moves: readonly number[]): void => {
    setFullBoard(
      (
        previousBoard: readonly {
          readonly moveTarget: boolean;
          readonly piece: number;
        }[],
      ) => {
        const newBoard = previousBoard.map((element, index) => ({
          ...element,
          moveTarget: moves[index] === MOVE_TARGET,
        }));

        return newBoard;
      },
    );
  };

  const setHands = (hands: readonly [Hand, Hand]): void => {
    setWhiteHands(hands[0]);
    setBlackHands(hands[1]);
  };

  const { promise: humanInput, resolve } = MultiPromise.withResolvers<number>();

  let terminate = doNothingFunction;
  const start = (): void => {
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(
      wasmObject,
      doNothingFunction,
      setBoard,
      setGameOver,
      setMove,
      setHands,
      setPromotion,
      humanInput,
      {
        [BLACK]: white(),
        [WHITE]: black(),
      },
    );
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return {
    blackHands,
    board,
    gameOver,
    handleBoardClick,
    promotion,
    resolve,
    setGameOver,
    start,
    whiteHands,
  };
};
