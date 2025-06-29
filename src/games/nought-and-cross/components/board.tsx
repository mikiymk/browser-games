import { Board } from "../../../common/components/game-board/board.tsx";
import { SquareSeparation } from "../../../common/components/game-board/square-separation.tsx";
import { CROSS_ID, NOUGHT_ID } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { CROSS, NOUGHT } from "../constants.ts";

import type { JSXElement } from "solid-js";

type CellProperties = {
  readonly mark: number;
  readonly x: number;
  readonly y: number;
};
const Cell = (properties: CellProperties): JSXElement => {
  const id = (): string | undefined => {
    switch (properties.mark) {
      case CROSS:
        return CROSS_ID;
      case NOUGHT:
        return NOUGHT_ID;
      default:
        return undefined;
    }
  };

  return <UseImage height={10} id={id()} width={10} x={properties.x} y={properties.y} />;
};

type BoardProperties = {
  readonly board: readonly number[];

  readonly click: (index: number) => void;
};
export const NncBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      data={properties.board}
      foreground={<SquareSeparation height={3} width={3} />}
      height={3}
      onClick={(_, index) => {
        properties.click(index);
      }}
      width={3}
    >
      {(mark, _, x, y) => <Cell mark={mark} x={x} y={y} />}
    </Board>
  );
};
