import { createEffect, createSignal } from "solid-js";
import type { Accessor } from "solid-js";
import { shuffledArray } from "../../scripts/random-select.ts";
import { createUrlQuerySignal } from "../../scripts/use-url-query.ts";

type Game = {
  digits: Accessor<readonly number[]>;
  guesses: Accessor<readonly (readonly number[])[]>;

  reset: () => void;
  setNumberOfDigits: (value: number) => void;
  addGuess: (guess: readonly number[]) => void;
};

export const createGame = (): Game => {
  const [digits, setDigits] = createSignal<readonly number[]>([0, 0, 0, 0]);
  const [guesses, setGuesses] = createSignal<readonly (readonly number[])[]>([]);
  const [numberOfDigitsString, setNumberOfDigitsString] = createUrlQuerySignal("digits", "4");

  const reset = (): void => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = shuffledArray(numbers);
    setDigits(shuffledNumbers.slice(0, Number(numberOfDigitsString())));
    setGuesses([]);
  };

  createEffect(reset);

  return {
    digits,
    guesses,

    reset,
    setNumberOfDigits: (value: number): string => setNumberOfDigitsString(value.toString()),
    addGuess: (guess: readonly number[]): (readonly number[])[] =>
      setGuesses((previousGuesses) => [...previousGuesses, guess]),
  };
};
