import { For } from "solid-js";

import { historyMoveStyle } from "@/styles/nought-and-cross.css";

type HistoryProperties = {
  history: number[];
};
export const History = (properties: HistoryProperties) => {
  return (
    <div>
      history
      <For each={properties.history}>{(history) => <span class={historyMoveStyle}>{position(history)}</span>}</For>
    </div>
  );
};

const position = (index: number): string => {
  return `${"ABC"[index % 3] ?? ""}-${Math.floor(index / 3)}`;
};
