import { For } from "solid-js";

import { Define } from "../define/define.tsx";
import { Back, Court, Empty, Pip } from "./card.tsx";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./chess-piece.tsx";
import { CARD_COURT_RANKS, CARD_PIP_RANKS, CARD_SUITS } from "./id.ts";
import { Piece2Letters, PieceShapeDown, PieceShapeUp } from "./shogi-piece.tsx";
import { SuitClub, SuitDiamond, SuitHeart, SuitSpade } from "./suit.tsx";

import type { JSXElement } from "solid-js";

/**
 * トランプのカードをすべて定義する
 * @returns 要素
 */
export const DefineCards = (): JSXElement => {
  return (
    <Define>
      <SuitSpade />
      <SuitClub />
      <SuitDiamond />
      <SuitHeart />

      <For each={CARD_SUITS}>
        {(suit) => (
          <>
            <For each={CARD_PIP_RANKS}>{(rank) => <Pip rank={rank} suit={suit} />}</For>
            <For each={CARD_COURT_RANKS}>{(rank) => <Court rank={rank} suit={suit} />}</For>
          </>
        )}
      </For>

      <Back />
      <Empty />
    </Define>
  );
};

/**
 * チェスの駒をすべて定義する
 * @returns 要素
 */
export const DefineChessPieces = (): JSXElement => {
  return (
    <Define>
      <King color="black" />
      <Queen color="black" />
      <Rook color="black" />
      <Bishop color="black" />
      <Knight color="black" />
      <Pawn color="black" />

      <King color="white" />
      <Queen color="white" />
      <Rook color="white" />
      <Bishop color="white" />
      <Knight color="white" />
      <Pawn color="white" />
    </Define>
  );
};

/**
 * 将棋の駒をすべて定義する
 * @returns 要素
 */
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
