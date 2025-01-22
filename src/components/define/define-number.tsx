import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";
import CommonStyles from "@/styles/common.module.css";
import { classes } from "@/scripts/classes";

type DefineNumberProperties = {
  readonly number: number;
  readonly class?: string | undefined;
};
export const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <text x={30} y={54} class={classes(Styles["def-text"], CommonStyles["font-jp"], properties.class)}>
        {properties.number}
      </text>
    </symbol>
  );
};
