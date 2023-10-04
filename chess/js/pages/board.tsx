import { For } from "solid-js";

import { Empty } from "@/chess/js/types";

import { PieceImage } from "./piece";

import type { BoardData, Index, InputType, Sender, Square } from "@/chess/js/types";

type BoardProperties = {
  board: BoardData;

  setInput: Sender<InputType>;
  movableSquares: Index[];
};

export const Board = (properties: BoardProperties) => {
  return (
    <div class="board">
      <For each={properties.board}>
        {(square, index) => {
          return (
            <BoardSquare
              square={square}
              index={index() as Index}
              setInput={properties.setInput}
              movable={properties.movableSquares.includes(index() as Index)}
            />
          );
        }}
      </For>
    </div>
  );
};

type BoardSquareProperties = {
  square: Square;
  index: Index;

  setInput: Sender<InputType>;
  movable: boolean;
};
const BoardSquare = (properties: BoardSquareProperties) => {
  const isCellWhite = () => {
    const index = properties.index;
    return index % 16 >= 8 ? index % 2 !== 0 : index % 2 === 0;
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: fix it later
    <div
      classList={{
        square: true,
        "square-white": isCellWhite(),
        "square-black": !isCellWhite(),
        movable: properties.movable,
      }}
      onClick={() => {
        properties.setInput(properties.index);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={() => {
        properties.setInput(properties.index);
      }}
    >
      <span
        draggable={properties.square !== Empty}
        onDragStart={(event) => {
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
          }
          properties.setInput(properties.index);
        }}
      >
        <PieceImage mark={properties.square} />
      </span>
    </div>
  );
};
