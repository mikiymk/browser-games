import type { JSXElement } from "solid-js";

import type { ImageBound } from "../use-image/use.tsx";
import type { ShogiDirection, ShogiPiece } from "./id.ts";

import { splitBounds, UseImage } from "../use-image/use.tsx";

type UseProperties = ImageBound & {
  readonly direction: ShogiDirection;

  readonly piece: ShogiPiece;
};
export const UseShogiPiece = (properties: UseProperties): JSXElement => {
  const bounds = splitBounds(properties);

  return <UseImage id={`${properties.piece}-${properties.direction}`} {...bounds} />;
};
