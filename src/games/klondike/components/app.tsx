import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { Cards } from "../constants";
import type { Card, CardField, Select } from "../constants";
import { createStore } from "solid-js/store";
import { Button } from "@/components/button";
import { shuffledArray } from "@/scripts/random-select";
import { Field } from "./field";

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
    let moves: Card[];

    // 行き元からカードを減らす処理
    if (from.type === "stock") {
      moves = cards.stockOpened.slice(-1);
      setCards("stockOpened", (previous) => previous.slice(0, -1));
    } else if (from.type === "foundation") {
      moves = cards.foundations[from.index]?.slice(-1) ?? [];

      setCards("foundations", from.index, (previous) => previous.slice(0, -1));
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
      setCards("foundations", to.index, (previous) => [...previous, ...moves]);
    } else {
      setCards("tableaus", to.index, "opened", (previous) => [...previous, ...moves]);
    }

    return true;
  };

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    setSelect({ type: "stock" });
  };

  /** 場札をクリックしたときの関数 */
  const selectTableau = (index: number, depth: number): void => {
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
      <Field
        {...cards}
        openStock={openStock}
        selectStock={selectStock}
        selectTableau={selectTableau}
        selectFoundation={selectFoundation}
      />
      <Button onClick={start}>Start</Button>
    </>
  );
};
