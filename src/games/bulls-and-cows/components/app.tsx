import type { JSXElement } from "solid-js";

import { For, Show } from "solid-js";

import { SettingItem, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { InputNumber } from "../../../common/components/input/number.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createGame } from "../game.ts";
import { Guess } from "./guess.tsx";
import { InputDigits } from "./input-digits.tsx";

export const App = (): JSXElement => {
  const game = createGame();

  return (
    <Page
      header={
        <>
          <Start start={() => game.reset()} />
          <Settings>
            <SettingItem label="Digits">
              <InputNumber name="digits" setValue={game.setNumberOfDigits} value={game.digits().length} />
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
