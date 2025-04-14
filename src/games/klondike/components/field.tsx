import type { JSXElement } from "solid-js";

import { For, Show } from "solid-js";

import type { Card } from "../card.ts";
import type { Select } from "../klondike.tsx";

import { UseCard } from "./define.tsx";
import { field } from "./style.css.ts";

type FieldProperties = {
  readonly autoFoundation: (from: Select) => void;
  readonly foundations: readonly (readonly Card[])[];
  readonly openStock: () => void;

  readonly select: Select | undefined;

  readonly selectFoundation: (index: number) => void;
  readonly selectStock: () => void;
  readonly selectTableau: (index: number, depth: number) => void;
  readonly stock: {
    readonly closed: readonly Card[];
    readonly opened: readonly Card[];
  };
  readonly tableaus: readonly {
    readonly closed: readonly Card[];
    readonly opened: readonly Card[];
  }[];
};
export const Field = (properties: FieldProperties): JSXElement => {
  return (
    <svg viewBox="0 0 256 144" xmlns="http://www.w3.org/2000/svg">
      <rect class={field} height={144} width={256} />
      <title>cards</title>

      <FieldStock
        autoFoundation={properties.autoFoundation}
        closed={properties.stock.closed}
        opened={properties.stock.opened}
        openStock={properties.openStock}
        select={properties.select}
        selectCard={properties.selectStock}
      />
      <For each={properties.tableaus}>
        {(cards, index) => (
          <FieldTableau
            autoFoundation={properties.autoFoundation}
            closed={cards.closed}
            index={index()}
            opened={cards.opened}
            select={properties.select}
            selectTableau={properties.selectTableau}
          />
        )}
      </For>
      <FieldFoundations
        foundations={properties.foundations}
        select={properties.select}
        selectCard={properties.selectFoundation}
      />
    </svg>
  );
};

type FieldStockProperties = {
  readonly autoFoundation: (from: Select) => void;
  readonly closed: readonly Card[];
  readonly opened: readonly Card[];

  readonly openStock: () => void;
  readonly select: Select | undefined;
  readonly selectCard: () => void;
};
const FieldStock = (properties: FieldStockProperties): JSXElement => {
  return (
    <>
      <Show
        fallback={
          <UseCard
            card="empty"
            handleClick={() => {
              properties.openStock();
            }}
            x={10}
            y={10}
          />
        }
        when={properties.closed.length}
      >
        <UseCard
          card="back"
          handleClick={() => {
            properties.openStock();
          }}
          x={10}
          y={10}
        />
      </Show>
      <Show fallback={<UseCard card="empty" x={45} y={10} />} when={properties.opened.at(-1)}>
        {(card) => (
          <UseCard
            card={card()}
            handleClick={() => {
              properties.selectCard();
            }}
            handleDoubleClick={() => {
              properties.autoFoundation({ type: "stock" });
            }}
            selected={properties.select?.type === "stock"}
            x={45}
            y={10}
          />
        )}
      </Show>
    </>
  );
};

type FieldTableauProperties = {
  readonly autoFoundation: (from: Select) => void;
  readonly closed: readonly Card[];
  readonly index: number;
  readonly opened: readonly Card[];

  readonly select: Select | undefined;
  readonly selectTableau: (index: number, depth: number) => void;
};
const FieldTableau = (properties: FieldTableauProperties): JSXElement => {
  const x = (): number => 10 + properties.index * 35;
  return (
    <Show
      fallback={
        <UseCard
          card="empty"
          handleClick={() => {
            properties.selectTableau(properties.index, 0);
          }}
          x={x()}
          y={50}
        />
      }
      when={properties.opened.length > 0 || properties.closed.length > 0}
    >
      <For each={properties.closed}>{(_, index) => <UseCard card="back" x={x()} y={50 + index() * 5} />}</For>
      <For each={properties.opened}>
        {(card, index) => (
          <UseCard
            card={card}
            handleClick={() => {
              properties.selectTableau(properties.index, index());
            }}
            handleDoubleClick={() => {
              if (index() === properties.opened.length - 1) {
                properties.autoFoundation({ depth: index(), index: properties.index, type: "tableau" });
              }
            }}
            selected={
              properties.select?.type === "tableau" &&
              properties.select.index === properties.index &&
              properties.select.depth === index()
            }
            x={x()}
            y={50 + (properties.closed.length + index()) * 5}
          />
        )}
      </For>
    </Show>
  );
};

type FieldFoundationsProperties = {
  readonly foundations: readonly (readonly Card[])[];
  readonly select: Select | undefined;

  readonly selectCard: (index: number) => void;
};
const FieldFoundations = (properties: FieldFoundationsProperties): JSXElement => {
  return (
    <For each={properties.foundations}>
      {(foundation, index) => (
        <Show
          fallback={
            <UseCard
              card="empty"
              handleClick={() => {
                properties.selectCard(index());
              }}
              x={115 + index() * 35}
              y={10}
            />
          }
          when={foundation.at(-1)}
        >
          {(card) => (
            <UseCard
              card={card()}
              handleClick={() => {
                properties.selectCard(index());
              }}
              selected={properties.select?.type === "foundation" && properties.select.index === index()}
              x={115 + index() * 35}
              y={10}
            />
          )}
        </Show>
      )}
    </For>
  );
};
