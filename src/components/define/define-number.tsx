import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type DefineNumberProperties = {
  readonly number: number;
  readonly class: string;
};
export const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={`${properties.number}`} viewBox="0 0 60 60">
      <text x={30} y={54} class={`${Styles["def-text"] ?? ""} ${properties.class}`}>
        {properties.number}
      </text>
    </symbol>
  );
};
