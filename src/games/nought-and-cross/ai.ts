import { CellEmpty } from "@/components/reversi/const";
import { randomSelect } from "@/scripts/random-select";

import { isWin, turnMark } from "./game-model";
import { Reset } from "./types";

export const gameNoughtAndCrossAi = (board: number[], mark: number): number => {
  // 各ラインで相手が2つと空きマスの場合、空きマスを選ぶ
  const clearCells: number[] = [];
  const interCells: number[] = [];
  const emptyCells: number[] = [];

  for (const [index, cell] of board.entries()) {
    if (cell !== CellEmpty) {
      continue;
    }

    if (isWin(board.with(index, mark), mark)) {
      clearCells.push(index);
    }

    if (isWin(board.with(index, turnMark(mark)), turnMark(mark))) {
      interCells.push(index);
    }
  }

  // 空きマス
  for (const [index, cell] of board.entries()) {
    if (cell === CellEmpty) {
      emptyCells.push(index);
    }
  }

  if (emptyCells.length === 0) {
    // 見つからなかったら終了
    return Reset;
  }

  // ランダム
  return randomSelect(clearCells) ?? randomSelect(interCells) ?? randomSelect(emptyCells) ?? Reset;
};
