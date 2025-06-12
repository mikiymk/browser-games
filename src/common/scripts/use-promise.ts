import { createSignal, onMount } from "solid-js";

/**
 * コンポーネント内で非同期の値を取得する関数
 * @param getter - Promiseを返す関数
 * @returns Promiseの結果を返す関数。まだ解決されていない場合はundefinedを返す。
 */
export const usePromise = <T>(getter: () => Promise<T>): (() => T | undefined) => {
  const [resource, setResource] = createSignal<T | undefined>();

  onMount(() => {
    void getter().then((value) => {
      setResource(() => value);
    });
  });

  return resource;
};
