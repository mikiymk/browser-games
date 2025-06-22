import { Digits } from "./digits.tsx";
import { guess } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type GuessProperties = {
  readonly digits: readonly number[];
  readonly guess: readonly number[];
};

export const Guess = (properties: GuessProperties): JSXElement => {
  const bull = (): number => properties.digits.filter((digit, index) => digit === properties.guess[index]).length;
  const cow = (): number => properties.digits.filter((digit) => properties.guess.includes(digit)).length - bull();

  return (
    <span>
      <Digits digits={properties.guess} />
      <span class={guess}>{bull()} Bull</span>
      <span class={guess}>{cow()} Cow</span>
    </span>
  );
};
