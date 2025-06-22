import { Define } from "../../../common/components/define/define.tsx";
import { BLACK, MARKER, STONE, STONE_KING, WHITE } from "../../../common/components/image/id.ts";
import { Marker, Stone, StoneKing } from "../../../common/components/image/symbol.tsx";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "../constants.ts";

import type { JSXElement } from "solid-js";

const WHITE_PAWN_ID = `${STONE}-${WHITE}`;
const WHITE_KING_ID = `${STONE_KING}-${WHITE}`;
const BLACK_PAWN_ID = `${STONE}-${BLACK}`;
const BLACK_KING_ID = `${STONE_KING}-${BLACK}`;

export const DefinePieces = (): JSXElement => {
  return (
    <Define>
      <Stone color="white" />
      <Stone color="black" />
      <StoneKing color="white" />
      <StoneKing color="black" />
      <Marker />
    </Define>
  );
};

const idMap: Record<number, string> = {
  [COLOR_KING_BLACK]: BLACK_KING_ID,
  [COLOR_KING_WHITE]: WHITE_KING_ID,
  [COLOR_PAWN_BLACK]: BLACK_PAWN_ID,
  [COLOR_PAWN_WHITE]: WHITE_PAWN_ID,
  [MOVE_TARGET]: MARKER,
};

type UsePieceProperties = {
  readonly piece: number;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  return <UseImage height={10} id={idMap[properties.piece]} width={10} x={properties.x} y={properties.y} />;
};
