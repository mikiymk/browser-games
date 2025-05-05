export const SPADE = "spade";
export const CLUB = "club";
export const DIAMOND = "diamond";
export const HEART = "heart";

export type CardId = "card-joker" | `card-${SuitName}-${CardNumber}`;
export type CardNumber = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "A" | "J" | "K" | "Q";
export type SuitId = `suit-${SuitName}`;
export type SuitName = typeof CLUB | typeof DIAMOND | typeof HEART | typeof SPADE;
