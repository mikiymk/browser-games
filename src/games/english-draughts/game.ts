import type { Accessor, Setter } from "solid-js";

import { createSignal, mapArray } from "solid-js";

import type { PlayerType } from "../../common/scripts/player.ts";
import type { PlayerColor } from "./game-loop.ts";

import { MultiPromise } from "../../common/scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../common/scripts/player.ts";
import { usePromise } from "../../common/scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../common/scripts/use-url-query.ts";
import { createBoard } from "./boards.ts";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "./constants.ts";
import { gameLoop } from "./game-loop.ts";
import { getWasm } from "./wasm.ts";

type EnglishDraughtsGame = {
  black: Accessor<PlayerType>;
  boardNumber: () => number[];
  handleClick: (square: number, index: number) => void;
  handleStart: () => void;
  setBlack: Setter<PlayerType>;
  setWhite: Setter<PlayerType>;
  white: Accessor<PlayerType>;
};

export const createEnglishDraughtsGame = (): EnglishDraughtsGame => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [boardData, setBoardData] = createSignal<{ move: number; stone: number }[]>(
    createBoard(8, 8, { move: 0, stone: 0 }),
  );
  const [color, setColor] = createSignal<PlayerColor>("white");
  const boardNumber = mapArray(boardData, (value) => {
    if (value.move === MOVE_TARGET) {
      return MOVE_TARGET;
    }

    return value.stone;
  });

  const wasm = usePromise(getWasm);
  const { promise, resolve } = MultiPromise.withResolvers<number>();

  let terminate: (() => void) | undefined;

  const handleStart = (): void => {
    terminate?.();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }

    terminate = gameLoop(wasmObject, {
      players: {
        black: black(),
        white: white(),
      },
      requestInput: () => promise.request(),
      setBoard: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, stone: newBoard[index] ?? 0 }));
        });
      },
      setColor: (color) => {
        setColor(color);
      },

      setEnd: () => {
        // do nothing
      },
      setMove: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, move: newBoard[index] ?? 0 }));
        });
      },
    });
  };

  const handleClick = (square: number, index: number): void => {
    if (
      ((square === COLOR_PAWN_WHITE || square === COLOR_KING_WHITE) && color() === "white") ||
      ((square === COLOR_PAWN_BLACK || square === COLOR_KING_BLACK) && color() === "black")
    ) {
      resolve(index);
    }
  };

  return { black, boardNumber, handleClick, handleStart, setBlack, setWhite, white };
};
