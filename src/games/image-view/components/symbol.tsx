import { Define } from "../../../common/components/define/define.tsx";
import { CROSS_ID, FLAG, MINE, NOUGHT_ID } from "../../../common/components/image/id.ts";
import { Cross, Flag, Mine, Nought, Stone, StoneKing } from "../../../common/components/image/symbol.tsx";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { image } from "./style.css.ts";

import type { JSXElement } from "solid-js";

export const OtherSymbolImages = (): JSXElement => {
  return (
    <div>
      <Define>
        <Nought />
        <Cross />
        <Mine />
        <Flag />
        <Stone color="white" />
        <Stone color="black" />
        <StoneKing color="white" />
        <StoneKing color="black" />
      </Define>

      <div>
        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id={NOUGHT_ID} />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id={CROSS_ID} />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id={MINE} />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id={FLAG} />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id="stone-white" />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id="stone-black" />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id="stone-king-white" />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id="stone-king-black" />
        </svg>
      </div>
    </div>
  );
};
