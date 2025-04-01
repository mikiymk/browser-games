import type { JSXElement } from "solid-js";
import { Define } from "../../../components/define/define.tsx";
import { Use } from "../../../components/define/use.tsx";
import flag from "../../../images/icon/flag.svg";
import mine from "../../../images/icon/mine.svg";
import { classes } from "../../../scripts/classes.ts";
import {
  closed,
  flagStyle,
  mineStyle,
  number,
  number1,
  number2,
  number3,
  number4,
  number5,
  number6,
  number7,
  number8,
  opened,
} from "./style.css.ts";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <symbol id="mine" viewBox="0 0 60 60">
        <Closed />
        <use href={`${mine.src}#root`} class={mineStyle} />
      </symbol>
      <symbol id="flag" viewBox="0 0 60 60">
        <Closed />
        <use href={`${flag.src}#root`} class={flagStyle} />
      </symbol>
      <symbol id="close" viewBox="0 0 60 60">
        <Closed />
      </symbol>
      <symbol id="open" viewBox="0 0 60 60">
        <Opened />
      </symbol>

      <DefineNumber number={1} class={number1} />
      <DefineNumber number={2} class={number2} />
      <DefineNumber number={3} class={number3} />
      <DefineNumber number={4} class={number4} />
      <DefineNumber number={5} class={number5} />
      <DefineNumber number={6} class={number6} />
      <DefineNumber number={7} class={number7} />
      <DefineNumber number={8} class={number8} />
    </Define>
  );
};

const Closed = (): JSXElement => {
  return <rect height={60} width={60} class={closed} />;
};

const Opened = (): JSXElement => {
  return <rect height={60} width={60} class={opened} />;
};

type DefineNumberProperties = {
  readonly number: number;
  readonly class?: string | undefined;
};
const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <Opened />
      <text x={30} y={54} class={classes(number, properties.class)}>
        {properties.number}
      </text>
    </symbol>
  );
};

export const UseSymbol = Use<number | "close" | "flag" | "mine" | "open">;
