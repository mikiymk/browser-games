/**
 * [最小値, 最大値)の範囲でランダムな整数値を生成します。
 * @param min - 最小値
 * @param max - 最大値
 * @returns ランダムな整数値
 */
export const randomRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * 要素をシャッフルした新しい配列を返します。
 * @param array - シャッフルする配列
 * @returns シャッフルされた配列
 */
export const shuffledArray = <T>(array: readonly T[]): readonly T[] => {
  const newArray = Array.from<T>({ length: array.length });
  for (let index = 0; index < array.length; index++) {
    const randomIndex = randomRange(0, index + 1);
    if (index !== randomIndex) {
      newArray[index] = newArray[randomIndex] as T;
    }
    newArray[randomIndex] = array[index] as T;
  }

  return newArray;
};
