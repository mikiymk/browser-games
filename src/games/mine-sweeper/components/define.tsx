import { DefineNumber } from "../../../common/components/define/define-number.tsx";
import { Define } from "../../../common/components/define/define.tsx";
import { Flag, Mine } from "../../../common/components/image/symbol.tsx";
import { number1, number2, number3, number4, number5, number6, number7, number8 } from "./style.css.ts";

import type { JSXElement } from "solid-js";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <Mine />
      <Flag />

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
