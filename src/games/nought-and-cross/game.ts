import { createSignal, onMount } from "solid-js";

import { doNothingFunction } from "../../common/scripts/do-nothing.ts";
import { MultiPromise } from "../../common/scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../common/scripts/player.ts";
import { usePromise } from "../../common/scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../common/scripts/use-url-query.ts";
import {
  CROSS,
  END_CROSS_WIN,
  END_DRAW,
  END_NOUGHT_WIN,
  END_PLAYING,
  NOUGHT,
  STATUS_DRAW,
  STATUS_NONE,
  STATUS_PLAY_CROSS,
  STATUS_PLAY_NOUGHT,
  STATUS_WIN_CROSS,
  STATUS_WIN_NOUGHT,
} from "./constants.ts";
import { startGame } from "./game-body.ts";
import { getWasm } from "./wasm.ts";

import type { Accessor, Setter } from "solid-js";

import type { PlayerType } from "../../common/scripts/player.ts";
import type { EndType, GameStatus, PlayerColor } from "./constants.ts";

type NoughtAndCrossGame = {
  board: Accessor<readonly number[]>;
  handleClick: (index: number) => void;
  history: Accessor<readonly number[]>;
  playerO: Accessor<PlayerType>;
  playerX: Accessor<PlayerType>;
  reset: () => void;
  setPlayerO: Setter<PlayerType>;
  setPlayerX: Setter<PlayerType>;
  status: Accessor<GameStatus>;
};

export const createNoughtAndCrossGame = (): NoughtAndCrossGame => {
  const [playerO, setPlayerO] = createUrlQuerySignal<PlayerType>("o", PlayerTypeHuman);
  const [playerX, setPlayerX] = createUrlQuerySignal<PlayerType>("x", PlayerTypeAi);

  const [board, setBoardData] = createSignal<readonly number[]>([]);
  const [history] = createSignal<readonly number[]>([]);

  const wasm = usePromise(getWasm);
  const { promise, resolve } = MultiPromise.withResolvers<number>();
  const [status, setStatus] = createSignal<GameStatus>(STATUS_NONE);
  const setColor = (color: PlayerColor): void => {
    setStatus(color === NOUGHT ? STATUS_PLAY_NOUGHT : STATUS_PLAY_CROSS);
  };
  const setEnd = (end: EndType): void => {
    switch (end) {
      case END_CROSS_WIN:
        setStatus(STATUS_WIN_CROSS);
        break;
      case END_DRAW:
        setStatus(STATUS_DRAW);
        break;
      case END_NOUGHT_WIN:
        setStatus(STATUS_WIN_NOUGHT);
        break;
      case END_PLAYING:
        break;
      default: {
        const _exhaustiveCheck: never = end;
      }
    }
  };

  let terminate = doNothingFunction;

  const handleClick = (index: number): void => {
    if (board()[index] !== 0) {
      return;
    }

    resolve(index);
  };

  const reset = (): void => {
    terminate();
    const wasmBody = wasm();
    if (!wasmBody) {
      return;
    }

    terminate = startGame({
      game: wasmBody,
      players: {
        [CROSS]: playerX(),
        [NOUGHT]: playerO(),
      },
      requestInput: () => promise.request(),
      setBoard: setBoardData,
      setColor,
      setEnd,
    });
  };

  onMount(reset);

  return { board, handleClick, history, playerO, playerX, reset, setPlayerO, setPlayerX, status };
};
