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
      <DefineNumber number={0} class={number} />
      <DefineNumber number={1} class={number} />
      <DefineNumber number={2} class={number} />
      <DefineNumber number={3} class={number} />
      <DefineNumber number={4} class={number} />
      <DefineNumber number={5} class={number} />
      <DefineNumber number={6} class={number} />
      <DefineNumber number={7} class={number} />

      <DefineUse id="knight" href={knight.src} class={piece} />
      <DefineUse id="nought" href={nought.src} class={figure} />
      <DefineUse id="cross" href={cross.src} class={figure} />
    </Define>
  );
};

export const UsePiece = Use<number | "cross" | "knight" | "nought" | undefined>;
