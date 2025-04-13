import type { JSXElement } from "solid-js";

import { Define } from "../../../components/define/define.tsx";
import { Use } from "../../../components/define/use.tsx";
import piece from "../../../images/shogi/piece.svg";
import { classes } from "../../../scripts/classes.ts";
import { blackText, pieceStyle, pieceText, redText, reversed } from "./style.css.ts";

export const DefinePieces = (): JSXElement => {
  return (
    <Define>
      <DefinePiece piece="王将" />
      <DefinePiece piece="玉将" />
      <DefinePiece piece="飛車" />
      <DefinePiece piece="角行" />
      <DefinePiece piece="金将" />
      <DefinePiece piece="銀将" />
      <DefinePiece piece="桂馬" />
      <DefinePiece piece="香車" />
      <DefinePiece piece="歩兵" />
      <DefinePiece piece="龍王" promoted />
      <DefinePiece piece="龍馬" promoted />
      <DefinePiece piece="成銀" promoted />
      <DefinePiece piece="成桂" promoted />
      <DefinePiece piece="成香" promoted />
      <DefinePiece piece="と金" promoted />
    </Define>
  );
};

type DefinePieceProperties = {
  readonly piece: string;
  readonly promoted?: boolean;
};

const DefinePiece = (properties: DefinePieceProperties): JSXElement => {
  const color = (): string | undefined => (properties.promoted === true ? redText : blackText);

  return (
    <>
      <symbol id={properties.piece} viewBox="0 0 60 60">
        <use class={pieceStyle} height={60} href={`${piece.src}#root`} width={60} />
        <text class={classes(pieceText, color())} x="30" y="28">
          {properties.piece[0]}
        </text>
        <text class={classes(pieceText, color())} x="30" y="50">
          {properties.piece[1]}
        </text>
      </symbol>

      <symbol id={`${properties.piece}-rev`} viewBox="0 0 60 60">
        <use class={classes(pieceStyle, reversed)} height={60} href={`${piece.src}#root`} width={60} />
        <text class={classes(pieceText, color(), reversed)} x="30" y="28">
          {properties.piece[0]}
        </text>
        <text class={classes(pieceText, color(), reversed)} x="30" y="50">
          {properties.piece[1]}
        </text>
      </symbol>
    </>
  );
};

type UsePieceProperties = {
  readonly piece: string;
  readonly rotate: boolean;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  return (
    <Use id={properties.rotate ? properties.piece : `${properties.piece}-rev`} x={properties.x} y={properties.y} />
  );
};
