import { For, createResource, createSignal } from "solid-js";

import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";
import { MultiPromise } from "@/scripts/multi-promise";

import { AiPlayer, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, HumanPlayer } from "./const";
import { getReversiWasm } from "./get-wasm";
import { CellImage } from "./cell-image";
import { gameLoop } from "./game-loop";
import { Settings } from "./settings";

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: 64 }, () => CellEmpty));
  const [blackPlayer, setBlackPlayer] = createSignal(HumanPlayer);
  const [whitePlayer, setWhitePlayer] = createSignal(AiPlayer);
  const [wasm] = createResource(getReversiWasm);
  let terminateGame: (() => void) | undefined;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  let resolve = (_: number) => {
    // empty
  };

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleStart = () => {
    const exports = wasm();
    if (exports === undefined) return;
    terminateGame?.();

    terminateGame = gameLoop(exports, setBoard, humanInput, { black: blackPlayer(), white: whitePlayer() });
  };

  const handleClick = (square: number, index: number) => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    resolve(index);
  };

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(square, index) => {
            return (
              <span class={cellStyle}>
                <button
                  type="button"
                  onClick={() => {
                    handleClick(square, index());
                  }}
                >
                  <CellImage square={square} />
                </button>
              </span>
            );
          }}
        </For>
      </div>

      <Settings
        start={handleStart}
        black={blackPlayer()}
        setBlack={setBlackPlayer}
        white={whitePlayer()}
        setWhite={setWhitePlayer}
      />
    </>
  );
};
