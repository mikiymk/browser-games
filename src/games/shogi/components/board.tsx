import { Board } from "@/components/board/board";
import type { JSXElement } from "solid-js";

type BoardProperties = {
  readonly board: readonly number[];
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board height={9} width={9} data={properties.board}>
      {() => <></>}
    </Board>
  );
};
