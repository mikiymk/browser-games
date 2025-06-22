import { For, Show } from "solid-js";

import { SettingItem, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { InputNumber } from "../../../common/components/input/number.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createGame } from "../game.ts";
import { Guess } from "./guess.tsx";
import { InputDigits } from "./input-digits.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  const { addGuess, digits, guesses, message, reset, setDigitsCount } = createGame();

  return (
    <Page
      header={
        <>
          <Start start={() => reset()} />
          <Settings>
            <SettingItem label="Digits">
              <InputNumber name="digits" setValue={setDigitsCount} value={digits().length} />
            </SettingItem>
          </Settings>
        </>
      }
    >
      <For each={guesses()}>{(guess) => <Guess digits={digits()} guess={guess} />}</For>
      <Show when={message()}>{(message) => message()}</Show>
      <InputDigits digitsCount={digits().length} setDigits={addGuess} />
    </Page>
  );
};
