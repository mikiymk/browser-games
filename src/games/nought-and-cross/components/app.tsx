import type { JSXElement } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { Start } from "../../../components/header-buttons/start.tsx";
import { PageBody } from "../../../components/page/body.tsx";
import { PageHeader } from "../../../components/page/header.tsx";
import { doNothingFunction } from "../../../scripts/do-nothing.ts";
import { MultiPromise } from "../../../scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";
import { usePromise } from "../../../scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
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
} from "../constants.ts";
import type { EndType, GameStatus, PlayerColor } from "../constants.ts";
import { startGame } from "../game-body.ts";
import { getWasm } from "../wasm.ts";
import { NncBoard } from "./board.tsx";
import { History } from "./history.tsx";
import { NoughtAndCrossSettings } from "./settings.tsx";
import { StatusButton } from "./status.tsx";

export const App = (): JSXElement => {
  const [playerO, setPlayerO] = createUrlQuerySignal<PlayerType>("o", PlayerTypeHuman);
  const [playerX, setPlayerX] = createUrlQuerySignal<PlayerType>("x", PlayerTypeAi);

  const [board, setBoardData] = createSignal<readonly number[]>([]);
  const [history] = createSignal<readonly number[]>([]);

  const wasm = usePromise(getWasm);
  const { resolve, promise } = MultiPromise.withResolvers<number>();
  const [status, setStatus] = createSignal<GameStatus>(STATUS_NONE);
  const setColor = (color: PlayerColor): void => {
    setStatus(color === NOUGHT ? STATUS_PLAY_NOUGHT : STATUS_PLAY_CROSS);
  };
  const setEnd = (end: EndType): void => {
    switch (end) {
      case END_PLAYING:
        break;
      case END_NOUGHT_WIN:
        setStatus(STATUS_WIN_NOUGHT);
        break;
      case END_CROSS_WIN:
        setStatus(STATUS_WIN_CROSS);
        break;
      case END_DRAW:
        setStatus(STATUS_DRAW);
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
      setBoard: setBoardData,
      setColor,
      setEnd,
      requestInput: () => promise.request(),
      players: {
        [NOUGHT]: playerO(),
        [CROSS]: playerX(),
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
