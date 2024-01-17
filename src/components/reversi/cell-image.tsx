import stone from "@/images/reversi/stone.svg";
import smallStone from "@/images/reversi/stone-small.svg";
import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "./const";
import { blackStoneStyle, rectStyle, whiteStoneStyle } from "@/styles/reversi.css";

type CellImageProperties = {
  readonly square: number;
  readonly index: number;

  readonly click: (square: number, index: number) => void;
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
        return blackStoneStyle;
      default:
        return whiteStoneStyle;
    }
  };

  const x = (): number => properties.index % 8;
  const y = (): number => Math.floor(properties.index / 8);

  const handleClick = (): void => {
    properties.click(properties.square, properties.index);
  };

  return (
    <>
      <Show when={source()}>
        {(source) => <use href={`${source()}#root`} x={x()} y={y()} height={1} width={1} class={style()} />}
      </Show>

      <rect
        x={x()}
        y={y()}
        height={1}
        width={1}
        tabindex={0}
        onClick={handleClick}
        onKeyPress={handleClick}
        class={rectStyle}
      />
    </>
  );
};
