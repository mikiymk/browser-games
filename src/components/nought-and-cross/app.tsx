import { createSignal, onMount } from "solid-js";

import {} from "@/games/nought-and-cross/game";
import { filledBoard, gameLoop, isWin } from "@/games/nought-and-cross/game-model";
import {
  NnCStatusDraw,
  NnCStatusNextO,
  NnCStatusNextX,
  NnCStatusNone,
  NnCStatusOWin,
  NnCStatusXWin,
  OMark,
  XMark,
} from "@/games/nought-and-cross/types";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";

import { Board } from "./board";
import { Controller } from "./controller";
import { History } from "./history";

import type { NnCStatus } from "@/games/nought-and-cross/types";
import type { PlayerType } from "@/scripts/player";

import { CellEmpty } from "../reversi/const";

export const App = () => {
  const [board, setBoardData] = createSignal<number[]>([]);
  const [mark, setMark] = createSignal(OMark);
  const [history, setHistory] = createSignal<number[]>([]);

  const [playerO, setPlayerO] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerX, setPlayerX] = createSignal<PlayerType>(PlayerTypeAI);

  let terminate = doNothingFunction;
  let resolve: (value: number) => void = doNothingFunction;

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleClick = (index: number) => {
    if (board()[index] !== CellEmpty) {
      return;
    }

    resolve(index);
  };

  const reset = () => {
    terminate();

    const players = {
      O: playerO(),
      X: playerX(),
    };

    terminate = gameLoop(setBoardData, setMark, setHistory, humanInput, players).terminate;
  };

  onMount(reset);

  const status = (): NnCStatus => {
    if (isWin(board(), OMark)) {
      return NnCStatusOWin;
    } else if (isWin(board(), XMark)) {
      return NnCStatusXWin;
    } else if (filledBoard(board())) {
      return NnCStatusDraw;
    } else if (mark() === OMark) {
      return NnCStatusNextO;
    } else if (mark() === XMark) {
      return NnCStatusNextX;
    } else {
      return NnCStatusNone;
    }
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
