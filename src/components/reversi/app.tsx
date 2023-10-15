import { For, Match, Switch, createSignal, onMount } from "solid-js";

import blackStone from "@/images/reversi/stone-black.svg";
import whiteStone from "@/images/reversi/stone-white.svg";
import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";
import { add } from "@/wasms/reversi/pkg";

const CellEmpty = 0;
const CellBlack = 1;
const CellWhite = 2;

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);

  const handleStart = () => {
    setBoard(Array.from({ length: 64 }, (_, index) => index % 3));
  };

  onMount(() => {
    setBoard(Array.from({ length: 64 }, () => CellEmpty));
    console.log(add(2, 3));
  });

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(square) => {
            return (
              <span class={cellStyle}>
                <Switch>
                  <Match when={square === CellBlack}>
                    <img src={blackStone.src} alt="black stone" />
                  </Match>
                  <Match when={square === CellWhite}>
                    <img src={whiteStone.src} alt="white stone" />
                  </Match>
                </Switch>
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
