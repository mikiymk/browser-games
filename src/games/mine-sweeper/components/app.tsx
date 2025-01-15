import { Start } from "@/components/header-buttons/start";
import { PageBody } from "@/components/page-body/page-body";
import { PageHeader } from "@/components/page-header/page-header";
import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "@/games/mine-sweeper/consts";
import { getAround, initializeField, isClear, resetMines } from "@/games/mine-sweeper/field";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import type { JSXElement } from "solid-js";
import { batch, createEffect, createSignal } from "solid-js";
import { Status } from "./controller";
import { MineFields } from "./field";
import { MineSweeperSettings } from "./settings";

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
    <>
      <PageHeader
        buttons={
          <>
            <Status state={gameState()} fields={fields()} mines={mineCount()} />
            <Start start={reset} />
            <MineSweeperSettings
              height={height()}
              width={width()}
              mineCount={mineCount()}
              setHeight={(height) => setHeight(String(height))}
              setWidth={(width) => setWidth(String(width))}
              setMineCount={(mineCount) => setMineCount(String(mineCount))}
            />
          </>
        }
      />
      <PageBody>
        <MineFields height={height()} width={width()} fields={fields()} open={openField} flag={flagField} />
      </PageBody>
    </>
  );
};
