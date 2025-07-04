import { createEffect, createSignal, onMount } from "solid-js";

import type { Accessor, Setter } from "solid-js";

/**
 * URLのクエリパラメータをSignalとして扱うアクセサーとセッターを作成します。
 * @param name - クエリパラメータの名前
 * @param defaultValue - デフォルト値
 * @returns アクセサーとセッターの組
 */
export const createUrlQuerySignal = <T extends string>(
  name: string,
  defaultValue: NoInfer<T>,
): [Accessor<T>, Setter<T>] => {
  const [value, setValue] = createSignal(defaultValue);

  const setUrl = (value: T): void => {
    const parameters = new URLSearchParams(location.search);
    parameters.set(name, value);

    history.replaceState(undefined, "", `${location.pathname}?${parameters.toString()}`);
  };

  onMount(() => {
    const query = new URLSearchParams(location.search).get(name);
    if (query === null) {
      setUrl(defaultValue);
    } else {
      setValue(() => query as T);
    }
  });

  createEffect(() => {
    setUrl(value());
  });

  return [value, setValue];
};

export const createUrlQuerySignalNumber = <T extends number>(
  name: string,
  defaultValue: NoInfer<number>,
): [Accessor<T>, Setter<T>] => {
  const [value, setValue] = createUrlQuerySignal(name, String(defaultValue));
  const valueNumber = (): T => Number.parseInt(value()) as T;
  const setValueNumber = (value: ((previous: T) => T) | T): T => {
    return Number.parseInt(
      typeof value === "function"
        ? setValue((previous) => String(value(Number.parseInt(previous) as T)))
        : setValue(String(value)),
    ) as T;
  };

  return [valueNumber, setValueNumber as Setter<T>];
};
