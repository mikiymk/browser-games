import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CardFront } from "./card";
import type { Card } from "../card";
import type { Select } from "./app";

type FieldProperties = {
  readonly stock: {
    readonly opened: readonly Card[];
    readonly closed: readonly Card[];
  };
  readonly tableaus: readonly {
    readonly opened: readonly Card[];
    readonly closed: readonly Card[];
  }[];
  readonly foundations: readonly (readonly Card[])[];

  readonly select: Select | undefined;

  readonly openStock: () => void;
  readonly selectStock: () => void;
  readonly selectTableau: (index: number, depth: number) => void;
  readonly selectFoundation: (index: number) => void;
  readonly autoFoundation: (from: Select) => void;
};
export const Field = (properties: FieldProperties): JSXElement => {
  return (
    <svg viewBox="0 0 256 144" xmlns="http://www.w3.org/2000/svg">
      <rect height={144} width={256} fill="green" />
      <title>cards</title>

      <FieldStock
        closed={properties.stock.closed}
        opened={properties.stock.opened}
        select={properties.select}
        openStock={properties.openStock}
        selectCard={properties.selectStock}
        autoFoundation={properties.autoFoundation}
      />
      <For each={properties.tableaus}>
        {(cards, index) => (
          <FieldTableau
            index={index()}
            opened={cards.opened}
            closed={cards.closed}
            select={properties.select}
            selectTableau={properties.selectTableau}
            autoFoundation={properties.autoFoundation}
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
  readonly closed: readonly Card[];
  readonly opened: readonly Card[];
  readonly select: Select | undefined;

  readonly openStock: () => void;
  readonly selectCard: () => void;
  readonly autoFoundation: (from: Select) => void;
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
            handleDoubleClick={() => {
              properties.autoFoundation({ type: "stock" });
            }}
            selected={properties.select?.type === "stock"}
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
  readonly select: Select | undefined;

  readonly selectTableau: (index: number, depth: number) => void;
  readonly autoFoundation: (from: Select) => void;
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
            properties.selectTableau(properties.index, 0);
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
              properties.selectTableau(properties.index, index());
            }}
            selected={
              properties.select?.type === "tableau" &&
              properties.select.index === properties.index &&
              properties.select.depth === index()
            }
            handleDoubleClick={() => {
              if (index() === properties.opened.length - 1) {
                properties.autoFoundation({ type: "tableau", index: properties.index, depth: index() });
              }
            }}
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
              selected={properties.select?.type === "foundation" && properties.select.index === index()}
            />
          )}
        </Show>
      )}
    </For>
  );
};
