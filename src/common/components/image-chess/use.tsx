import type { JSXElement } from "solid-js";

import type { ChessColor, ChessPiece } from "./id.ts";

type UseSuitProperties = {
  readonly color: ChessColor;
  readonly height?: number | string | undefined;
  readonly piece: ChessPiece;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseChessPiece = (properties: UseSuitProperties): JSXElement => {
  return <use href={`#${properties.piece}-${properties.color}`} {...properties} />;
};
