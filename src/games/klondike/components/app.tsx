import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { Field } from "./field";
import { Cards, colorOf, rankOf, suitOf } from "../card";
import type { Card } from "../card";
import { PopUp } from "@/games/shogi/components/pop-up";

export type CardField = {
  tableaus: {
    opened: Card[];
    closed: Card[];
  }[];
  stock: Card[];
  stockOpened: Card[];
  foundations: [Card[], Card[], Card[], Card[]];
};

export type Select =
  | { readonly type: "foundation"; readonly index: number }
  | { readonly type: "none" }
  | { readonly type: "stock" }
  | { readonly type: "tableau"; readonly index: number; readonly depth: number };

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
    foundations: [[], [], [], []],
  });
  const [select, setSelect] = createSignal<Select>({
    type: "none",
  });
  const [popText, setPopText] = createSignal<string | undefined>();

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
      foundations: [[], [], [], []],
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
    const popCard = popCards(from);
    if (popCard === undefined) {
      return false;
    }
    const [moves, action] = popCard;

    if (pushCards(to, moves)) {
      action();
      setSelect({ type: "none" });
      openTableaus();
      if (isCleared()) {
        setPopText("cleared!");
      }
      return true;
    }

    return false;
  };

  /** 行き元からカードを減らす処理 */
  const popCards = (from: Select): [moves: Card[], action: () => void] | undefined => {
    if (from.type === "stock") {
      return [
        cards.stockOpened.slice(-1),
        (): void => {
          setCards("stockOpened", (previous) => previous.slice(0, -1));
        },
      ];
    }

    if (from.type === "foundation") {
      return [
        cards.foundations[from.index]?.slice(-1) ?? [],
        (): void => {
          setCards("foundations", from.index, (previous) => previous.slice(0, -1));
        },
      ];
    }

    if (from.type === "tableau") {
      return [
        cards.tableaus[from.index]?.opened.slice(from.depth) ?? [],
        (): void => {
          setCards("tableaus", from.index, "opened", (previous) => previous.slice(0, from.depth));
        },
      ];
    }

    return undefined;
  };

  const canSetFoundation = (base: Card | undefined, target: Card): boolean => {
    return (
      // 組札が空でランクが1の場合
      (base === undefined && rankOf(target) === 1) ||
      // 組札の一番上と動かすカードの一番下がスートが同じでランクが1つ違いの場合
      (base !== undefined && suitOf(base) === suitOf(target) && rankOf(base) === rankOf(target) - 1)
    );
  };

  /** 行き先にカードを増やす処理 */
  const pushCards = (to: Select, moves: readonly Card[]): boolean => {
    const [moveBottom] = moves;
    if (moveBottom === undefined) {
      return false;
    }

    if (to.type === "foundation") {
      const foundationTop = cards.foundations[to.index]?.at(-1);

      if (canSetFoundation(foundationTop, moveBottom)) {
        setCards("foundations", to.index, (previous) => [...previous, ...moves]);
        return true;
      }
    } else if (to.type === "tableau") {
      const tableauTop = cards.tableaus[to.index]?.opened.at(-1);

      if (
        // 場札が空でランクが13の場合
        (tableauTop === undefined && rankOf(moveBottom) === 13) ||
        // 場札の一番上に比べて動かすカードの一番下が色が違ってランクが1つ小さい場合
        (tableauTop !== undefined &&
          colorOf(suitOf(tableauTop)) !== colorOf(suitOf(moveBottom)) &&
          rankOf(tableauTop) === rankOf(moveBottom) + 1)
      ) {
        setCards("tableaus", to.index, "opened", (previous) => [...previous, ...moves]);
        return true;
      }
    }

    return false;
  };

  /** クリアしたかを判定する関数 */
  const isCleared = (): boolean => {
    // 組札がすべて1から13まで順番に並んでいるか
    for (const foundation of cards.foundations) {
      if (foundation.length !== 13) {
        return false;
      }
    }

    return true;
  };

  /** 自動でカードを組札に送る関数 */
  const autoFoundation = (from: Select): void => {
    const foundations: Select[] = [
      { type: "foundation", index: 0 },
      { type: "foundation", index: 1 },
      { type: "foundation", index: 2 },
      { type: "foundation", index: 3 },
    ];

    for (const foundation of foundations) {
      if (moveCards(from, foundation)) {
        break;
      }
    }
  };

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    setSelect({ type: "stock" });
  };

  /** 場札をクリックしたときの関数 */
  const selectTableau = (index: number, depth: number): void => {
    const current: Select = { type: "tableau", index, depth };

    if (!moveCards(select(), current)) {
      setSelect(current);
    }
  };

  /** 組札をクリックしたときの関数 */
  const selectFoundation = (index: number): void => {
    const current: Select = { type: "foundation", index };

    if (!moveCards(select(), current)) {
      setSelect(current);
    }
  };

  return (
    <>
      <Field
        {...cards}
        select={select()}
        openStock={openStock}
        selectStock={selectStock}
        selectTableau={selectTableau}
        selectFoundation={selectFoundation}
        autoFoundation={autoFoundation}
      />
      <Button onClick={start}>Start</Button>

      <PopUp open={popText() !== undefined}>
        {popText()}
        <br />
        <Button
          onClick={() => {
            setPopText();
          }}
        >
          Close
        </Button>
      </PopUp>
    </>
  );
};
