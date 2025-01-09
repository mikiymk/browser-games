import { Board } from "@/components/board/board";
import { PageBody } from "@/components/page-body/page-body";
import { PageHeader } from "@/components/page-header/page-header";
import { StartButton } from "@/components/page-header/start-button";
import board from "@/images/chess/board.svg";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { usePromise } from "@/scripts/use-promise";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import { createSignal, mapArray } from "solid-js";
import type { JSXElement } from "solid-js";
import { createBoard } from "../boards";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "../constants";
import { gameLoop } from "../game-loop";
import type { PlayerColor } from "../game-loop";
import { getWasm } from "../wasm";
import { UsePiece } from "./define";
import { Settings } from "./settings";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [boardData, setBoardData] = createSignal<{ stone: number; move: number }[]>(
    createBoard(8, 8, { stone: 0, move: 0 }),
  );
  const [color, setColor] = createSignal<PlayerColor>("white");
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
      setColor: (color) => {
        setColor(color);
      },
      setEnd: () => {
        // do nothing
      },

      requestInput: () => promise.request(),
      players: {
        white: white(),
        black: black(),
      },
    });
  };

  const handleClick = (square: number, index: number): void => {
    if (
      ((square === COLOR_PAWN_WHITE || square === COLOR_KING_WHITE) && color() === "white") ||
      ((square === COLOR_PAWN_BLACK || square === COLOR_KING_BLACK) && color() === "black")
    ) {
      resolve(index);
    }
  };

  return (
    <>
      <PageHeader
        buttons={
          <>
            <StartButton start={handleStart} />
            <Settings white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
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
