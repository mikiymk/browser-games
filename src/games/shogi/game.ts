import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import type { PlayerType } from "@/scripts/player";
import { usePromise } from "@/scripts/use-promise";
import { createSignal } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import type { Hand } from "./constants.ts";
import { BLACK, MOVE_TARGET, WHITE } from "./constants.ts";
import { gameLoop } from "./game-loop.ts";
import { getWasm } from "./wasm.ts";

type Board = readonly { piece: number; moveTarget: boolean }[];
type Game = {
  board: Accessor<Board>;
  whiteHands: Accessor<Hand>;
  blackHands: Accessor<Hand>;
  gameOver: Accessor<number>;
  promotion: Accessor<boolean>;
  start: () => void;
  handleBoardClick: (index: number) => void;
  setGameOver: Setter<number>;
  resolve: (value: number) => void;
};
export const createGame = (white: Accessor<PlayerType>, black: Accessor<PlayerType>): Game => {
  const [board, setFullBoard] = createSignal<Board>(
    Array.from({ length: 81 }, () => ({ piece: 0, moveTarget: false })),
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
          readonly piece: number;
          readonly moveTarget: boolean;
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
          readonly piece: number;
          readonly moveTarget: boolean;
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

  const { resolve, promise: humanInput } = MultiPromise.withResolvers<number>();

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
        [WHITE]: black(),
        [BLACK]: white(),
      },
    );
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return {
    board,
    whiteHands,
    blackHands,
    gameOver,
    promotion,
    start,
    handleBoardClick,
    setGameOver,
    resolve,
  };
};
