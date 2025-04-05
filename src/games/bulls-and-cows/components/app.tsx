import type { JSXElement } from "solid-js";
import { createGame } from "../game.ts";
import { Page } from "../../../components/page/page.tsx";

export const App = (): JSXElement => {
  const a = createGame();

  return <Page>{a.foo}</Page>;
};
