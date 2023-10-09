import { CellKnight, CellMovable, CellUnvisited } from "./consts";

export const getLegalMove = (index: number): number[] => {
  /// . A . B .
  /// C . . . D
  /// . . N . .
  /// E . . . F
  /// . G . H .

  const currentKnightFile = index % 8;
  const currentKnightRank = Math.floor(index / 8);

  const moveSteps: [number, number][] = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2],
  ];

  return moveSteps
    .filter(
      ([x, y]) =>
        x - 1 < currentKnightRank &&
        currentKnightRank < 8 + x &&
        y - 1 < currentKnightFile &&
        currentKnightFile < 8 + y,
    )
    .map(([x, y]) => (currentKnightRank - x) * 8 + (currentKnightFile - y));
};

export const setKnightMovable = (board: number[], knightIndex: number): number[] => {
  for (const index of getLegalMove(knightIndex)) {
    if (board[index] === CellUnvisited) {
      board[index] = CellMovable;
    }
  }

  board[knightIndex] = CellKnight;

  return board;
};
