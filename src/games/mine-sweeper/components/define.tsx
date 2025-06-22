import { Define } from "../../../common/components/define/define.tsx";
import { Flag, Mine } from "../../../common/components/image/symbol.tsx";
import { classes } from "../../../common/scripts/classes.ts";
import {
  closed,
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

import type { JSXElement } from "solid-js";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <Mine />
      <Flag />
      <symbol id="close" viewBox="0 0 60 60">
        <Closed />
      </symbol>
      <symbol id="open" viewBox="0 0 60 60">
        <Opened />
      </symbol>

      <DefineNumber class={number1} number={1} />
      <DefineNumber class={number2} number={2} />
      <DefineNumber class={number3} number={3} />
      <DefineNumber class={number4} number={4} />
      <DefineNumber class={number5} number={5} />
      <DefineNumber class={number6} number={6} />
      <DefineNumber class={number7} number={7} />
      <DefineNumber class={number8} number={8} />
    </Define>
  );
};

const Closed = (): JSXElement => {
  return <rect class={closed} height={60} width={60} />;
};

const Opened = (): JSXElement => {
  return <rect class={opened} height={60} width={60} />;
};

type DefineNumberProperties = {
  readonly class?: string | undefined;
  readonly number: number;
};
const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <Opened />
      <text class={classes(number, properties.class)} x={30} y={54}>
        {properties.number}
      </text>
    </symbol>
  );
};
