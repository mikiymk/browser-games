import piece from "@/images/shogi/piece.svg";
import type { JSXElement } from "solid-js";
import { kanjiStyle, pieceStyle, redKanjiStyle } from "../style.css";

type DefinePieceProperties = {
  readonly id: string;
  readonly pieces: readonly [char1: string, char2: string];
  readonly promoted?: boolean;
};

export const DefinePiece = (properties: DefinePieceProperties): JSXElement => {
  const kanji = (): string => {
    return properties.promoted === true ? redKanjiStyle : kanjiStyle;
  };

  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use href={`${piece.src}#root`} height={60} width={60} class={pieceStyle} />
      <text x="30" y="28" class={kanji()}>
        {properties.pieces[0]}
      </text>
      <text x="30" y="50" class={kanji()}>
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
  const rotate = (): string => {
    return properties.rotate ? "" : `rotate(180, ${properties.x + 5}, ${properties.y + 5})`;
  };

  return (
    <use href={`#${properties.piece}`} height={10} width={10} x={properties.x} y={properties.y} transform={rotate()} />
  );
};
