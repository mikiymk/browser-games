import { createSignal } from "solid-js";
import type { Accessor, Setter } from "solid-js";

type Game = {
  digits: Accessor<readonly number[]>;
  setDigits: Setter<readonly number[]>;
  guesses: Accessor<readonly (readonly number[])[]>;
  setGuesses: Setter<readonly (readonly number[])[]>;
  addGuess: (guess: readonly number[]) => void;
  clearGuesses: () => void;
};

export const createGame = (): Game => {
  const [digits, setDigits] = createSignal<readonly number[]>([0, 0, 0, 0]);
  const [guesses, setGuesses] = createSignal<readonly (readonly number[])[]>([]);

  return {
    digits,
    setDigits,
    guesses,
    setGuesses,
    addGuess: (guess: readonly number[]): void => {
      setGuesses((previousGuesses) => [...previousGuesses, guess]);
    },
    clearGuesses: (): void => {
      setGuesses([]);
    },
  };
};
