import type { JSXElement } from "solid-js";

import { Marker, Stone } from "../../../common/components/image/symbol.tsx";
import { Define } from "../../../components/define/define.tsx";

export const DefineReversiStone = (): JSXElement => {
  return (
    <Define>
      <Stone color="white" />
      <Stone color="black" />
      <Marker />
    </Define>
  );
};
