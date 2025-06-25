import { batch, createEffect, createSignal } from "solid-js";

import { createBoard } from "../english-draughts/boards.ts";
import { Bombed, Clear, FieldBomb, FieldFlag, FieldNoOpen, FirstClick, Playing } from "./constants.ts";
import { getAround, isClear, resetMines } from "./field.ts";

import type { Accessor } from "solid-js";

type MineSweeperGame = {
  fields: Accessor<readonly number[]>;
  flagField: (index: number) => boolean;
  gameState: Accessor<number>;
  openField: (index: number) => void;
  reset: () => void;
};

export const createMineSweeperGame = (
  height: Accessor<number>,
  width: Accessor<number>,
  mineCount: Accessor<number>,
): MineSweeperGame => {
  const [fields, setFields] = createSignal(createBoard(height(), width(), FieldNoOpen));
  const setFieldOn = (index: number, field: number): void => {
    setFields((fields) => fields.with(index, field));
  };

  let mines = new Set<number>();

  const [gameState, setGameState] = createSignal(FirstClick);

  const reset = (): void => {
    setGameState(FirstClick);
    setFields(createBoard(height(), width(), FieldNoOpen));
  };

  const clickField = (index: number): void => {
    if (gameState() === Bombed || gameState() === Clear || fields().length <= index) {
      // ゲームが終了している場合
      return;
    }

    if (gameState() === FirstClick) {
      // 一番最初にクリックした場合、クリック周辺以外に爆弾を配置する
      mines = resetMines(mineCount(), height(), width(), index);
      setGameState(Playing);
    }

    if (mines.has(index)) {
      // 爆弾をクリックした場合、ゲームオーバー処理
      onBombed();
      return;
    }

    openField(index);

    if (isClear(fields(), mines)) {
      setGameState(Clear);
    }
  };

  const onBombed = (): void => {
    batch(() => {
      setGameState(Bombed);
      for (const mine of mines) {
        setFieldOn(mine, FieldBomb);
      }
    });
  };

  const openField = (index: number): void => {
    const aroundIndexes = getAround(height(), width(), index);
    let aroundMineCount = 0;
    for (const aroundIndex of aroundIndexes) {
      if (mines.has(aroundIndex)) {
        aroundMineCount++;
      }
    }

    setFieldOn(index, aroundMineCount);

    if (aroundMineCount === 0) {
      for (const aroundIndex of aroundIndexes) {
        if (fields()[aroundIndex] === FieldNoOpen) {
          openField(aroundIndex);
        }
      }
    }
  };

  const toggleFlagField = (index: number): boolean => {
    const field = fields()[index];
    if (field === FieldFlag) {
      setFieldOn(index, FieldNoOpen);
      return true;
    }

    if (field === FieldNoOpen) {
      setFieldOn(index, FieldFlag);
      return true;
    }

    return false;
  };

  createEffect(() => {
    reset();
  });

  return { fields, flagField: toggleFlagField, gameState, openField: clickField, reset };
};
