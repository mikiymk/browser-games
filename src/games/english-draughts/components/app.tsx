import { Board } from "@/components/board/board";
import { PageBody } from "@/components/page-body/page-body";
import { PageHeader } from "@/components/page-header/page-header";
import { StartButton } from "@/components/page-header/start-button";
import board from "@/images/chess/board.svg";
import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { initialBoard } from "../constants";
import { gameLoop } from "../game-loop";
import { UsePiece } from "./define";
import { getWasm } from "../wasm";
import { usePromise } from "@/scripts/use-promise";
import { MultiPromise } from "@/scripts/multi-promise";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import { PlayerType, PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [boardData, setBoard] = createSignal<number[]>(Array.from({ length: 64 }, () => 0));
  const wasm = usePromise(getWasm);
  const { promise, resolve } = MultiPromise.withResolvers<number>();

  let terminate: (() => void) | undefined;

  const handleStart = (): void => {
    setBoard(initialBoard);

    terminate?.();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }

    terminate = gameLoop(wasmObject, {
      setBoard: () => {},
      setMove: () => {},
      setColor: () => {},
      setEnd: () => {},

      requestInput: () => promise.request(),
      players: {
        white: white(),
        black: black(),
      },
    });
  };

  const handleClick = (_: number, index: number): void => {
    resolve(index);
  };

  return (
    <>
      <PageHeader
        buttons={
          <>
            <StartButton start={handleStart} />
          </>
        }
      />
      <PageBody>
        <Board height={8} width={8} data={boardData()} background={board.src} click={handleClick}>
          {(square, _, x, y) => <UsePiece piece={square} x={x} y={y} />}
        </Board>
      </PageBody>
    </>
  );
};
