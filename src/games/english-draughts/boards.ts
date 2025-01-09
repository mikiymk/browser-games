/**
 * 高さ×幅のボードを作成する
 * @param height
 * @param width
 * @param value
 * @returns
 */
export const createBoard = <T>(height: number, width: number, value: T): T[] => {
  return Array.from({ length: height * width }, () => value);
};

/**
 * ビットボードから配列のボードに変換する
 * @param height
 * @param width
 * @param bitBoard
 * @param symbol
 * @returns
 */
export const transBoard = (height: number, width: number, bitBoard: bigint | number, symbol: number): number[] => {
  const bitBoardIndex = BigInt(bitBoard);

  return Array.from({ length: height * width }, (_, index) => (bitBoardIndex & (1n << BigInt(index)) ? symbol : 0));
};

/**
 * 二つ以上のボード配列を合成する
 * @param firstBoard
 * @param boards
 * @returns
 */
export const mergeBoards = (firstBoard: readonly number[], ...boards: readonly (readonly number[])[]): number[] => {
  return Array.from(firstBoard, (value, index) => {
    return value || (boards.find((board) => Boolean(board[index]))?.[index] ?? 0);
  });
};
