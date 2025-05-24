import type { JSXElement } from "solid-js";

import { CROSS, FLAG, MINE, NOUGHT } from "../../../common/components/image-symbol/id.ts";
import { Cross, Flag, Mine, Nought, Stone, StoneKing } from "../../../common/components/image-symbol/symbol.tsx";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { Define } from "../../../components/define/define.tsx";
import { image } from "./style.css.ts";

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
          <UseImage id={NOUGHT} />
        </svg>

        <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id={CROSS} />
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
