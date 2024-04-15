import type { JSX, JSXElement } from "solid-js";
import { Show } from "solid-js";
import { buttonStyle, dialogInnerStyle, dialogStyle } from "../style.css";

type ButtonProperties = {
  readonly onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  readonly children: JSXElement;
};
export const Button = (properties: ButtonProperties): JSXElement => {
  return (
    <button
      type="button"
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      onClick={(event) => {
        properties.onClick(event);
      }}
      class={buttonStyle}
    >
      {properties.children}
    </button>
  );
};
