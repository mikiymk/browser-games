import type { MultiPromise } from "@/scripts/multi-promise";
import { sleep } from "@/scripts/sleep";
import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { CellBlack, CellEmpty, CellWhite, HumanPlayer } from "./const";
import type { ReversiWasmConnect } from "./get-wasm";

const AI_SLEEP_TIME_MS = 500;

type Players = { readonly black: number; readonly white: number };

type GameObject = {
  terminate: () => void;
  color: Accessor<number>;
};

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === HumanPlayer) || (!isBlack && players.white === HumanPlayer);
};

export const gameLoop = (
  wasm: ReversiWasmConnect,
  setBoard: (board: readonly number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
  onEnd: () => void,
): GameObject => {
  const { init, deinit, getBoard, move, isBlack, isEnd, ai } = wasm;
  const [color, setColor] = createSignal(CellEmpty);

  let bp = init();

  console.log(`game start id(${bp})`);

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
    console.log(`game end id(${bp})`);
    deinit(bp);
    bp = 0;
    onEnd();
  };

  const gameMove = async (): Promise<void> => {
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
    terminate,
    color,
  };
};
