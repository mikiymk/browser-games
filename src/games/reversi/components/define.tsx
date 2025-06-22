import { Define } from "../../../common/components/define/define.tsx";
import { Marker, Stone } from "../../../common/components/image/symbol.tsx";

import type { JSXElement } from "solid-js";

export const DefineReversiStone = (): JSXElement => {
  return (
    <Define>
      <Stone color="white" />
      <Stone color="black" />
      <Marker />
    </Define>
  );
};
