import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { createGame } from "../game.ts";
import { Page } from "../../../components/page/page.tsx";
import { Digits } from "./digits.tsx";
import { InputDigits } from "./input-digits.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { Item, Settings } from "../../../components/header-buttons/settings.tsx";
import { InputNumber } from "../../../components/input/number.tsx";

export const App = (): JSXElement => {
  const game = createGame();

  return (
    <Page
      header={
        <>
          <Start start={() => game.reset()} />
          <Settings>
            <Item
              label="Digits"
              input={<InputNumber name="digits" value={game.digits().length} setValue={game.setNumberOfDigits} />}
            />
          </Settings>
        </>
      }
    >
      <Digits digits={game.digits()} />
      <For each={game.guesses()}>{(guess) => <Digits digits={guess} />}</For>
      <InputDigits numberOfDigits={game.digits().length} setDigits={game.addGuess} />
    </Page>
  );
};
