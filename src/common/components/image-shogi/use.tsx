import type { JSXElement } from "solid-js";

import { splitProps } from "solid-js";

import type { Direction, Id, Piece } from "./id.ts";

type UseProperties = {
  readonly direction: Direction;
  readonly height?: number | string | undefined;
  readonly piece: Piece;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseShogiPiece = (properties: UseProperties): JSXElement => {
  const [piece, others] = splitProps(properties, ["piece", "direction"]);

  return <use href={`#${piece.piece}-${piece.direction}` satisfies `#${Id}`} {...others} />;
};
