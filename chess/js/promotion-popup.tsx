import { For, Show, createEffect } from "solid-js";
import { Mark, PromotionPieces, Sender } from "./types";
import { promotionTargetPieces } from "./game/get-moves";
import { PieceImage } from "./piece";
import { createReference } from "./reference";

type PromotionPopupProperties = {
  mark: Mark | undefined;
  setInput: Sender<PromotionPieces>;
};

export const PromotionPopup = (properties: PromotionPopupProperties) => {
  const dialog = createReference<HTMLDialogElement>();

  createEffect<Mark | undefined>((prev) => {
    if (prev !== properties.mark) {
      if (properties.mark !== undefined) {
        dialog.value?.showModal();
      }
    }
    return properties.mark;
  }, undefined);

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
