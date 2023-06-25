import { For, Show, createEffect } from "solid-js";

import { createReference } from "@/chess/js/reference";
import {
  WhiteKnight,
  BlackBishop,
  BlackKnight,
  BlackQueen,
  BlackRook,
  White,
  WhiteBishop,
  WhiteQueen,
  WhiteRook,
} from "@/chess/js/types";

import { PieceImage } from "./piece";

import type { Mark, PromotionPieces, Sender } from "@/chess/js/types";

type PromotionPopupProperties = {
  mark: Mark | undefined;
  setInput: Sender<PromotionPieces>;
};

export const PromotionPopup = (properties: PromotionPopupProperties) => {
  const dialog = createReference<HTMLDialogElement>();

  createEffect<Mark | undefined>((previous) => {
    if (previous !== properties.mark && properties.mark !== undefined) {
      dialog.value?.showModal();
    }
    return properties.mark;
  });

  return (
    <dialog class="promotion" ref={dialog.setValue}>
      <Show when={properties.mark}>
        {(mark) => (
          <For each={promotionTargetPieces(mark())}>
            {(piece, index) => (
              <div
                classList={{
                  square: true,
                  "square-white": index() % 2 === 0,
                  "square-black": index() % 2 !== 0,
                }}
                onClick={() => {
                  properties.setInput(piece);
                  dialog.value?.close();
                }}
              >
                <PieceImage mark={piece} />
              </div>
            )}
          </For>
        )}
      </Show>
    </dialog>
  );
};

const promotionTargetPieces = (mark: Mark): PromotionPieces[] => {
  const promotionWhitePieces: PromotionPieces[] = [WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen];
  const promotionBlackPieces: PromotionPieces[] = [BlackKnight, BlackBishop, BlackRook, BlackQueen];

  return mark === White ? promotionWhitePieces : promotionBlackPieces;
};
