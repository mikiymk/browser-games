import { Board } from "@/components/board/board";
import { PageBody } from "@/components/page-body/page-body";
import { PageHeader } from "@/components/page-header/page-header";
import { StartButton } from "@/components/page-header/start-button";
import board from "@/images/chess/board.svg";
import { createSignal, mapArray } from "solid-js";
import type { JSXElement } from "solid-js";
import { MOVE_TARGET } from "../constants";
import { gameLoop } from "../game-loop";
import { UsePiece } from "./define";
import { getWasm } from "../wasm";
import { usePromise } from "@/scripts/use-promise";
import { MultiPromise } from "@/scripts/multi-promise";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { createBoard } from "../boards";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [boardData, setBoardData] = createSignal<{ stone: number; move: number }[]>(
    createBoard(8, 8, { stone: 0, move: 0 }),
  );
  const boardNumber = mapArray(boardData, (value) => {
    if (value.move === MOVE_TARGET) {
      return MOVE_TARGET;
    }

    return value.stone;
  });

  const wasm = usePromise(getWasm);
  const { promise, resolve } = MultiPromise.withResolvers<number>();

  let terminate: (() => void) | undefined;

  const handleStart = (): void => {
    terminate?.();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }

    terminate = gameLoop(wasmObject, {
      setBoard: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, stone: newBoard[index] ?? 0 }));
        });
      },
      setMove: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, move: newBoard[index] ?? 0 }));
        });
      },
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
        <Board height={8} width={8} data={boardNumber()} background={board.src} click={handleClick}>
          {(square, _, x, y) => <UsePiece piece={square} x={x} y={y} />}
        </Board>
      </PageBody>
    </>
  );
};
