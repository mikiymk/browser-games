import { Use } from "@/components/define/use";
import type { JSXElement } from "solid-js";
import { COLOR_WHITE, COLOR_BLACK, MOVE_TARGET } from "../constants";

export const DefinePieces = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define stones</title>

      <symbol id="black" viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class="fill-stone-500 stroke-slate-900 stroke-2" />
      </symbol>

      <symbol id="white" viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class="fill-stone-200 stroke-slate-900 stroke-2" />
      </symbol>

      <symbol id="move" viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={15} class="fill-none stroke-slate-900 stroke-2" />
      </symbol>
    </svg>
  );
};

type UsePieceProperties = {
  readonly piece: number;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  const id = (): string | undefined => {
    const ids: Record<number, string> = {
      [COLOR_WHITE]: "black",
      [COLOR_BLACK]: "white",
      [MOVE_TARGET]: "move",
    };

    return ids[properties.piece];
  };

  return <Use id={id()} x={properties.x} y={properties.y} />;
};
