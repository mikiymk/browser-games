import { Use } from "@/components/define/use";
import flag from "@/images/icon/flag.svg";
import mine from "@/images/icon/mine.svg";
import type { JSXElement } from "solid-js";

export const Define = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefineSymbol />
      <DefineNumbers />
    </svg>
  );
};

const Closed = (): JSXElement => {
  return <rect height={60} width={60} class="fill-slate-400 stroke-slate-900 stroke-2" />;
};

const Opened = (): JSXElement => {
  return <rect height={60} width={60} class="fill-none stroke-slate-900 stroke-2" />;
};

const DefineSymbol = (): JSXElement => {
  return (
    <>
      <symbol id="mine" viewBox="0 0 60 60">
        <Closed />
        <use href={`${mine.src}#root`} class="fill-slate-900 stroke-slate-900 stroke-2" />
      </symbol>
      <symbol id="flag" viewBox="0 0 60 60">
        <Closed />
        <use href={`${flag.src}#root`} class="fill-red-500 stroke-slate-900 stroke-2" />
      </symbol>
      <symbol id="close" viewBox="0 0 60 60">
        <Closed />
      </symbol>
      <symbol id="open" viewBox="0 0 60 60">
        <Opened />
      </symbol>
    </>
  );
};

type DefineNumberProperties = {
  readonly number: number;
  readonly class: string;
};
const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <Opened />
      <text x={30} y={54} class={`font-noto-jp text-[60px] stroke-none anchor-mid ${properties.class}`}>
        {properties.number}
      </text>
    </symbol>
  );
};

const DefineNumbers = (): JSXElement => {
  return (
    <>
      <DefineNumber number={1} class="fill-blue-500" />
      <DefineNumber number={2} class="fill-green-500" />
      <DefineNumber number={3} class="fill-red-500" />
      <DefineNumber number={4} class="fill-fuchsia-500" />
      <DefineNumber number={5} class="fill-red-800" />
      <DefineNumber number={6} class="fill-teal-400" />
      <DefineNumber number={7} class="fill-slate-900" />
      <DefineNumber number={8} class="fill-stone-500" />
    </>
  );
};

export const UseSymbol = Use<number | "close" | "flag" | "mine" | "open">;
