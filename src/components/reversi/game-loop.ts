import { sleep } from "@/scripts/sleep";

import { HumanPlayer } from "./const";

import type { MultiPromise } from "@/scripts/multi-promise";
import type { ReversiWasmConnect } from "./get-wasm";

type Players = { black: number; white: number };

export const gameLoop = (
  wasm: ReversiWasmConnect,
  setBoard: (board: number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
) => {
  const { init, deinit, getBoard, move, isBlack, isEnd, ai } = wasm;

  let bp = init();
  let runGame = true;

  console.log("game start id(%d)", bp);

  const gameMove = async () => {
    let nextMove;
    if (isHuman(isBlack(bp), players)) {
      setBoard(getBoard(bp, true));

      nextMove = await humanInput.request();
    } else {
      setBoard(getBoard(bp, false));
      nextMove = ai(bp);
      await sleep(500);
    }

    move(bp, nextMove);
    setBoard(getBoard(bp, false));

    if (isEnd(bp)) {
      console.log("game end id(%d)", bp);
      deinit(bp);
      bp = 0;
    } else if (runGame) {
      setTimeout(() => {
        void gameMove();
      }, 0);
    }
  };

  setTimeout(() => {
    void gameMove();
  }, 0);

  return () => {
    console.log("game interrupted id(%d)", bp);
    deinit(bp);
    bp = 0;
    runGame = false;
  };
};

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === HumanPlayer) || (!isBlack && players.white === HumanPlayer);
};
