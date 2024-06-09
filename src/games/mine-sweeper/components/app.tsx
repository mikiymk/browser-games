import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "@/games/mine-sweeper/consts";
import { getAround, initializeField, isClear, message, resetMines } from "@/games/mine-sweeper/field";
import type { JSXElement } from "solid-js";
import { batch, createEffect, createSignal } from "solid-js";
import { Controller } from "./controller";
import { MineFields } from "./field";
import { PageHeader } from "@/components/page-header/page-header";
import { PageBody } from "@/components/page-body/page-body";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);
  const height = Number.parseInt(query.get("height") ?? "10");
  const width = Number.parseInt(query.get("width") ?? "10");
  const mineCount = Number.parseInt(query.get("mines") ?? "10");

  const [fields, setFields] = createSignal(initializeField(10 * 10));
  const setFieldOn = (index: number, field: number): void => {
    setFields((fields) => {
      const newFields = [...fields];

      newFields[index] = field;

      return newFields;
    });
  };
  let mines = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const [gameState, setGameState] = createSignal(FirstClick);

  const reset = (): void => {
    setGameState(FirstClick);
    setFields(initializeField(height * width));
  };

  createEffect(() => {
    reset();
  });

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  const openField = (index: number): void => {
    if (gameState() === Bombed || gameState() === Clear || fields().length <= index) {
      return;
    }

    if (gameState() === FirstClick) {
      mines = resetMines(mineCount, height, width, index);
      setGameState(Playing);
    }

    const aroundIndexes = getAround(height, width, index);
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
    }

    if (fields()[index] === FieldNoOpen) {
      setFieldOn(index, FieldFlag);
      return true;
    }

    return false;
  };

  return (
    <>
      <PageHeader
        buttons={
          <>
            <Controller message={message(gameState(), fields(), mineCount)} reset={reset} />
          </>
        }
      />
      <PageBody>
        <MineFields height={height} width={width} fields={fields()} open={openField} flag={flagField} />
      </PageBody>
    </>
  );
};
