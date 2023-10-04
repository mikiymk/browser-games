import { For, batch, createEffect, createSignal } from "solid-js";

import { Controller } from "./controller";
import { MineField } from "./field";

import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "@/games/mine-sweeper/consts";
import { getAround, initializeField, isClear, message, resetMines } from "@/games/mine-sweeper/field";

export const App = () => {
  const [height, setHeight] = createSignal(10);
  const [width, setWidth] = createSignal(10);

  const [minesAmount, setMinesAmount] = createSignal(10);

  const [fields, setFields] = createSignal(initializeField(10 * 10));
  const setFieldOn = (index: number, field: number) => {
    setFields((fields) => {
      const newFields = [...fields];

      newFields[index] = field;

      return newFields;
    });
  };
  let mines = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const [gameState, setGameState] = createSignal(FirstClick);

  const reset = () => {
    setGameState(FirstClick);
    setFields(initializeField(height() * width()));
  };

  createEffect(() => {
    reset();
  });

  const openField = (index: number) => {
    if (gameState() === Bombed || gameState() === Clear || fields().length <= index) {
      return;
    }

    if (gameState() === FirstClick) {
      mines = resetMines(minesAmount(), height(), width(), index);
      setGameState(Playing);
    }

    const aroundIndexes = getAround(height(), width(), index);
    let clickResult = 0;

    if (mines.has(index)) {
      setGameState(Bombed);

      batch(() => {
        for (const mine of mines) {
          setFieldOn(mine, FieldBomb);
        }
      });
      clickResult = FieldBomb;
    } else {
      for (const aroundIndex of aroundIndexes) {
        if (mines.has(aroundIndex)) {
          clickResult++;
        }
      }
    }

    setFieldOn(index, clickResult);

    if (clickResult === 0) {
      for (const aroundIndex of aroundIndexes) {
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
    if (fields()[index] === FieldFlag) {
      setFieldOn(index, FieldNoOpen);
      return true;
    } else if (fields()[index] === FieldNoOpen) {
      setFieldOn(index, FieldFlag);
      return true;
    }

    return false;
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
            <MineField
              field={field}
              onClick={() => {
                openField(index());
              }}
              onContextMenu={() => flagField(index())}
            />
          )}
        </For>
      </div>

      <Controller
        height={height()}
        width={width()}
        mineAmount={minesAmount()}
        message={message(gameState(), fields(), minesAmount())}
        reset={reset}
        setHeight={setHeight}
        setWidth={setWidth}
        setMineAmount={setMinesAmount}
      />
    </>
  );
};
