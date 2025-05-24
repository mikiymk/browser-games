import type { JSXElement } from "solid-js";

import type { ImageBound } from "../use-image/use.tsx";
import type { CardId, CardSuit } from "./id.ts";

import { splitBounds, UseImage } from "../use-image/use.tsx";

type UseSuitProperties = ImageBound & {
  readonly suit: CardSuit;
};
export const UseSuit = (properties: UseSuitProperties): JSXElement => {
  const bounds = splitBounds(properties);

  return <UseImage id={properties.suit} {...bounds} />;
};

type UseCardProperties = ImageBound & {
  readonly card: CardId;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  const bounds = splitBounds(properties);

  return <UseImage id={properties.card} {...bounds} />;
};
