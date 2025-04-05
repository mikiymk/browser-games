import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";
import { PlayerSetting, Settings } from "../../../components/header-buttons/settings.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { PageBody } from "../../../components/page/body.tsx";
import { PageHeader } from "../../../components/page/header.tsx";
import { doNothingFunction } from "../../../scripts/do-nothing.ts";
import { MultiPromise } from "../../../scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";
import { usePromise } from "../../../scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { createBoard } from "../board.ts";
import type { BoardCell } from "../board.ts";
import { EndNotYet, White } from "../constants.ts";
import { gameLoop, getWasm } from "../game-loop.ts";
import { ChessBoard } from "./board.tsx";
import { Status } from "./status.tsx";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(EndNotYet);

  const { board, setPiece, setMark } = createBoard();
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
      white: white(),
      black: black(),
    });
  };

  const handleClick = (_square: BoardCell, index: number): void => {
    resolve(index);
  };

  return (
    <>
      <PageHeader
        buttons={
          <>
            <Status color={color()} end={end()} />
            <Start start={start} />
            <Settings>
              <PlayerSetting white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
            </Settings>
          </>
        }
      />
      <PageBody>
        <ChessBoard board={board()} handleClick={handleClick} />
      </PageBody>
    </>
  );
};
