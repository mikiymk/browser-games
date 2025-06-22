const Suits = ["club", "diamond", "heart", "spade"] as const;
const Ranks = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "t", "j", "q", "k"] as const;
export const Cards = Suits.flatMap((suit) => Ranks.map((rank) => `${suit}-${rank}` satisfies Card));
const CardColor = {
  club: "black",
  diamond: "red",
  heart: "red",
  spade: "black",
} as const satisfies Record<Suit, "black" | "red">;

export type Card = `${Suit}-${Rank}`;
type Rank = (typeof Ranks)[number];
type Suit = (typeof Suits)[number];

export const suitOf = (card: Card): Suit => {
  return card.split("-")[0] as Suit;
};

export const rankOf = (card: Card): Rank => {
  return card.split("-")[1] as Rank;
};

export const colorOf = (card: Suit): "black" | "red" => {
  return CardColor[card];
};

export const incrementRank = {
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "9",
  9: "t",
  a: "2",
  j: "q",
  k: undefined,
  q: "k",
  t: "j",
} as const satisfies Record<Rank, Rank | undefined>;

export const decrementRank = {
  2: "a",
  3: "2",
  4: "3",
  5: "4",
  6: "5",
  7: "6",
  8: "7",
  9: "8",
  a: undefined,
  j: "t",
  k: "q",
  q: "j",
  t: "9",
} as const satisfies Record<Rank, Rank | undefined>;
