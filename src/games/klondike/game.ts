import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { shuffledArray } from "../../common/scripts/random-select.ts";
import { Cards, colorOf, decrementRank, incrementRank, rankOf, suitOf } from "./card.ts";

import type { Accessor, Setter } from "solid-js";

import type { Card } from "./card.ts";

export type Select =
  | { readonly depth: number; readonly index: number; readonly type: "tableau" }
  | { readonly index: number; readonly type: "foundation" }
  | { readonly type: "stock" };

type KlondikeGame = {
  autoFoundation: (from: Select) => void;
  foundations: Card[][];
  openStock: () => void;
  popText: Accessor<string | undefined>;
  select: Accessor<Select | undefined>;
  selectFoundation: (index: number) => void;
  selectStock: () => void;
  selectTableau: (index: number, depth: number) => void;
  setPopText: Setter<string | undefined>;
  start: () => void;
  stock: Pile;
  tableaus: Pile[];
};

type Pile = {
  closed: Card[];
  opened: Card[];
};

export const createKlondikeGame = (): KlondikeGame => {
  const [foundations, setFoundations] = createStore<Card[][]>([[], [], [], []]);
  const [stock, setStock] = createStore<Pile>({ closed: [], opened: [] });
  const [tableaus, setTableaus] = createStore<Pile[]>([
    { closed: [], opened: [] },
    { closed: [], opened: [] },
    { closed: [], opened: [] },
    { closed: [], opened: [] },
    { closed: [], opened: [] },
    { closed: [], opened: [] },
    { closed: [], opened: [] },
  ]);

  const start = (): void => {
    const cards = shuffledArray(Cards);
    setFoundations([[], [], [], []]);
    setStock({ closed: cards.slice(28), opened: [] });
    setTableaus([
      { closed: cards.slice(0, 1), opened: [] },
      { closed: cards.slice(1, 3), opened: [] },
      { closed: cards.slice(3, 6), opened: [] },
      { closed: cards.slice(6, 10), opened: [] },
      { closed: cards.slice(10, 15), opened: [] },
      { closed: cards.slice(15, 21), opened: [] },
      { closed: cards.slice(21, 28), opened: [] },
    ]);

    openTableaus();
  };

  /** 場札が1枚も開いていないなら開ける */
  const openTableaus = (): void => {
    setTableaus((previous) => {
      return previous.map(({ closed, opened }) => ({
        closed: opened.length > 0 ? closed : closed.slice(1),
        opened: opened.length > 0 ? opened : closed.slice(0, 1),
      }));
    });
  };

  /** 山札を1枚めくる */
  const openStock = (): void => {
    setStock((previous) => {
      if (previous.closed.length === 0) {
        return { closed: previous.opened, opened: [] };
      }

      return {
        closed: previous.closed.slice(1),
        opened: [...previous.opened, ...previous.closed.slice(0, 1)],
      };
    });
  };

  /**
   * カードを移動する
   * @param from - 行き元
   * @param to - 行き先
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

  /**
   * 行き元からカードを減らす処理
   * @param from - 行き元を指定するオブジェクト
   * @returns 移動するカード、行き元のカードを減らすアクションのタプル
   */
  const popCards = (from: Select): [moves: Card[], action: () => void] | undefined => {
    if (from.type === "stock") {
      return [
        stock.opened.slice(-1),
        (): void => {
          setStock("opened", (previous) => previous.slice(0, -1));
        },
      ];
    }

    if (from.type === "foundation") {
      return [
        foundations[from.index]?.slice(-1) ?? [],
        (): void => {
          setFoundations(from.index, (previous) => previous.slice(0, -1));
        },
      ];
    }

    return [
      tableaus[from.index]?.opened.slice(from.depth) ?? [],
      (): void => {
        setTableaus(from.index, "opened", (previous) => previous.slice(0, from.depth));
      },
    ];
  };

  /**
   * 行き先にカードを増やす処理
   * @param to - 行き先を指定するオブジェクト
   * @param moves - 移動するカードのリスト
   * @returns 移動が成功したらtrue
   */
  const pushCards = (to: Select, moves: readonly Card[]): boolean => {
    const [moveBottom] = moves;
    if (moveBottom === undefined) {
      return false;
    }

    if (to.type === "foundation") {
      const foundationTop = foundations[to.index]?.at(-1);

      if (canSetFoundation(foundationTop, moveBottom)) {
        setFoundations(to.index, (previous) => [...previous, ...moves]);
        return true;
      }
    } else if (to.type === "tableau") {
      const tableauTop = tableaus[to.index]?.opened.at(-1);

      if (
        // 場札が空でランクが13の場合
        (tableauTop === undefined && rankOf(moveBottom) === "k") ||
        // 場札の一番上に比べて動かすカードの一番下が色が違ってランクが1つ小さい場合
        (tableauTop !== undefined &&
          colorOf(suitOf(tableauTop)) !== colorOf(suitOf(moveBottom)) &&
          rankOf(tableauTop) === incrementRank[rankOf(moveBottom)])
      ) {
        setTableaus(to.index, "opened", (previous) => [...previous, ...moves]);
        return true;
      }
    }

    return false;
  };

  /**
   * クリアしたかを判定する関数
   * @returns クリアした場合はtrue
   */
  const isCleared = (): boolean => {
    // 組札がすべて1から13まで順番に並んでいるか
    for (const foundation of foundations) {
      if (foundation.length !== 13) {
        return false;
      }
    }

    return true;
  };

  /**
   * 自動でカードを組札に送る関数
   * @param from - 行き元を指定するオブジェクト
   */
  const autoFoundation = (from: Select): void => {
    const foundations: Select[] = [
      { index: 0, type: "foundation" },
      { index: 1, type: "foundation" },
      { index: 2, type: "foundation" },
      { index: 3, type: "foundation" },
    ];

    for (const foundation of foundations) {
      if (moveCards(from, foundation)) {
        break;
      }
    }
  };

  const [select, setSelect] = createSignal<Select | undefined>();
  const [popText, setPopText] = createSignal<string | undefined>();

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    setSelect({ type: "stock" });
  };

  /**
   * 場札をクリックしたときの関数
   * @param index - クリックした場札のインデックス
   * @param depth - クリックした場札の深さ（0が一番上）
   */
  const selectTableau = (index: number, depth: number): void => {
    const current: Select = { depth, index, type: "tableau" };

    if (moveCards(select(), current)) {
      setSelect();
      if (isCleared()) {
        setPopText("cleared!");
      }
    } else {
      setSelect(current);
    }
  };

  /**
   * 組札をクリックしたときの関数
   * @param index - クリックした組札のインデックス
   */
  const selectFoundation = (index: number): void => {
    const current: Select = { index, type: "foundation" };

    if (moveCards(select(), current)) {
      setSelect();
      if (isCleared()) {
        setPopText("cleared!");
      }
    } else {
      setSelect(current);
    }
  };

  return {
    autoFoundation,
    foundations,
    openStock,
    popText,
    select,
    selectFoundation,
    selectStock,
    selectTableau,
    setPopText,
    start,
    stock,
    tableaus,
  };
};

const canSetFoundation = (base: Card | undefined, target: Card): boolean => {
  return (
    // 組札が空でランクが1の場合
    (base === undefined && rankOf(target) === "a") ||
    // 組札の一番上と動かすカードの一番下がスートが同じでランクが1つ違いの場合
    (base !== undefined && suitOf(base) === suitOf(target) && rankOf(base) === decrementRank[rankOf(target)])
  );
};
