/**
 * 高さ×幅のボードを作成する
 * @param height - ボードの高さ
 * @param width - ボードの幅
 * @param value - ボードの各マスの初期値
 * @returns 新しいボード
 */
export const createBoard = <T>(height: number, width: number, value: T): readonly T[] => {
  return Array.from({ length: height * width }, () => value);
};

/**
 * ビットボードから配列のボードに変換する
 * @param height - ボードの高さ
 * @param width - ボードの幅
 * @param bitBoard - 元のビットボード
 * @param symbol - ビットボードで1のときに設定する値
 * @returns 配列に変換されたボード
 */
export const transBoard = (height: number, width: number, bitBoard: bigint | number, symbol: number): number[] => {
  const bitBoardIndex = BigInt(bitBoard);

  return Array.from({ length: height * width }, (_, index) => (bitBoardIndex & (1n << BigInt(index)) ? symbol : 0));
};

/**
 * 二つ以上のボード配列を合成する
 * @param firstBoard - 必須のボード
 * @param boards - 合成するボード
 * @returns 合成したボード
 */
export const mergeBoards = (firstBoard: readonly number[], ...boards: readonly (readonly number[])[]): number[] => {
  return Array.from(firstBoard, (value, index) => {
    return value || (boards.find((board) => Boolean(board[index]))?.[index] ?? 0);
  });
};
