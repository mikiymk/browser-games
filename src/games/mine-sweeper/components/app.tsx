import type { JSXElement } from "solid-js";

import { batch, createEffect, createSignal } from "solid-js";

import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createUrlQuerySignal } from "../../../common/scripts/use-url-query.ts";
import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "../consts.ts";
import { getAround, initializeField, isClear, resetMines } from "../field.ts";
import { Status } from "./controller.tsx";
import { MineFields } from "./field.tsx";
import { MineSweeperSettings } from "./settings.tsx";

export const App = (): JSXElement => {
  const [heightString, setHeight] = createUrlQuerySignal("height", "10");
  const [widthString, setWidth] = createUrlQuerySignal("width", "10");
  const [mineCountString, setMineCount] = createUrlQuerySignal("mines", "10");

  const height = (): number => Number.parseInt(heightString());
  const width = (): number => Number.parseInt(widthString());
  const mineCount = (): number => Number.parseInt(mineCountString());

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
    setFields(initializeField(height() * width()));
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
      mines = resetMines(mineCount(), height(), width(), index);
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
    }

    if (fields()[index] === FieldNoOpen) {
      setFieldOn(index, FieldFlag);
      return true;
    }

    return false;
  };

  return (
    <Page
      header={
        <>
          <Status fields={fields()} mines={mineCount()} state={gameState()} />
          <Start start={reset} />
          <MineSweeperSettings
            height={height()}
            mineCount={mineCount()}
            setHeight={(height) => setHeight(String(height))}
            setMineCount={(mineCount) => setMineCount(String(mineCount))}
            setWidth={(width) => setWidth(String(width))}
            width={width()}
          />
        </>
      }
    >
      <MineFields fields={fields()} flag={flagField} height={height()} open={openField} width={width()} />
    </Page>
  );
};
