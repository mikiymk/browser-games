import { For, Show, createEffect, createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { Cards } from "../constants";
import type { Card, CardArray, CardField, CardFieldMut, CardFieldTableau, Select } from "../constants";
import { createStore, unwrap } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { CardFront } from "./card";

/// note: for debug
const printCards = (cards: CardField): void => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(unwrap(cards));
};

const handleClick = (card: Card): void => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(card);
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
  const [select, setSelect] = createSignal<Select>({
    type: "none",
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

  /** 場札が1枚も開いていないなら開ける */
  const openTableaus = (): void => {
    setCards("tableaus", (previous): CardFieldTableau[] => {
      return previous.map(({ opened, closed }) => ({
        opened: opened.length > 0 ? opened : closed.slice(0, 1),
        closed: opened.length > 0 ? closed : closed.slice(1),
      }));
    });
  };

  /** 山札を1枚めくる */
  const openStock = (): void => {
    setCards((previous): CardFieldMut => {
      if (previous.stock.length === 0) {
        return {
          ...previous,
          stock: previous.stockOpened,
          stockOpened: [],
        };
      }

      return {
        ...previous,
        stock: previous.stock.slice(1),
        stockOpened: [...previous.stockOpened, ...previous.stock.slice(0, 1)],
      };
    });
  };

  const selectStock = (): void => {
    console.log("stock");

    setSelect({ type: "stock" });
  };

  const selectTableau = (index: number, depth: number): void => {
    console.log("tableau", index, depth);

    const selection = select();

    if (selection.type === "none") {
      setSelect({ type: "tableau", index, depth });

      return;
    }

    if (selection.type === "stock") {
      const moveCards = cards.stockOpened.slice(-1);
      setCards("stockOpened", (previous) => previous.slice(0, -1));
      setCards("tableaus", index, "opened", (previous) => [...previous, ...moveCards]);
    } else {
      const moveCards = cards.tableaus[selection.index]?.opened.slice(selection.depth);

      if (moveCards === undefined) {
        return;
      }

      setCards("tableaus", selection.index, "opened", (previous) => previous.slice(0, selection.depth));
      setCards("tableaus", index, "opened", (previous) => [...previous, ...moveCards]);
    }

    setSelect({ type: "none" });
    openTableaus();
  };

  return (
    <>
      <svg viewBox="0 0 256 144" xmlns="http://www.w3.org/2000/svg">
        <rect height={144} width={256} fill="green" />
        <title>cards</title>

        <FieldStock closed={cards.stock} opened={cards.stockOpened} openStock={openStock} selectCard={selectStock} />
        <For each={cards.tableaus}>
          {(cards, index) => (
            <FieldTableau
              index={index()}
              opened={cards.opened}
              closed={cards.closed}
              select={(depth) => {
                selectTableau(index(), depth);
              }}
            />
          )}
        </For>
        <FieldFoundations foundations={cards.foundation} handleClick={handleClick} />
      </svg>

      <Button onClick={start}>Start</Button>
    </>
  );
};

type FieldStockProperties = {
  readonly closed: readonly Card[];
  readonly opened: readonly Card[];

  readonly openStock: () => void;
  readonly selectCard: () => void;
};
const FieldStock = (properties: FieldStockProperties): JSXElement => {
  return (
    <>
      <Show
        when={properties.closed.length}
        fallback={
          <CardFront
            card="empty"
            x={10}
            y={10}
            handleClick={() => {
              properties.openStock();
            }}
          />
        }
      >
        <CardFront
          card="back"
          x={10}
          y={10}
          handleClick={() => {
            properties.openStock();
          }}
        />
      </Show>
      <Show when={properties.opened.at(-1)} fallback={<CardFront card="empty" x={45} y={10} />}>
        {(card) => (
          <CardFront
            card={card()}
            x={45}
            y={10}
            handleClick={() => {
              properties.selectCard();
            }}
          />
        )}
      </Show>
    </>
  );
};

type FieldTableauProperties = {
  readonly index: number;
  readonly opened: readonly Card[];
  readonly closed: readonly Card[];

  readonly select: (depth: number) => void;
};
const FieldTableau = (properties: FieldTableauProperties): JSXElement => {
  const x = (): number => 10 + properties.index * 35;
  return (
    <Show
      when={properties.opened.length > 0 || properties.closed.length > 0}
      fallback={
        <CardFront
          card="empty"
          x={x()}
          y={50}
          handleClick={() => {
            properties.select(0);
          }}
        />
      }
    >
      <For each={properties.closed}>{(_, index) => <CardFront card="back" x={x()} y={50 + index() * 5} />}</For>
      <For each={properties.opened}>
        {(card, index) => (
          <CardFront
            card={card}
            x={x()}
            y={50 + (properties.closed.length + index()) * 5}
            handleClick={() => {
              properties.select(index());
            }}
          />
        )}
      </For>
    </Show>
  );
};

type FieldFoundationsProperties = {
  readonly foundations: readonly [readonly Card[], readonly Card[], readonly Card[], readonly Card[]];

  readonly handleClick: (card: Card) => void;
};
const FieldFoundations = (properties: FieldFoundationsProperties): JSXElement => {
  return (
    <For each={properties.foundations}>
      {(foundation, index) => (
        <Show when={foundation.at(-1)} fallback={<CardFront card="empty" x={115 + index() * 35} y={10} />}>
          {(card) => (
            <CardFront
              card={card()}
              x={115 + index() * 35}
              y={10}
              handleClick={() => {
                console.log("foundation", index(), card());
              }}
            />
          )}
        </Show>
      )}
    </For>
  );
};
