import { For, createEffect, createSignal } from "solid-js";

import { Controller } from "./controller";
import { MineField } from "./field";

import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "../consts";

export const App = () => {
  const [height, setHeight] = createSignal(10);
  const [width, setWidth] = createSignal(10);

  const [minesAmount, setMinesAmount] = createSignal(10);

  const [fields, setFields] = createSignal(Array.from({ length: 100 }, (_, n) => (n % 12) - 3));
  const mines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [gameState, setGameState] = createSignal(FirstClick);

  const reset = () => {
    const length = height() * width();
    setGameState(FirstClick);
    setFields(Array.from({ length }, () => FieldNoOpen));
  };

  const message = () => {
    let flagCount = 0;
    if (gameState() === Bombed) {
      return "bombed";
    } else if (gameState() === Clear) {
      return "cleared";
    }

    for (const field of fields()) {
      if (field === FieldFlag) {
        flagCount++;
      }
    }

    return `${minesAmount() - flagCount} mines`;
  };

  createEffect(() => {
    reset();
  });

  const openField = (index: number) => {
    if (gameState() === Bombed || gameState() === Clear || fields().length <= index) {
      return;
    }

    if (gameState() === FirstClick) {
      mines.length = 0;
      const around = new Set([index, ...getAround(height(), width(), index)]);
      const length = height() * width();
      const amount = minesAmount();

      while (mines.length !== amount) {
        const index = Math.floor(Math.random() * length);
        if (!around.has(index)) mines.push(index);
      }

      setGameState(Playing);
    }

    let clickResult = FieldNoOpen;

    if (mines.includes(index)) {
      setGameState(Bombed);
      clickResult = FieldBomb;
    } else {
      clickResult = 0;
      for (const aroundIndex of getAround(height(), width(), index)) {
        if (mines.includes(aroundIndex)) {
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

    if (isClear(fields(), mines)) {
      setGameState(Clear);
    }
  };

  const flagField = (index: number): boolean => {
    let updated = false;

    setFields((fields) => {
      const newFields = [...fields];

      if (newFields[index] === FieldFlag) {
        newFields[index] = FieldNoOpen;
        updated = true;
      } else if (newFields[index] === FieldNoOpen) {
        newFields[index] = FieldFlag;
        updated = true;
      } else {
        return fields;
      }

      return newFields;
    });

    return updated;
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
        <For each={fields()}>
          {(field, index) => (
            <MineField field={field} onClick={() => openField(index())} onContextMenu={() => flagField(index())} />
          )}
        </For>
      </div>

      <Controller
        height={height()}
        width={width()}
        mineAmount={minesAmount()}
        message={message()}
        reset={reset}
        setHeight={setHeight}
        setWidth={setWidth}
        setMineAmount={setMinesAmount}
      />
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
    if (x + dx < 0 || height <= x + dx || y + dy < 0 || width <= y + dy) {
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
