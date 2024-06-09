import type { Accessor, Setter } from "solid-js";
import { createEffect, createSignal, onMount } from "solid-js";

export const createUrlQuerySignal = <T extends string>(name: string, defaultValue: NoInfer<T>): [Accessor<T>, Setter<T>] => {
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
