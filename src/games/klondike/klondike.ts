import { shuffledArray } from "@/scripts/random-select";
import { createStore } from "solid-js/store";
import { Cards, colorOf, rankOf, suitOf } from "./card.ts";
import type { Card } from "./card.ts";

type Pile = {
  opened: Card[];
  closed: Card[];
};

type CardField = {
  tableaus: Pile[];
  stock: Pile;
  foundations: Card[][];
};

export type Select =
  | { readonly type: "foundation"; readonly index: number }
  | { readonly type: "stock" }
  | { readonly type: "tableau"; readonly index: number; readonly depth: number };

type KlondikeObject = {
  start: () => void;

  cards: CardField;
  moveCards: (from: Select | undefined, to: Select | undefined) => boolean;
  openStock: () => void;
  autoFoundation: (from: Select) => void;
  isCleared: () => boolean;
};
export const createKlondike = (): KlondikeObject => {
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
    stock: { opened: [], closed: [] },
    foundations: [[], [], [], []],
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
      stock: { opened: [], closed: cards.slice(28) },
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
      if (previous.stock.closed.length === 0) {
        return {
          ...previous,
          stock: { opened: [], closed: previous.stock.opened },
        };
      }

      return {
        ...previous,
        stock: {
          opened: [...previous.stock.opened, ...previous.stock.closed.slice(0, 1)],
          closed: previous.stock.closed.slice(1),
        },
      };
    });
  };

  /**
   * カードを移動する
   * @param from 行き元
   * @param to 行き先
   * @returns 移動が成功したらtrue
   */
  const moveCards = (from: Select | undefined, to: Select | undefined): boolean => {
    // 行き元か行き先がない場合は何もしない
    if (from === undefined || to === undefined) {
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
      openTableaus();

      return true;
    }

    return false;
  };

  /** 行き元からカードを減らす処理 */
  const popCards = (from: Select): [moves: Card[], action: () => void] | undefined => {
    if (from.type === "stock") {
      return [
        cards.stock.opened.slice(-1),
        (): void => {
          setCards("stock", "opened", (previous) => previous.slice(0, -1));
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

    return [
      cards.tableaus[from.index]?.opened.slice(from.depth) ?? [],
      (): void => {
        setCards("tableaus", from.index, "opened", (previous) => previous.slice(0, from.depth));
      },
    ];
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

  return {
    start,
    cards,
    moveCards,
    openStock,
    autoFoundation,
    isCleared,
  };
};

const canSetFoundation = (base: Card | undefined, target: Card): boolean => {
  return (
    // 組札が空でランクが1の場合
    (base === undefined && rankOf(target) === 1) ||
    // 組札の一番上と動かすカードの一番下がスートが同じでランクが1つ違いの場合
    (base !== undefined && suitOf(base) === suitOf(target) && rankOf(base) === rankOf(target) - 1)
  );
};
