export type CardCourtRank = (typeof CARD_COURT_RANKS)[number];
export type CardId = "card-back" | "card-joker" | `card-${CardSuit}-${CardRank}`;
export type CardPipRank = (typeof CARD_PIP_RANKS)[number];
export type CardRank = CardCourtRank | CardPipRank;
export type CardSuit = (typeof CARD_SUITS)[number];

export const SPADE = "spade";
export const CLUB = "club";
export const DIAMOND = "diamond";
export const HEART = "heart";

export const CARD_SUITS = [SPADE, CLUB, DIAMOND, HEART] as const;
export const CARD_PIP_RANKS = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t"] as const;
export const CARD_COURT_RANKS = ["j", "q", "k"] as const;
export const CARD_RANKS = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t", "j", "q", "k"] as const;
