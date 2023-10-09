import { For } from "solid-js";

import { CellUnvisited, CellVisited } from "@/games/knight-tour/consts";
import { setKnightMovable } from "@/games/knight-tour/knight-move";

import type { Setter } from "solid-js";

type HistoryProperties = {
  history: number[];
  setHistory: Setter<number[]>;
  resetBoard: (callback: (board: number[]) => number[]) => void;
};
export const History = (properties: HistoryProperties) => {
  const backHistory = (index: number) => {
    const currentHistory = properties.history;

    properties.setHistory(currentHistory.slice(0, index));
    properties.resetBoard((board) => {
      for (const historyIndex of currentHistory.slice(index)) {
        board[historyIndex] = CellUnvisited;
      }

      const knightIndex = currentHistory[index - 1] ?? board.indexOf(CellVisited);

      return setKnightMovable(board, knightIndex);
    });
  };

  return (
    <div>
      <h2>History</h2>

      <ul>
        <For each={properties.history}>
          {(fill, index) => (
            <li>
              {"abcdefgh"[fill % 8]}
              {Math.floor(fill / 8) + 1}
              <button
                type="button"
                onClick={() => {
                  backHistory(index());
                }}
              >
                back
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
