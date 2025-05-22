import type { JSXElement } from "solid-js";

import type { CardId, CardSuit } from "./id.ts";

type UseSuitProperties = {
  readonly height?: number | string | undefined;
  readonly suit: CardSuit;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseSuit = (properties: UseSuitProperties): JSXElement => {
  return <use href={`#${properties.suit}`} {...properties} />;
};

type UseCardProperties = {
  readonly card: CardId;
  readonly height?: number | string | undefined;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  return <use href={`#${properties.card}`} {...properties} />;
};
