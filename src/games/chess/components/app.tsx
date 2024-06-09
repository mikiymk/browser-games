import { createBoard } from "@/games/chess/board";
import type { BoardCell } from "@/games/chess/board";
import { EndNotYet, White } from "@/games/chess/constants";
import { gameLoop, getWasm } from "@/games/chess/game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";
import { ChessBoard } from "./board";
import { Status } from "./status";
import { PageHeader } from "@/components/page-header/page-header";
import { PageBody } from "@/components/page-body/page-body";
import { StartButton } from "@/components/page-header/start-button";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import { Settings } from "./settings";
import { usePromise } from "@/scripts/use-promise";

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
            <StartButton start={start} />
            <Settings white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
          </>
        }
      />
      <PageBody>
        <ChessBoard board={board()} handleClick={handleClick} />
      </PageBody>
    </>
  );
};
