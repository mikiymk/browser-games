import { For } from "solid-js";

type HistoryProperties = {
  history: number[];
};
export const History = (properties: HistoryProperties) => {
  return (
    <div>
      history
      <For each={properties.history}>{(history) => <p>{history}</p>}</For>
    </div>
  );
};
