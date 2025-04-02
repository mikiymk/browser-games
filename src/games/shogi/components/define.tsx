import type { JSXElement } from "solid-js";
import { Define } from "../../../components/define/define.tsx";
import { Use } from "../../../components/define/use.tsx";
import piece from "../../../images/shogi/piece.svg";
import { classes } from "../../../scripts/classes.ts";
import { black, pieceStyle, red, reversed, text } from "./style.css.ts";

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
  const color = (): string | undefined => (properties.promoted === true ? red : black);

  return (
    <>
      <symbol id={properties.piece} viewBox="0 0 60 60">
        <use href={`${piece.src}#root`} height={60} width={60} class={pieceStyle} />
        <text x="30" y="28" class={classes(text, color())}>
          {properties.piece[0]}
        </text>
        <text x="30" y="50" class={classes(text, color())}>
          {properties.piece[1]}
        </text>
      </symbol>

      <symbol id={`${properties.piece}-rev`} viewBox="0 0 60 60">
        <use href={`${piece.src}#root`} height={60} width={60} class={classes(pieceStyle, reversed)} />
        <text x="30" y="28" class={classes(text, color(), reversed)}>
          {properties.piece[0]}
        </text>
        <text x="30" y="50" class={classes(text, color(), reversed)}>
          {properties.piece[1]}
        </text>
      </symbol>
    </>
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
    <Use id={properties.rotate ? properties.piece : `${properties.piece}-rev`} x={properties.x} y={properties.y} />
  );
};
