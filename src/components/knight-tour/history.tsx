import { For } from "solid-js";

type HistoryProperties = {
  history_: number[];
  back_: (index: number) => void;
};
export const History = (properties: HistoryProperties) => {
  return (
    <div>
      <h2>History</h2>

      <ul>
        <For each={properties.history_}>
          {(fill, index) => (
            <li>
              {"abcdefgh"[fill % 8]}
              {Math.floor(fill / 8) + 1}
              <button
                type="button"
                onClick={() => {
                  properties.back_(index());
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
