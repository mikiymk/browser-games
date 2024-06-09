import { createSignal, onMount } from "solid-js";

export const usePromise = <T>(getter: () => Promise<T>): (() => T | undefined) => {
  const [resource, setResource] = createSignal<T | undefined>();

  onMount(() => {
    void getter().then((value) => {
      setResource(() => value);
    });
  });

  return resource;
};
