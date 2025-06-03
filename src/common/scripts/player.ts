import { TEXT_NON_PLAYER, TEXT_PLAYER } from "./constants.ts";

export const PlayerTypeHuman = "player";
export const PlayerTypeAi = "non-player";

export const playerValues: readonly { readonly label: string; readonly value: PlayerType }[] = [
  { label: TEXT_PLAYER, value: PlayerTypeHuman },
  { label: TEXT_NON_PLAYER, value: PlayerTypeAi },
];

export type PlayerType = typeof PlayerTypeAi | typeof PlayerTypeHuman;
