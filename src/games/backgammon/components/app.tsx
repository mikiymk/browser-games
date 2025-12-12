import type { JSXElement } from "solid-js";
import { createBackgammonGame } from "../game.ts";
 import { Page } from "../../../common/components/page-frame/page.tsx";

export const App = (): JSXElement => {
  const game = createBackgammonGame();

  return <Page />;
};
