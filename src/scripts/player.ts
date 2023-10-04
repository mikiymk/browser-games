export const PlayerTypeHuman = 1001;
export const PlayerTypeAI = 1002;

export type PlayerType = typeof PlayerTypeHuman | typeof PlayerTypeAI;

export const selectPlayer = <T>(player: PlayerType, human: T, ai: T): T => {
  return player === PlayerTypeHuman ? human : ai;
};
