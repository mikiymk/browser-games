/**
 * クラス名を連結するユーティリティ関数
 * @param classes - 複数のクラス名
 * @returns クラス名を連結した文字列
 */
export const classes = (...classes: readonly (string | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
