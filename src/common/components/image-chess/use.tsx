import type { JSXElement } from "solid-js";

import type { ChessColor, ChessPiece } from "./id.ts";

import { type ImageBound, splitBounds, UseImage } from "../use-image/use.tsx";

type UseSuitProperties = ImageBound & {
  readonly color: ChessColor;
  readonly piece: ChessPiece;
};
export const UseChessPiece = (properties: UseSuitProperties): JSXElement => {
  const bounds = splitBounds(properties);

  return <UseImage id={`${properties.piece}-${properties.color}`} {...bounds} />;
};
