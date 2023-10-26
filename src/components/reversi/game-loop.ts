import { createSignal } from "solid-js";

import { sleep } from "@/scripts/sleep";

import { CellBlack, CellEmpty, CellWhite, HumanPlayer } from "./const";

import type { MultiPromise } from "@/scripts/multi-promise";
import type { ReversiWasmConnect } from "./get-wasm";

const AI_SLEEP_TIME_MS = 500;

type Players = { black: number; white: number };

export const gameLoop = (
  wasm: ReversiWasmConnect,
  setBoard: (board: number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
  onEnd: () => void,
) => {
  const { init, deinit, getBoard, move, isBlack, isEnd, ai } = wasm;
  const [color, setColor] = createSignal(CellEmpty);

  let bp = init();

  console.log(`game start id(${bp})`);

  const updateColor = (): void => {
    if (bp === 0) setColor(CellEmpty);
    else if (isBlack(bp)) setColor(CellBlack);
    else setColor(CellWhite);
  };

  const terminate = () => {
    console.log(`game end id(${bp})`);
    deinit(bp);
    bp = 0;
    onEnd();
  };

  const gameMove = async () => {
    let nextMove;
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

    if (bp) {
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
    terminate,
    color,
  };
};

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === HumanPlayer) || (!isBlack && players.white === HumanPlayer);
};
