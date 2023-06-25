import { For, createEffect, createSignal } from "solid-js";

import { Controller } from "./controller";
import { MineField } from "./field";

import { FieldBomb, FieldNoOpen } from "../consts";

export const App = () => {
  const [height, setHeight] = createSignal(10);
  const [width, setWidth] = createSignal(10);
  const [fields, setFields] = createSignal(Array.from({ length: 100 }, (_, n) => (n % 12) - 3));
  const [mines, setMines] = createSignal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [minesAmount, setMinesAmount] = createSignal(10);
  const [clear, setClear] = createSignal(false);

  createEffect(() => {
    const length = height() * width();
    setFields(Array.from({ length }, () => FieldNoOpen));
    setMines(Array.from({ length: minesAmount() }, () => Math.floor(Math.random() * length)));
  });

  const openField = (index: number) => {
    if (clear() || fields().length <= index) {
      return;
    }

    let clickResult = FieldNoOpen;

    if (mines().includes(index)) {
      clickResult = FieldBomb;
    } else {
      clickResult = 0;
      for (const aroundIndex of getAround(height(), width(), index)) {
        if (mines().includes(aroundIndex)) {
          clickResult++;
        }
      }
    }

    setFields((fields) => {
      const newFields = [...fields];

      newFields[index] = clickResult;

      return newFields;
    });

    if (clickResult === 0) {
      for (const aroundIndex of getAround(height(), width(), index)) {
        if (fields()[aroundIndex] === FieldNoOpen) {
          openField(aroundIndex);
        }
      }
    }

    if (isClear(fields(), mines())) {
      setClear(true);
    }
  };

  return (
    <>
      <h1>mine sweeper</h1>

      <div
        class="grid"
        style={{
          "grid-template-columns": `repeat(${width()}, 1fr)`,
        }}
      >
        <For each={fields()}>{(field, index) => <MineField field={field} onClick={() => openField(index())} />}</For>
      </div>

      <Controller setHeight={setHeight} setWidth={setWidth} setMineAmount={setMinesAmount} />
    </>
  );
};

const diffArray: [number, number][] = [
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
];

const getAround = (height: number, width: number, index: number): number[] => {
  const x = Math.floor(index / width);
  const y = index % width;

  const around: number[] = [];
  for (const [dx, dy] of diffArray) {
    if (x + dx < 0 || width <= x + dx || y + dy < 0 || height <= y + dy) {
      continue;
    }

    around.push((x + dx) * width + y + dy);
  }

  return around;
};

const isClear = (fields: number[], mines: number[]): boolean => {
  for (const [index, field] of fields.entries()) {
    if (field < 0 && !mines.includes(index)) {
      return false;
    }
  }

  return true;
};
