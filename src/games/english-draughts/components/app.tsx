import type { JSXElement } from "solid-js";

import { createSignal, mapArray } from "solid-js";

import type { PlayerType } from "../../../scripts/player.ts";
import type { PlayerColor } from "../game-loop.ts";

import { Board } from "../../../components/board/board.tsx";
import { PlayerSetting, Settings } from "../../../components/header-buttons/settings.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { Page } from "../../../components/page/page.tsx";
import board from "../../../images/chess/board.svg";
import { MultiPromise } from "../../../scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import { usePromise } from "../../../scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { createBoard } from "../boards.ts";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "../constants.ts";
import { gameLoop } from "../game-loop.ts";
import { getWasm } from "../wasm.ts";
import { UsePiece } from "./define.tsx";

export const App = (): JSXElement => {
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeHuman);
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeAi);

  const [boardData, setBoardData] = createSignal<{ move: number; stone: number }[]>(
    createBoard(8, 8, { move: 0, stone: 0 }),
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
      players: {
        black: black(),
        white: white(),
      },
      requestInput: () => promise.request(),
      setBoard: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, stone: newBoard[index] ?? 0 }));
        });
      },
      setColor: (color) => {
        setColor(color);
      },

      setEnd: () => {
        // do nothing
      },
      setMove: (newBoard) => {
        setBoardData((previousBoard) => {
          return previousBoard.map((value, index) => ({ ...value, move: newBoard[index] ?? 0 }));
        });
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
    <Page
      header={
        <>
          <Start start={handleStart} />
          <Settings>
            <PlayerSetting black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          </Settings>
        </>
      }
    >
      <Board background={board.src} click={handleClick} data={boardNumber()} height={8} width={8}>
        {(square, _, x, y) => <UsePiece piece={square} x={x} y={y} />}
      </Board>
    </Page>
  );
};
