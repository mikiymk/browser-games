import { For, Match, Switch, createResource, createSignal, onMount } from "solid-js";

import blackStone from "@/images/reversi/stone-black.svg";
import whiteStone from "@/images/reversi/stone-white.svg";
import smallWhiteStone from "@/images/reversi/stone-white-small.svg";
import smallBlackStone from "@/images/reversi/stone-black-small.svg";
import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";

import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "./const";
import { getReversiWasm, type BoardPtr } from "./get-wasm";

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);
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

  onMount(() => {
    setBoard(Array.from({ length: 64 }, () => CellEmpty));
  });

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
                  <Switch>
                    <Match when={square === CellBlack}>
                      <img src={blackStone.src} alt="black stone" height="60" />
                    </Match>
                    <Match when={square === CellWhite}>
                      <img src={whiteStone.src} alt="white stone" height="60" />
                    </Match>

                    <Match when={square === CellCanMoveBlack}>
                      <img src={smallBlackStone.src} alt="can put black stone" height="60" />
                    </Match>
                    <Match when={square === CellCanMoveWhite}>
                      <img src={smallWhiteStone.src} alt="can put white stone" height="60" />
                    </Match>
                  </Switch>
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
