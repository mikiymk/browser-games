import type { JSXElement } from "solid-js";
import { classes } from "../../scripts/classes.ts";
import { defineText } from "./style.css.ts";

type DefineNumberProperties = {
  readonly number: number;
  readonly class?: string | undefined;
};
export const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <text x={30} y={54} class={classes(defineText, properties.class)}>
        {properties.number}
      </text>
    </symbol>
  );
};
