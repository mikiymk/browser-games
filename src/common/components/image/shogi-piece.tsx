import type { JSXElement } from "solid-js";

import type { ShogiId, ShogiPiece } from "./id.ts";

import { close, line, move, path } from "../../scripts/svg-path.ts";
import {
  shogiPieceShape,
  shogiPieceTextDown,
  shogiPieceTextPromotedDown,
  shogiPieceTextPromotedUp,
  shogiPieceTextUp,
} from "./style.css.ts";

export const PieceShapeUp = (): JSXElement => {
  return (
    <path
      class={shogiPieceShape}
      d={path(move(30, 5), line(45, 10), line(50, 55), line(10, 55), line(15, 10), close())}
    />
  );
};

export const PieceShapeDown = (): JSXElement => {
  return (
    <path
      class={shogiPieceShape}
      d={path(move(30, 55), line(45, 50), line(50, 5), line(10, 5), line(15, 50), close())}
    />
  );
};

type DefinePieceProperties = {
  readonly id: ShogiPiece;
  readonly name: string;
  readonly promoted?: boolean;
};

export const Piece2Letters = (properties: DefinePieceProperties): JSXElement => {
  return (
    <>
      <symbol id={`${properties.id}-up` satisfies ShogiId} viewBox="0 0 60 60">
        <PieceShapeUp />
        <text class={(properties.promoted ?? false) ? shogiPieceTextPromotedUp : shogiPieceTextUp} x="30" y="28">
          {properties.name[0]}
        </text>
        <text class={(properties.promoted ?? false) ? shogiPieceTextPromotedUp : shogiPieceTextUp} x="30" y="50">
          {properties.name[1]}
        </text>
      </symbol>

      <symbol id={`${properties.id}-down` satisfies ShogiId} viewBox="0 0 60 60">
        <PieceShapeDown />
        <text class={(properties.promoted ?? false) ? shogiPieceTextPromotedDown : shogiPieceTextDown} x="30" y="28">
          {properties.name[0]}
        </text>
        <text class={(properties.promoted ?? false) ? shogiPieceTextPromotedDown : shogiPieceTextDown} x="30" y="50">
          {properties.name[1]}
        </text>
      </symbol>
    </>
  );
};
