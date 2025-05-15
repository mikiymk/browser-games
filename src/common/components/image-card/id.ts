export const SPADE = "spade";
export const CLUB = "club";
export const DIAMOND = "diamond";
export const HEART = "heart";

export type CardId = "card-back" | "card-joker" | `card-${SuitName}-${Rank}`;
export type CourtRank = "j" | "k" | "q";
export type PipRank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "a" | "t";
export type Rank = CourtRank | PipRank;

export type SuitName = typeof CLUB | typeof DIAMOND | typeof HEART | typeof SPADE;
