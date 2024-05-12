import { Show, createEffect } from "solid-js";
import type { JSXElement } from "solid-js";
import { Cards } from "../constants";
import type { CardField } from "../constants";
import { createStore } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { CardBack, CardEmpty } from "./card";

/// note: for debug
const printCards = (cards: CardField): void => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log({
    tableaus: [
      [[...cards.tableaus[0][0]], [...cards.tableaus[0][1]]],
      [[...cards.tableaus[1][0]], [...cards.tableaus[1][1]]],
      [[...cards.tableaus[2][0]], [...cards.tableaus[2][1]]],
      [[...cards.tableaus[3][0]], [...cards.tableaus[3][1]]],
      [[...cards.tableaus[4][0]], [...cards.tableaus[4][1]]],
      [[...cards.tableaus[5][0]], [...cards.tableaus[5][1]]],
      [[...cards.tableaus[6][0]], [...cards.tableaus[6][1]]],
    ],
    stock: [...cards.stock],
    stockOpened: [...cards.stockOpened],
    foundation: [
      [...cards.foundation[0]],
      [...cards.foundation[1]],
      [...cards.foundation[2]],
      [...cards.foundation[3]],
    ],
  } satisfies CardField);
};

export const App = (): JSXElement => {
  const [cards, setCards] = createStore<CardField>({
    tableaus: [
      [[], []],
      [[], []],
      [[], []],
      [[], []],
      [[], []],
      [[], []],
      [[], []],
    ],
    stock: [],
    stockOpened: [],
    foundation: [[], [], [], []],
  });

  createEffect(() => {
    printCards(cards);
  });

  const start = (): void => {
    setCards({
      tableaus: [
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
      ],
      stock: shuffledArray(Cards),
      stockOpened: [],
      foundation: [[], [], [], []],
    });
  };

  return (
    <>
      <svg viewBox="0 0 256 144" xmlns="http://www.w3.org/2000/svg">
        <rect height={144} width={256} fill="green" />
        <title>cards</title>

        <Show when={cards.stock.length} fallback={<CardEmpty x={10} y={10} />}>
          <CardBack x={10} y={10} />
        </Show>
      </svg>

      <Button onClick={start}>Start</Button>
    </>
  );
};
