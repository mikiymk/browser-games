export const PlayerTypeHuman = 1001;
export const PlayerTypeAi = 1002;

export type PlayerType = typeof PlayerTypeAi | typeof PlayerTypeHuman;
