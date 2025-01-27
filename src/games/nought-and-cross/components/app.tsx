import { Start } from "@/components/header-buttons/start";
import { PageBody } from "@/components/page/body";
import { PageHeader } from "@/components/page/header";
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
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import type { JSXElement } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { NncBoard } from "./board";
import { History } from "./history";
import { NoughtAndCrossSettings } from "./settings";
import { StatusButton } from "./status";

export const App = (): JSXElement => {
  const [playerO, setPlayerO] = createUrlQuerySignal<PlayerType>("o", PlayerTypeHuman);
  const [playerX, setPlayerX] = createUrlQuerySignal<PlayerType>("x", PlayerTypeAi);

  const [board, setBoardData] = createSignal<readonly number[]>([]);
  const [mark, setMark] = createSignal(MarkO);
  const [history, setHistory] = createSignal<readonly number[]>([]);

  let terminate = doNothingFunction;
  let resolve: (value: number) => void = doNothingFunction;

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleClick = (index: number): void => {
    if (board()[index] !== Empty) {
      return;
    }

    resolve(index);
  };

  const reset = (): void => {
    terminate();

    const players = {
      o: playerO(),
      x: playerX(),
    };

    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- 再代入
    terminate = gameLoop(setBoardData, setMark, setHistory, humanInput, players).terminate;
  };

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
