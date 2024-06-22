import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import knight from "@/images/chess/knight.svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";

export const Define = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefineNumbers />
      <DefineSymbols />
    </svg>
  );
};

type DefineUseProperties = {
  readonly id: string;
  readonly href: string;
  readonly class: string;
};
const DefineUse = (properties: DefineUseProperties): JSXElement => {
  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use href={`${properties.href}#root`} class={properties.class} />
    </symbol>
  );
};

type DefineNumberProperties = {
  readonly number: number;
  readonly class: string;
};
const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={`${properties.number}`} viewBox="0 0 60 60">
      <text x={30} y={54} class={`font-noto-jp text-[60px] stroke-none anchor-mid ${properties.class}`}>
        {properties.number}
      </text>
    </symbol>
  );
};

const DefineNumbers = (): JSXElement => {
  return (
    <>
      <DefineNumber number={0} class="fill-slate-600" />
      <DefineNumber number={1} class="fill-slate-600" />
      <DefineNumber number={2} class="fill-slate-600" />
      <DefineNumber number={3} class="fill-slate-600" />
      <DefineNumber number={4} class="fill-slate-600" />
      <DefineNumber number={5} class="fill-slate-600" />
      <DefineNumber number={6} class="fill-slate-600" />
      <DefineNumber number={7} class="fill-slate-600" />
    </>
  );
};

const DefineSymbols = (): JSXElement => {
  return (
    <>
      <DefineUse id="knight" href={knight.src} class="fill-stone-200 stroke-slate-900" />
      <DefineUse id="nought" href={nought.src} class="fill-none stroke-slate-600 stroke-2" />
      <DefineUse id="cross" href={cross.src} class="fill-none stroke-slate-600 stroke-2" />
    </>
  );
};

type PieceProperties = {
  readonly id: number | "cross" | "knight" | "nought" | undefined;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: PieceProperties): JSXElement => {
  return (
    <Show when={properties.id}>
      {(id) => <use href={`#${id()}`} x={properties.x} y={properties.y} height={10} width={10} />}
    </Show>
  );
};
