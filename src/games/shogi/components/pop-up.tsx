import type { JSXElement } from "solid-js";
import { Show } from "solid-js";

type PopUpProperties = {
  readonly open: boolean;
  readonly children: JSXElement;
};
export const PopUp = (properties: PopUpProperties): JSXElement => {
  return (
    <Show when={properties.open}>
      <dialog open class="fixed inset-0 h-screen w-screen bg-[#0001]">
        <div class="w-2/3 m-auto mt-4 p-2 text-center bg-white">{properties.children}</div>
      </dialog>
    </Show>
  );
};
