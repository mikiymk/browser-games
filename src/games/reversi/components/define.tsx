import type { JSXElement } from "solid-js";

import { Define } from "../../../common/components/define/define.tsx";
import { Marker, Stone } from "../../../common/components/image/symbol.tsx";

export const DefineReversiStone = (): JSXElement => {
  return (
    <Define>
      <Stone color="white" />
      <Stone color="black" />
      <Marker />
    </Define>
  );
};
