import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { createGame } from "../game.ts";
import { Page } from "../../../components/page/page.tsx";
import { Digits } from "./digits.tsx";
import { InputDigits } from "./input-digits.tsx";

export const App = (): JSXElement => {
  const game = createGame();

  return (
    <Page>
      <Digits digits={game.digits()} />
      <For each={game.guesses()}>{(guess) => <Digits digits={guess} />}</For>
      <InputDigits numberOfDigits={4} setDigits={game.setDigits} />
    </Page>
  );
};
