import { Board } from "@/components/board/board";
import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import board from "@/images/chess/board.svg";
import { PageHeader } from "@/components/page-header/page-header";
import { PageBody } from "@/components/page-body/page-body";
import { UsePiece } from "./define";
import { StartButton } from "@/components/page-header/start-button";
import { initialBoard } from "../constants";

export const App = (): JSXElement => {
  const [boardData, setBoard] = createSignal<number[]>(Array.from({ length: 64 }, () => 0));

  const handleStart = (): void => {
    console.log("start");

    setBoard(initialBoard);
  };

  const handleClick = (square: number, index: number): void => {
    console.log("clicked", { square, index });

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
