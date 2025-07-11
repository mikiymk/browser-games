import { Page } from "../../../common/components/page-frame/page.tsx";
import { CardImage } from "./card.tsx";
import { ChessImage } from "./chess.tsx";
import { ShogiImages } from "./shogi.tsx";
import { OtherSymbolImages } from "./symbol.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  return (
    <Page>
      <CardImage />
      <ChessImage />
      <ShogiImages />
      <OtherSymbolImages />
    </Page>
  );
};
