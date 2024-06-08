import type { JSXElement } from "solid-js";
import { Show } from "solid-js";

type PopUpProperties = {
  readonly open: boolean;
  readonly outerClick?: () => void;
  readonly children: JSXElement;
};
export const PopUp = (properties: PopUpProperties): JSXElement => {
  return (
    <Show when={properties.open}>
      <dialog
        open
        class="flex items-center justify-center fixed inset-0 h-screen w-screen bg-[#0001]"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            properties.outerClick?.();
          }
        }}
        onKeyPress={() => {
          // empty
        }}
      >
        <div class="h-4/5 w-2/3 p-4 border-slate-800 border-2 bg-yellow-100">{properties.children}</div>
      </dialog>
    </Show>
  );
};
