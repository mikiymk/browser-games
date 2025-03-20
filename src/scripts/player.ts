import { TEXT_NON_PLAYER, TEXT_PLAYER } from "./constants.ts";

export const PlayerTypeHuman = "player";
export const PlayerTypeAi = "non-player";

export const playerValues: readonly { readonly value: PlayerType; readonly label: string }[] = [
  { value: PlayerTypeHuman, label: TEXT_PLAYER },
  { value: PlayerTypeAi, label: TEXT_NON_PLAYER },
];

export type PlayerType = typeof PlayerTypeAi | typeof PlayerTypeHuman;
