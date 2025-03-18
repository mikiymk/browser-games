import { Start } from "@/components/header-buttons/start";
import { PageBody } from "@/components/page/body";
import { PageHeader } from "@/components/page/header";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { usePromise } from "@/scripts/use-promise";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import type { JSXElement } from "solid-js";
import { createSignal, onMount } from "solid-js";
import {
  BLACK,
  STATUS_DRAW,
  STATUS_NONE,
  STATUS_PLAY_BLACK,
  STATUS_PLAY_WHITE,
  STATUS_WIN_BLACK,
  STATUS_WIN_WHITE,
  WHITE,
} from "../constants";
import type { EndType, GameStatus, PlayerColor } from "../constants";
import { startGame } from "../game-body";
import { getWasm } from "../wasm";
import { NncBoard } from "./board";
import { History } from "./history";
import { NoughtAndCrossSettings } from "./settings";
import { StatusButton } from "./status";

export const App = (): JSXElement => {
  const [playerO, setPlayerO] = createUrlQuerySignal<PlayerType>("o", PlayerTypeHuman);
  const [playerX, setPlayerX] = createUrlQuerySignal<PlayerType>("x", PlayerTypeAi);

  const [board, setBoardData] = createSignal<readonly number[]>([]);
  const [history] = createSignal<readonly number[]>([]);

  const wasm = usePromise(getWasm);
  const { resolve, promise } = MultiPromise.withResolvers<number>();
  const [status, setStatus] = createSignal<GameStatus>(STATUS_NONE);
  const setColor = (color: PlayerColor): void => {
    setStatus(color === WHITE ? STATUS_PLAY_WHITE : STATUS_PLAY_BLACK);
  };
  const setEnd = (end: EndType): void => {
    setStatus(end === WHITE ? STATUS_WIN_WHITE : end === BLACK ? STATUS_WIN_BLACK : STATUS_DRAW);
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
      setBoard: setBoardData,
      setColor: setColor,
      setEnd: setEnd,
      requestInput: () => promise.request(),
      players: {
        [WHITE]: playerO(),
        [BLACK]: playerX(),
      },
    });
  };

  onMount(reset);

  return (
    <>
      <PageHeader
        buttons={
          <>
            <StatusButton status={status()} />
            <Start start={reset} />
            <History history={history()} />
            <NoughtAndCrossSettings o={playerO()} x={playerX()} setO={setPlayerO} setX={setPlayerX} />
          </>
        }
      />
      <PageBody>
        <NncBoard board={board()} click={handleClick} />
      </PageBody>
    </>
  );
};
