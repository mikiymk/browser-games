import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { getLegalMove } from "@/games/knight-tour/knight-move";
import knight from "@/images/chess/knight-black.svg";
import number0 from "@/images/number/0-black.svg";
import number1 from "@/images/number/1-black.svg";
import number2 from "@/images/number/2-black.svg";
import number3 from "@/images/number/3-black.svg";
import number4 from "@/images/number/4-black.svg";
import number5 from "@/images/number/5-black.svg";
import number6 from "@/images/number/6-black.svg";
import number7 from "@/images/number/7-black.svg";
import number8 from "@/images/number/8-black.svg";
import circle from "@/images/symbol/circle-black.svg";
import cross from "@/images/symbol/cross-black.svg";
import { Match, Show, Switch, createMemo } from "solid-js";

type SquareProperties = {
  readonly board: number[];
  readonly cell: number;
  readonly index: number;

  readonly hintMode: boolean;
};
export const Square = (properties: SquareProperties) => {
  const getMovableCount = createMemo(
    () =>
      getLegalMove(properties.index).filter(
        (index) => properties.board[index] !== CellVisited && properties.board[index] !== CellKnight,
      ).length,
  );

  return (
    <Switch>
      <Match when={properties.cell === CellVisited}>
        <img src={cross.src} alt="visited" />
      </Match>

      <Match when={properties.cell === CellMovable}>
        <Show when={properties.hintMode} fallback={<img src={circle.src} alt="movable" />}>
          <Switch>
            <Match when={getMovableCount() === 0}>
              <img src={number0.src} alt="movable 0" />
            </Match>
            <Match when={getMovableCount() === 1}>
              <img src={number1.src} alt="movable 1" />
            </Match>
            <Match when={getMovableCount() === 2}>
              <img src={number2.src} alt="movable 2" />
            </Match>
            <Match when={getMovableCount() === 3}>
              <img src={number3.src} alt="movable 3" />
            </Match>
            <Match when={getMovableCount() === 4}>
              <img src={number4.src} alt="movable 4" />
            </Match>
            <Match when={getMovableCount() === 5}>
              <img src={number5.src} alt="movable 5" />
            </Match>
            <Match when={getMovableCount() === 6}>
              <img src={number6.src} alt="movable 6" />
            </Match>
            <Match when={getMovableCount() === 7}>
              <img src={number7.src} alt="movable 7" />
            </Match>
            <Match when={getMovableCount() === 8}>
              <img src={number8.src} alt="movable 8" />
            </Match>
          </Switch>
        </Show>
      </Match>
      <Match when={properties.cell === CellKnight}>
        <img src={knight.src} alt="knight" />
      </Match>
    </Switch>
  );
};
