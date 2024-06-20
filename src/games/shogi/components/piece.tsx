import piece from "@/images/shogi/piece.svg";
import type { JSXElement } from "solid-js";

type DefinePieceProperties = {
  readonly id: string;
  readonly pieces: readonly [char1: string, char2: string];
  readonly promoted?: boolean;
};

export const DefinePiece = (properties: DefinePieceProperties): JSXElement => {
  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use href={`${piece.src}#root`} height={60} width={60} class="fill-yellow-300 stroke-slate-900" />
      <text
        x="30"
        y="28"
        class={`font-noto text-[20px] anchor-mid ${properties.promoted === true ? "fill-red-600" : ""}`}
      >
        {properties.pieces[0]}
      </text>
      <text
        x="30"
        y="50"
        class={`font-noto text-[20px] anchor-mid ${properties.promoted === true ? "fill-red-600" : ""}`}
      >
        {properties.pieces[1]}
      </text>
    </symbol>
  );
};

type UsePieceProperties = {
  readonly x: number;
  readonly y: number;

  readonly piece: string;
  readonly rotate: boolean;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  return (
    <use
      href={`#${properties.piece}`}
      height={10}
      width={10}
      x={properties.x}
      y={properties.y}
      transform={properties.rotate ? "" : `rotate(180, ${properties.x + 5}, ${properties.y + 5})`}
    />
  );
};
