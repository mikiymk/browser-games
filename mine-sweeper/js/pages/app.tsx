import { For, createEffect, createSignal } from "solid-js";

import { Controller } from "./controller";
import { MineField } from "./field";

export const App = () => {
  const [height, setHeight] = createSignal(10);
  const [width, setWidth] = createSignal(10);
  const [fields, setFields] = createSignal(Array.from({ length: 100 }, (_, n) => (n % 12) - 3));
  const [mines, setMines] = createSignal(Array.from({ length: 10 }).fill(0));

  createEffect(() => {
    setFields(Array.from({ length: height() * width() }, () => -1));
  });

  return (
    <>
      <h1>mine sweeper</h1>

      <div
        class="grid"
        style={{
          "grid-template-columns": `repeat(${Math.sqrt(fields().length)}, 1fr)`,
        }}
      >
        <For each={fields()}>{(field) => <MineField field={field} />}</For>
      </div>

      <Controller
        setHeight={setHeight}
        setWidth={setWidth}
        setMineAmount={(amount) => setMines(Array.from({ length: amount }).fill(0))}
      />
    </>
  );
};
