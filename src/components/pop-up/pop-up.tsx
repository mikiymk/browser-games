import type { JSXElement } from "solid-js";
import { createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import Styles from "./style.module.css";

type PopUpProperties = {
  readonly open: boolean;
  readonly outerClick?: () => void;
  readonly children: JSXElement;
};
export const PopUp = (properties: PopUpProperties): JSXElement => {
  let dialogReference: HTMLDialogElement | undefined;

  createEffect(() => {
    if (properties.open) {
      dialogReference?.showModal();
    } else {
      dialogReference?.close();
    }
  });

  return (
    <Portal>
      <dialog
        class={Styles.popup}
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
        <div class={Styles["popup-inner"]}>{properties.children}</div>
      </dialog>
    </Portal>
  );
};
