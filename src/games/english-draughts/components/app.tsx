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

export const App = (): JSXElement => {
  const [boardData, setBoard] = createSignal<number[]>(Array.from({ length: 64 }, () => 0));

  let terminate: (() => void) | undefined;

  const handleStart = (): void => {
    setBoard(initialBoard);

    terminate?.();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }

    terminate = gameLoop(wasmObject, {
      setColor,
      setPiece,
      setEnd,
      setMark,
      humanInput,
      players: {
        white: white(),
        black: black(),
      },
    });
  };

  const handleClick = (square: number, index: number): void => {
    setBoard((previous) => previous.with(index, (square + 1) % 3));
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
