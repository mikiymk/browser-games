import type { JSXElement } from "solid-js";

import { Page } from "../../../components/page/page.tsx";
import { CardImage } from "./card.tsx";
import { ChessImage } from "./chess.tsx";
import { ShogiImages } from "./shogi.tsx";

export const App = (): JSXElement => {
  return (
    <Page>
      <CardImage />
      <ChessImage />
      <ShogiImages />
    </Page>
  );
};
