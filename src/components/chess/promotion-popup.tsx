import { For, Show, createEffect } from "solid-js";

import {
  BlackBishop,
  BlackKnight,
  BlackQueen,
  BlackRook,
  White,
  WhiteBishop,
  WhiteKnight,
  WhiteQueen,
  WhiteRook,
} from "@/games/chess/types";
import { createReference } from "@/scripts/reference";

import { PieceImage } from "./piece";

import type { Mark, PromotionPieces, Sender, Square } from "@/games/chess/types";

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
          <For each={promotionTargetPieces}>
            {(piece, index) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: fix it later
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
                <PieceImage mark={getMark(mark(), piece)} />
              </div>
            )}
          </For>
        )}
      </Show>
    </dialog>
  );
};

const promotionTargetPieces: PromotionPieces[] = ["N", "B", "R", "Q"];

const getMark = (mark: Mark, piece: PromotionPieces): Square => {
  if (mark === White) {
    switch (piece) {
      case "N": {
        return WhiteKnight;
      }
      case "B": {
        return WhiteBishop;
      }
      case "R": {
        return WhiteRook;
      }
      case "Q": {
        return WhiteQueen;
      }
      // No default
    }
  } else {
    switch (piece) {
      case "N": {
        return BlackKnight;
      }
      case "B": {
        return BlackBishop;
      }
      case "R": {
        return BlackRook;
      }
      case "Q": {
        return BlackQueen;
      }
      // No default
    }
  }
};
