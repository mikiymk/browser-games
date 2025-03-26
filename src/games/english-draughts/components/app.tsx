import { createSignal, mapArray } from "solid-js";
import type { JSXElement } from "solid-js";
import { Board } from "../../../components/board/board.ts";
import { PlayerSetting, Settings } from "../../../components/header-buttons/settings.ts";
import { Start } from "../../../components/header-buttons/start.ts";
import { PageBody } from "../../../components/page/body.ts";
import { PageHeader } from "../../../components/page/header.ts";
import board from "../../../images/chess/board.svg";
import { MultiPromise } from "../../../scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";
import { usePromise } from "../../../scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { createBoard } from "../boards.ts";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "../constants.ts";
import { gameLoop } from "../game-loop.ts";
import type { PlayerColor } from "../game-loop.ts";
import { getWasm } from "../wasm.ts";
import { UsePiece } from "./define.tsx";

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
            <Start start={handleStart} />
            <Settings>
              <PlayerSetting white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
            </Settings>
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
