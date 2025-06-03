import type { JSXElement } from "solid-js";

import { createSignal } from "solid-js";

import type { PlayerType } from "../../../common/scripts/player.ts";
import type { BoardCell } from "../board.ts";

import { PlayerSetting, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { doNothingFunction } from "../../../common/scripts/do-nothing.ts";
import { MultiPromise } from "../../../common/scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../common/scripts/player.ts";
import { usePromise } from "../../../common/scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../common/scripts/use-url-query.ts";
import { createBoard } from "../board.ts";
import { EndNotYet, White } from "../constants.ts";
import { gameLoop, getWasm } from "../game-loop.ts";
import { ChessBoard } from "./board.tsx";
import { Status } from "./status.tsx";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(EndNotYet);

  const { board, setMark, setPiece } = createBoard();
  const wasm = usePromise(getWasm);

  let resolve: (value: number) => void = doNothingFunction;
  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  let terminate = doNothingFunction;
  const start = (): void => {
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(wasmObject, setColor, setPiece, setEnd, setMark, humanInput, {
      black: black(),
      white: white(),
    });
  };

  const handleClick = (_square: BoardCell, index: number): void => {
    resolve(index);
  };

  return (
    <Page
      header={
        <>
          <Status color={color()} end={end()} />
          <Start start={start} />
          <Settings>
            <PlayerSetting black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          </Settings>
        </>
      }
    >
      <ChessBoard board={board()} handleClick={handleClick} />
    </Page>
  );
};
