import { createEffect, createSignal } from "solid-js";
import type { Accessor } from "solid-js";
import { shuffledArray } from "../../scripts/random-select.ts";

type Game = {
  digits: Accessor<readonly number[]>;
  guesses: Accessor<readonly (readonly number[])[]>;

  reset: () => void;
  addGuess: (guess: readonly number[]) => void;
};

export const createGame = (numberOfDigits: Accessor<number>): Game => {
  const [digits, setDigits] = createSignal<readonly number[]>([0, 0, 0, 0]);
  const [guesses, setGuesses] = createSignal<readonly (readonly number[])[]>([]);

  const reset = (): void => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = shuffledArray(numbers);
    setDigits(shuffledNumbers.slice(0, numberOfDigits()));
    setGuesses([]);
  };

  createEffect(reset);

  return {
    digits,
    guesses,

    reset,
    addGuess: (guess: readonly number[]): void => {
      setGuesses((previousGuesses) => [...previousGuesses, guess]);
    },
  };
};
