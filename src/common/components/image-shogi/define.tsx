import type { JSXElement } from "solid-js";

import { Define } from "../../../components/define/define.tsx";
import { Piece2Letters, PieceShapeDown, PieceShapeUp } from "./piece.tsx";

export const DefineShogiPieces = (): JSXElement => {
  return (
    <Define>
      <symbol id="shogi-piece-shape-up" viewBox="0 0 60 60">
        <PieceShapeUp />
      </symbol>
      <symbol id="shogi-piece-shape-down" viewBox="0 0 60 60">
        <PieceShapeDown />
      </symbol>

      <Piece2Letters id="king" name="王将" />
      <Piece2Letters id="rook" name="飛車" />
      <Piece2Letters id="bishop" name="角行" />
      <Piece2Letters id="gold" name="金将" />
      <Piece2Letters id="silver" name="銀将" />
      <Piece2Letters id="knight" name="桂馬" />
      <Piece2Letters id="lance" name="香車" />
      <Piece2Letters id="pawn" name="歩兵" />

      <Piece2Letters id="rook-promoted" name="龍王" promoted />
      <Piece2Letters id="bishop-promoted" name="龍馬" promoted />
      <Piece2Letters id="silver-promoted" name="成銀" promoted />
      <Piece2Letters id="knight-promoted" name="成桂" promoted />
      <Piece2Letters id="lance-promoted" name="成香" promoted />
      <Piece2Letters id="pawn-promoted" name="と金" promoted />
    </Define>
  );
};
