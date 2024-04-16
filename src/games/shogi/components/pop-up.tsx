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


let id = "x1234";    // this is a "dead store" - this value ("x1234") is never read

id = "x2345";

console.log(id);