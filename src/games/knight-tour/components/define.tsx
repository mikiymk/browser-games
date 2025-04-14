import type { JSXElement } from "solid-js";

import { DefineNumber } from "../../../components/define/define-number.tsx";
import { DefineUse } from "../../../components/define/define-use.tsx";
import { Define } from "../../../components/define/define.tsx";
import { Use } from "../../../components/define/use.tsx";
import knight from "../../../images/chess/knight.svg";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import { figure, number, piece } from "./style.css.ts";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <DefineNumber class={number} number={0} />
      <DefineNumber class={number} number={1} />
      <DefineNumber class={number} number={2} />
      <DefineNumber class={number} number={3} />
      <DefineNumber class={number} number={4} />
      <DefineNumber class={number} number={5} />
      <DefineNumber class={number} number={6} />
      <DefineNumber class={number} number={7} />

      <DefineUse class={piece} href={knight.src} id="knight" />
      <DefineUse class={figure} href={nought.src} id="nought" />
      <DefineUse class={figure} href={cross.src} id="cross" />
    </Define>
  );
};

export const UsePiece = Use<"cross" | "knight" | "nought" | number | undefined>;
