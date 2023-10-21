import { For, createResource, createSignal } from "solid-js";

import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";

import { CellCanMoveBlack, CellCanMoveWhite, CellEmpty } from "./const";
import { getReversiWasm, type BoardPtr } from "./get-wasm";
import { CellImage } from "./cell-image";

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: 64 }, () => CellEmpty));
  const [wasm] = createResource(getReversiWasm);

  let bp: BoardPtr | 0 = 0;

  const handleStart = () => {
    const exports = wasm();
    if (exports === undefined) return;

    const { init, getBoard } = exports;
    bp = init();

    setBoard(getBoard(bp));
  };

  const handleClick = (square: number, index: number) => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    if (bp === 0) return;

    const exports = wasm();
    if (exports === undefined) return;

    const { move, getBoard } = exports;

    move(bp, index);
    setBoard(getBoard(bp));
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

      <div>
        <h2>Settings</h2>

        <button type="button" onClick={handleStart}>
          Start
        </button>
      </div>
    </>
  );
};
