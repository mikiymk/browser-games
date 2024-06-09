export const PlayerTypeHuman = "player";
export const PlayerTypeAi = "non-player";

export const playerValues: readonly { readonly value: PlayerType; readonly label: string }[] = [
  { value: PlayerTypeHuman, label: "Player" },
  { value: PlayerTypeAi, label: "Non-Player" },
];

export type PlayerType = typeof PlayerTypeAi | typeof PlayerTypeHuman;

export const playerType = (query: string | null | undefined, defaultType: PlayerType): PlayerType => {
  return query === PlayerTypeHuman || query === PlayerTypeAi ? query : defaultType;
};
