import { For } from "solid-js";
import { Black, BoardData, Empty, Index, InputType, Piece, Sender, White } from "./types";
import { getMark } from "./game/mark";
import { PieceImage } from "./piece";

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
            <Square
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

type SquareProperties = {
  square: Piece | Empty;
  index: Index;

  setInput: Sender<InputType>;
  movable: boolean;
};
const Square = (properties: SquareProperties) => {
  const isCellWhite = () => {
    const index = properties.index;
    return index % 16 >= 8 ? index % 2 !== 0 : index % 2 === 0;
  };

  return (
    <div
      classList={{
        square: true,
        "square-white": isCellWhite(),
        "square-black": !isCellWhite(),
        movable: properties.movable,
      }}
      onClick={() => properties.setInput(properties.index)}
      onDragEnter={(event) => event.preventDefault()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => properties.setInput(properties.index)}
    >
      <span
        classList={{
          piece: true,
          "piece-white": getMark(properties.square) === White,
          "piece-black": getMark(properties.square) === Black,
        }}
        draggable={properties.square !== Empty}
        onDragStart={(event) => {
          event.dataTransfer && (event.dataTransfer.effectAllowed = "move");
          properties.setInput(properties.index);
        }}
      >
        <PieceImage mark={properties.square} />
      </span>
    </div>
  );
};
