/**
 * Promiseで待機するスリープ関数。
 * @param time 待機する時間(ミリ秒)
 * @returns 待機後に解決される`Promise`
 */
export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
