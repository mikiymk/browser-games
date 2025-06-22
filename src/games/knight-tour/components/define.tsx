import { Define } from "../../../common/components/define/define.tsx";
import { DefineNumber } from "../../../common/components/define/define-number.tsx";
import { Knight } from "../../../common/components/image/chess-piece.tsx";
import { CROSS_ID, KNIGHT, NOUGHT_ID, WHITE } from "../../../common/components/image/id.ts";
import { Cross, Nought } from "../../../common/components/image/symbol.tsx";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { number } from "./style.css.ts";

import type { JSXElement } from "solid-js";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <DefineNumber class={number} number={0} />
      <DefineNumber class={number} number={1} />
      <DefineNumber class={number} number={2} />
      <DefineNumber class={number} number={3} />
      <DefineNumber class={number} number={4} />
      <DefineNumber class={number} number={5} />
      <DefineNumber class={number} number={6} />
      <DefineNumber class={number} number={7} />

      <Knight color={WHITE} />
      <Nought />
      <Cross />
    </Define>
  );
};

const idMap = (id: "cross" | "knight" | "nought" | number | undefined): string | undefined => {
  if (typeof id === "number") {
    return String(id);
  }
  if (id === "nought") {
    return NOUGHT_ID;
  }
  if (id === "cross") {
    return CROSS_ID;
  }
  if (id === "knight") {
    return `${KNIGHT}-${WHITE}`;
  }

  return undefined;
};

type UseProperties = {
  readonly id: "cross" | "knight" | "nought" | number | undefined;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: UseProperties): JSXElement => {
  return <UseImage height={10} id={idMap(properties.id)} width={10} x={properties.x} y={properties.y} />;
};
