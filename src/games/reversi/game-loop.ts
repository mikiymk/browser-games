import type { Accessor } from "solid-js";

import { createSignal } from "solid-js";

import type { MultiPromise } from "../../common/scripts/multi-promise.ts";
import type { PlayerType } from "../../common/scripts/player.ts";
import type { ReversiWasmConnect } from "./get-wasm.ts";

import { PlayerTypeHuman } from "../../common/scripts/player.ts";
import { sleep } from "../../common/scripts/sleep.ts";
import { CellBlack, CellEmpty, CellWhite } from "./const.ts";

const AI_SLEEP_TIME_MS = 500;

type GameObject = {
  color: Accessor<number>;
  terminate: () => void;
};

type Players = { readonly black: PlayerType; readonly white: PlayerType };

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === PlayerTypeHuman) || (!isBlack && players.white === PlayerTypeHuman);
};

export const gameLoop = (
  wasm: ReversiWasmConnect,
  setBoard: (board: readonly number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
  onEnd: () => void,
): GameObject => {
  const { ai, deinit, getBoard, init, isBlack, isEnd, move } = wasm;
  const [color, setColor] = createSignal(CellEmpty);

  let bp = init();

  const updateColor = (): void => {
    if (bp === 0) {
      setColor(CellEmpty);
    } else if (isBlack(bp)) {
      setColor(CellBlack);
    } else {
      setColor(CellWhite);
    }
  };

  const terminate = (): void => {
    deinit(bp);
    bp = 0;
    onEnd();
  };

  const gameMove = async (): Promise<void> => {
    let nextMove: number;
    if (isHuman(isBlack(bp), players)) {
      setBoard(getBoard(bp, true));

      nextMove = await humanInput.request();
    } else {
      setBoard(getBoard(bp, false));
      nextMove = ai(bp);
      await sleep(AI_SLEEP_TIME_MS);
    }

    move(bp, nextMove);
    setBoard(getBoard(bp, false));
    updateColor();

    if (isEnd(bp)) {
      terminate();
    }

    if (bp !== 0) {
      setTimeout(() => {
        void gameMove();
      }, 0);
    }
  };

  setTimeout(() => {
    updateColor();
    void gameMove();
  }, 0);

  return {
    color,
    terminate,
  };
};
