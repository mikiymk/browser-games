import { createEffect, createSignal } from "solid-js";

import { shuffledArray } from "../../common/scripts/random-select.ts";
import { createUrlQuerySignal } from "../../common/scripts/use-url-query.ts";

import type { Accessor } from "solid-js";

type Game = {
  addGuess: (guess: readonly number[]) => void;
  digits: Accessor<readonly number[]>;
  guesses: Accessor<readonly (readonly number[])[]>;

  message: Accessor<string>;
  reset: () => void;
  setDigitsCount: (value: number) => void;
};

export const createGame = (): Game => {
  const [digits, setDigits] = createSignal<readonly number[]>([0, 0, 0, 0]);
  const [guesses, setGuesses] = createSignal<readonly (readonly number[])[]>([]);
  const [digitsCountString, setDigitsCountString] = createUrlQuerySignal("digits", "4");
  const [message, setMessage] = createSignal("");

  const reset = (): void => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = shuffledArray(numbers);
    setDigits(shuffledNumbers.slice(0, Number(digitsCountString())));
    setGuesses([]);
  };

  createEffect(reset);

  return {
    addGuess: (guess: readonly number[]): void => {
      const uniqueGuess = [...new Set(guess)];
      if (uniqueGuess.length !== guess.length || guess.some((digit) => Number.isNaN(digit))) {
        setMessage("それぞれ別の数字を入力してください。");
        return;
      }

      setMessage("");
      setGuesses((previousGuesses) => [...previousGuesses, guess]);
    },
    digits,
    guesses,

    message,
    reset,
    setDigitsCount: (value: number): string => setDigitsCountString(value.toString()),
  };
};
