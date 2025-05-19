import type { JSXElement } from "solid-js";

import { Define } from "../../../components/define/define.tsx";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./piece.tsx";

export const DefineChessPieces = (): JSXElement => {
  return (
    <Define>
      <King color="black" />
      <Queen color="black" />
      <Rook color="black" />
      <Bishop color="black" />
      <Knight color="black" />
      <Pawn color="black" />

      <King color="white" />
      <Queen color="white" />
      <Rook color="white" />
      <Bishop color="white" />
      <Knight color="white" />
      <Pawn color="white" />
    </Define>
  );
};
