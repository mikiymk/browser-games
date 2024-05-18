import { For, Show, createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { Cards } from "../constants";
import type { Card, CardField, Select } from "../constants";
import { createStore } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { CardFront } from "./card";

export const App = (): JSXElement => {
  const [cards, setCards] = createStore<CardField>({
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
    setCards("tableaus", (previous) => {
      return previous.map(({ opened, closed }) => ({
        opened: opened.length > 0 ? opened : closed.slice(0, 1),
        closed: opened.length > 0 ? closed : closed.slice(1),
      }));
    });
  };

  /** 山札を1枚めくる */
  const openStock = (): void => {
    setCards((previous): CardField => {
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

  /**
   * カードを移動する
   * @param from 行き元
   * @param to 行き先
   * @returns 移動が成功したらtrue
   */
  const moveCards = (from: Select, to: Select): boolean => {
    // 行き元か行き先がない場合は何もしない
    if (from.type === "none" || to.type === "none") {
      return false;
    }

    // 動かすカードのリスト
    let moves: Card[];

    // 行き元からカードを減らす処理
    if (from.type === "stock") {
      moves = cards.stockOpened.slice(-1);
      setCards("stockOpened", (previous) => previous.slice(0, -1));
    } else if (from.type === "foundation") {
      moves = cards.foundation[from.index]?.slice(-1) ?? [];

      setCards("foundation", from.index, (previous) => previous.slice(0, -1));
    } else {
      moves = cards.tableaus[from.index]?.opened.slice(from.depth) ?? [];

      setCards("tableaus", from.index, "opened", (previous) => previous.slice(0, from.depth));
    }

    // カードがないなら何もしない
    if (moves.length === 0) {
      return false;
    }

    // 行き先にカードを増やす処理
    if (to.type === "stock") {
      // 何もしない
      return false;
    }

    if (to.type === "foundation") {
      setCards("foundation", to.index, (previous) => [...previous, ...moves]);
    } else {
      setCards("tableaus", to.index, "opened", (previous) => [...previous, ...moves]);
    }

    return true;
  };

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    console.log("stock");

    setSelect({ type: "stock" });
  };

  /** 場札をクリックしたときの関数 */
  const selectTableau = (index: number, depth: number): void => {
    console.log("tableau", index, depth);

    const current: Select = { type: "tableau", index, depth };

    if (moveCards(select(), current)) {
      setSelect({ type: "none" });
      openTableaus();
    } else {
      setSelect(current);
    }
  };

  /** 組札をクリックしたときの関数 */
  const selectFoundation = (index: number): void => {
    console.log("foundation", index);

    const current: Select = { type: "foundation", index };

    if (moveCards(select(), current)) {
      setSelect({ type: "none" });
      openTableaus();
    } else {
      setSelect(current);
    }
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
        <FieldFoundations foundations={cards.foundation} selectCard={selectFoundation} />
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

  readonly selectCard: (index: number) => void;
};
const FieldFoundations = (properties: FieldFoundationsProperties): JSXElement => {
  return (
    <For each={properties.foundations}>
      {(foundation, index) => (
        <Show
          when={foundation.at(-1)}
          fallback={
            <CardFront
              card="empty"
              x={115 + index() * 35}
              y={10}
              handleClick={() => {
                properties.selectCard(index());
              }}
            />
          }
        >
          {(card) => (
            <CardFront
              card={card()}
              x={115 + index() * 35}
              y={10}
              handleClick={() => {
                properties.selectCard(index());
              }}
            />
          )}
        </Show>
      )}
    </For>
  );
};
