import type { JSXElement } from "solid-js";

import { BLACK, MARKER, STONE, WHITE } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "../constants.ts";

type CellImageProperties = {
  readonly square: number;
  readonly x: number;
  readonly y: number;
};
export const CellImage = (properties: CellImageProperties): JSXElement => {
  const id = (): string | undefined => {
    switch (properties.square) {
      case CellBlack:
        return `${STONE}-${BLACK}`;
      case CellCanMoveBlack:
      case CellCanMoveWhite:
        return MARKER;
      case CellWhite:
        return `${STONE}-${WHITE}`;
      default:
        return undefined;
    }
  };

  return <UseImage height={10} id={id()} width={10} x={properties.x} y={properties.y} />;
};
