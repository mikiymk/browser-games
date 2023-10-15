import { For, createSignal, onMount } from "solid-js";

import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";

const CellEmpty = 0;

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);

  const handleStart = () => {
    setBoard(Array.from({ length: 64 }, () => CellEmpty));
  };

  onMount(() => {
    setBoard(Array.from({ length: 64 }, () => CellEmpty));
  });

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(square) => {
            return <span class={cellStyle}>{square}</span>;
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
