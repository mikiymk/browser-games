import { For, Match, Switch, createSignal } from "solid-js";

const CellUnvisited = 0;
const CellVisited = 1;
const CellKnight = 2;

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: 64 }, (_, index) => index % 3));

  return (
    <div
      style={{
        height: "80vmin",
        width: "80vmin",

        display: "grid",
        "grid-template-columns": "repeat(8, 1fr)",
        "row-gap": 0,
        "column-gap": 0,
      }}
    >
      <For each={board()}>
        {(cell) => (
          <span
            style={{
              height: "10vmin",
              width: "10vmin",
              border: "2px solid black",
            }}
          >
            <Switch>
              <Match when={cell === CellVisited}>✗</Match>
              <Match when={cell === CellKnight}>♞</Match>
            </Switch>
          </span>
        )}
      </For>
    </div>
  );
};
