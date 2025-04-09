import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { createGame } from "../game.ts";
import { Page } from "../../../components/page/page.tsx";
import { Digits } from "./digits.tsx";
import { InputDigits } from "./input-digits.tsx";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";

export const App = (): JSXElement => {
  const [numberOfDigitsString, setNumberOfDigitsString] = createUrlQuerySignal("digits", "4");
  const numberOfDigits = (): number => Number(numberOfDigitsString());
  const game = createGame(numberOfDigits);

  return (
    <Page>
      <Digits digits={game.digits()} />
      <For each={game.guesses()}>{(guess) => <Digits digits={guess} />}</For>
      <InputDigits numberOfDigits={4} setDigits={game.addGuess} />
    </Page>
  );
};
