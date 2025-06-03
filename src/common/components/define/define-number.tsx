import type { JSXElement } from "solid-js";

import { classes } from "../../scripts/classes.ts";
import { defineText } from "./style.css.ts";

type DefineNumberProperties = {
  readonly class?: string | undefined;
  readonly number: number;
};
export const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <text class={classes(defineText, properties.class)} x={30} y={54}>
        {properties.number}
      </text>
    </symbol>
  );
};
