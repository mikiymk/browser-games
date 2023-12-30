import { randomSelect } from "@/scripts/random-select";
import { isWin, turnMark } from "./game-model";
import { Empty, Reset } from "./types";

export const gameNoughtAndCrossAi = (board: number[], mark: number): number => {
  // 各ラインで相手が2つと空きマスの場合、空きマスを選ぶ
  const clearCells: number[] = [];
  const interCells: number[] = [];
  const emptyCells: number[] = [];

  for (const [index, cell] of board.entries()) {
    if (cell !== Empty) {
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
    if (cell === Empty) {
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
