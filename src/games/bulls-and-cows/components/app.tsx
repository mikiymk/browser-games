import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { createGame } from "../game.ts";
import { Page } from "../../../components/page/page.tsx";
import { InputDigits } from "./input-digits.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { SettingItem, Settings } from "../../../components/header-buttons/settings.tsx";
import { InputNumber } from "../../../components/input/number.tsx";
import { Guess } from "./guess.tsx";

export const App = (): JSXElement => {
  const game = createGame();

  return (
    <Page
      header={
        <>
          <Start start={() => game.reset()} />
          <Settings>
            <SettingItem label="Digits">
              <InputNumber name="digits" value={game.digits().length} setValue={game.setNumberOfDigits} />
            </SettingItem>
          </Settings>
        </>
      }
    >
      <For each={game.guesses()}>{(guess) => <Guess digits={game.digits()} guess={guess} />}</For>
      <Show when={game.message()}>{(message) => message()}</Show>
      <InputDigits numberOfDigits={game.digits().length} setDigits={game.addGuess} />
    </Page>
  );
};
