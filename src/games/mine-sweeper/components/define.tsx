import { Define } from "@/components/define/define";
import { Use } from "@/components/define/use";
import flag from "@/images/icon/flag.svg";
import mine from "@/images/icon/mine.svg";
import { classes } from "@/scripts/classes";
import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <symbol id="mine" viewBox="0 0 60 60">
        <Closed />
        <use href={`${mine.src}#root`} class={classes(Styles.symbol, Styles.mine)} />
      </symbol>
      <symbol id="flag" viewBox="0 0 60 60">
        <Closed />
        <use href={`${flag.src}#root`} class={classes(Styles.symbol, Styles.flag)} />
      </symbol>
      <symbol id="close" viewBox="0 0 60 60">
        <Closed />
      </symbol>
      <symbol id="open" viewBox="0 0 60 60">
        <Opened />
      </symbol>

      <DefineNumber number={1} class={Styles["num-1"]} />
      <DefineNumber number={2} class={Styles["num-2"]} />
      <DefineNumber number={3} class={Styles["num-3"]} />
      <DefineNumber number={4} class={Styles["num-4"]} />
      <DefineNumber number={5} class={Styles["num-5"]} />
      <DefineNumber number={6} class={Styles["num-6"]} />
      <DefineNumber number={7} class={Styles["num-7"]} />
      <DefineNumber number={8} class={Styles["num-8"]} />
    </Define>
  );
};

const Closed = (): JSXElement => {
  return <rect height={60} width={60} class={classes(Styles.symbol, Styles.closed)} />;
};

const Opened = (): JSXElement => {
  return <rect height={60} width={60} class={classes(Styles.symbol, Styles.opened)} />;
};

type DefineNumberProperties = {
  readonly number: number;
  readonly class?: string | undefined;
};
const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <Opened />
      <text x={30} y={54} class={classes(Styles.num, properties.class)}>
        {properties.number}
      </text>
    </symbol>
  );
};

export const UseSymbol = Use<number | "close" | "flag" | "mine" | "open">;
