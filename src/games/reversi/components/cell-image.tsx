import smallStone from "@/images/reversi/stone-small.svg";
import stone from "@/images/reversi/stone.svg";
import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "../const";

type CellImageProperties = {
  readonly square: number;
  readonly x: number;
  readonly y: number;
};
export const CellImage = (properties: CellImageProperties): JSXElement => {
  const source = (): string | undefined => {
    return {
      [CellBlack]: stone.src,
      [CellWhite]: stone.src,
      [CellCanMoveBlack]: smallStone.src,
      [CellCanMoveWhite]: smallStone.src,
    }[properties.square];
  };

  const style = (): string => {
    switch (properties.square) {
      case CellBlack:
      case CellCanMoveBlack:
        return "fill-stone-500 stroke-slate-900";
      default:
        return "fill-stone-200 stroke-slate-900";
    }
  };

  return (
    <Show when={source()}>
      {(source) => (
        <use href={`${source()}#root`} x={properties.x} y={properties.y} height={10} width={10} class={style()} />
      )}
    </Show>
  );
};
