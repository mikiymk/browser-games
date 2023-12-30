import { filledBoard, gameLoop, isWin } from "@/games/nought-and-cross/game-model";
import {
  Empty,
  MarkO,
  MarkX,
  StatusDraw,
  StatusNextO,
  StatusNextX,
  StatusNone,
  StatusWinO,
  StatusWinX,
} from "@/games/nought-and-cross/types";
import type { Status } from "@/games/nought-and-cross/types";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { createSignal, onMount } from "solid-js";
import { Board } from "./board";
import { Controller } from "./controller";
import { History } from "./history";

export const App = () => {
  const [board, setBoardData] = createSignal<number[]>([]);
  const [mark, setMark] = createSignal(MarkO);
  const [history, setHistory] = createSignal<number[]>([]);

  const [playerO, setPlayerO] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerX, setPlayerX] = createSignal<PlayerType>(PlayerTypeAi);

  let terminate = doNothingFunction;
  let resolve: (value: number) => void = doNothingFunction;

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleClick = (index: number) => {
    if (board()[index] !== Empty) {
      return;
    }

    resolve(index);
  };

  const reset = () => {
    terminate();

    const players = {
      o: playerO(),
      x: playerX(),
    };

    terminate = gameLoop(setBoardData, setMark, setHistory, humanInput, players).terminate;
  };

  onMount(reset);

  const status = (): Status => {
    if (isWin(board(), MarkO)) {
      return StatusWinO;
    }
    if (isWin(board(), MarkX)) {
      return StatusWinX;
    }
    if (filledBoard(board())) {
      return StatusDraw;
    }
    if (mark() === MarkO) {
      return StatusNextO;
    }
    if (mark() === MarkX) {
      return StatusNextX;
    }

    return StatusNone;
  };

  return (
    <>
      <Board board={board()} click={handleClick} />

      <Controller
        statusMessage={status()}
        onReset={reset}
        playerO={playerO()}
        playerX={playerX()}
        setPlayerO={setPlayerO}
        setPlayerX={setPlayerX}
      />
      <History history={history()} />
    </>
  );
};
