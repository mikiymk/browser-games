import type { JSXElement } from "solid-js";
import { Show } from "solid-js";
import { dialogInnerStyle, dialogStyle } from "../style.css";

type PopUpProperties = {
  readonly open: boolean;
  readonly children: JSXElement;
};
export const PopUp = (properties: PopUpProperties): JSXElement => {
  return (
    <Show when={properties.open}>
      <dialog open class={dialogStyle}>
        <div class={dialogInnerStyle}>{properties.children}</div>
      </dialog>
    </Show>
  );
};
