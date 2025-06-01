import type { JSXElement } from "solid-js";

import { Define } from "../../../common/components/define/define.tsx";
import { Cross, Nought } from "../../../common/components/image/symbol.tsx";

export const DefineNoughtAndCross = (): JSXElement => {
  return (
    <Define>
      <Nought />
      <Cross />
    </Define>
  );
};
