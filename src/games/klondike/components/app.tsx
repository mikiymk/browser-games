import { For, Show, createEffect } from "solid-js";
import type { JSXElement } from "solid-js";
import { Cards } from "../constants";
import type { Card, CardField, CardFieldMut, CardFieldTableaus } from "../constants";
import { createStore } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { CardBack, CardEmpty, CardFront } from "./card";

/// note: for debug
const printCards = (cards: CardField): void => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log({
    tableaus: [
      { opened: [...cards.tableaus[0].opened], closed: [...cards.tableaus[0].closed] },
      { opened: [...cards.tableaus[1].opened], closed: [...cards.tableaus[1].closed] },
      { opened: [...cards.tableaus[2].opened], closed: [...cards.tableaus[2].closed] },
      { opened: [...cards.tableaus[3].opened], closed: [...cards.tableaus[3].closed] },
      { opened: [...cards.tableaus[4].opened], closed: [...cards.tableaus[4].closed] },
      { opened: [...cards.tableaus[5].opened], closed: [...cards.tableaus[5].closed] },
      { opened: [...cards.tableaus[6].opened], closed: [...cards.tableaus[6].closed] },
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
  const [cards, setCards] = createStore<CardFieldMut>({
    tableaus: [
      { opened: [], closed: [] },
      { opened: [], closed: [] },
      { opened: [], closed: [] },
      { opened: [], closed: [] },
      { opened: [], closed: [] },
      { opened: [], closed: [] },
      { opened: [], closed: [] },
    ],
    stock: [],
    stockOpened: [],
    foundation: [[], [], [], []],
  });

  createEffect(() => {
    printCards(cards);
  });

  const start = (): void => {
    const cards = shuffledArray(Cards);
    setCards({
      tableaus: [
        { opened: [], closed: cards.slice(0, 1) },
        { opened: [], closed: cards.slice(1, 3) },
        { opened: [], closed: cards.slice(3, 6) },
        { opened: [], closed: cards.slice(6, 10) },
        { opened: [], closed: cards.slice(10, 15) },
        { opened: [], closed: cards.slice(15, 21) },
        { opened: [], closed: cards.slice(21, 28) },
      ],
      stock: cards.slice(28),
      stockOpened: [],
      foundation: [[], [], [], []],
    });

    openTableaus();
  };

  const openTableaus = (): void => {
    setCards("tableaus", (previous: CardFieldTableaus): CardFieldTableaus => {
      return previous.map(({ opened, closed }) => ({
        opened: opened.length > 0 ? opened : closed.slice(0, 1),
        closed: opened.length > 0 ? closed : closed.slice(1),
      })) as unknown as CardFieldTableaus;
    });
  };

  return (
    <>
      <svg viewBox="0 0 256 144" xmlns="http://www.w3.org/2000/svg">
        <rect height={144} width={256} fill="green" />
        <title>cards</title>

        <FieldStock stock={cards.stock} />
        <For each={cards.tableaus}>
          {(cards, index) => <FieldTableau index={index()} opened={cards.opened} closed={cards.closed} />}
        </For>

        <Show when={false}>
          <For each={Array.from({ length: 15 }, (_, n) => n)}>
            {(index) => <path d={`M0,${index * 10} 256,${index * 10}`} fill="none" stroke="red" />}
          </For>

          <For each={Array.from({ length: 26 }, (_, n) => n)}>
            {(index) => <path d={`M${index * 10},0 ${index * 10},144`} fill="none" stroke="red" />}
          </For>
        </Show>
      </svg>

      <Button onClick={start}>Start</Button>
    </>
  );
};

type FieldStockProperties = {
  readonly stock: readonly Card[];
};
const FieldStock = (properties: FieldStockProperties): JSXElement => {
  return (
    <Show when={properties.stock.length} fallback={<CardEmpty x={10} y={10} />}>
      <CardBack x={10} y={10} />
    </Show>
  );
};

type FieldTableauProperties = {
  readonly index: number;
  readonly opened: readonly Card[];
  readonly closed: readonly Card[];
};
const FieldTableau = (properties: FieldTableauProperties): JSXElement => {
  const x = (): number => 10 + properties.index * 35;
  return (
    <Show when={properties.opened.length > 0 || properties.closed.length > 0} fallback={<CardEmpty x={x()} y={50} />}>
      <For each={properties.closed}>{(_, index) => <CardBack x={x()} y={50 + index() * 5} />}</For>
      <For each={properties.opened}>
        {(card, index) => <CardFront card={card} x={x()} y={50 + (properties.closed.length + index()) * 5} />}
      </For>
    </Show>
  );
};
