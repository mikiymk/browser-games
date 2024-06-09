import type { JSXElement } from "solid-js";
import { createEffect } from "solid-js";
import { Portal } from "solid-js/web";

type PopUpProperties = {
  readonly open: boolean;
  readonly outerClick?: () => void;
  readonly children: JSXElement;
};
export const PopUp = (properties: PopUpProperties): JSXElement => {
  let dialogReference: HTMLDialogElement | undefined = undefined;

  createEffect(() => {
    console.trace();

    if (properties.open) {
      dialogReference?.showModal();
    } else {
      dialogReference?.close();
    }
  });

  return (
    <Portal>
      <dialog
        class="backdrop:fixed backdrop:inset-0 backdrop:h-screen backdrop:w-screen backdrop:bg-[#0001] h-4/5 w-2/3 border-slate-800 border-2 bg-yellow-100"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            properties.outerClick?.();
          }
        }}
        onKeyPress={() => {
          // empty
        }}
        ref={(element) => {
          dialogReference = element;
        }}
      >
        <div class="h-full w-full p-4">{properties.children}</div>
      </dialog>
    </Portal>
  );
};
