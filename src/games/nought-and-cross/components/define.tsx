import type { JSXElement } from "solid-js";

import { Cross, Nought } from "../../../common/components/image/symbol.tsx";
import { Define } from "../../../components/define/define.tsx";

export const DefineNoughtAndCross = (): JSXElement => {
  return (
    <Define>
      <Nought />
      <Cross />
    </Define>
  );
};
