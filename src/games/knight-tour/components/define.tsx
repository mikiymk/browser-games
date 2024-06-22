import { DefineNumber } from "@/components/define/define-number";
import { DefineUse } from "@/components/define/define-use";
import { Use } from "@/components/define/use";
import knight from "@/images/chess/knight.svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import type { JSXElement } from "solid-js";

export const Define = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefineNumber number={0} class="fill-slate-600" />
      <DefineNumber number={1} class="fill-slate-600" />
      <DefineNumber number={2} class="fill-slate-600" />
      <DefineNumber number={3} class="fill-slate-600" />
      <DefineNumber number={4} class="fill-slate-600" />
      <DefineNumber number={5} class="fill-slate-600" />
      <DefineNumber number={6} class="fill-slate-600" />
      <DefineNumber number={7} class="fill-slate-600" />

      <DefineUse id="knight" href={knight.src} class="fill-stone-200 stroke-slate-900" />
      <DefineUse id="nought" href={nought.src} class="fill-none stroke-slate-600 stroke-2" />
      <DefineUse id="cross" href={cross.src} class="fill-none stroke-slate-600 stroke-2" />
    </svg>
  );
};

export const UsePiece = Use<number | "cross" | "knight" | "nought" | undefined>;
