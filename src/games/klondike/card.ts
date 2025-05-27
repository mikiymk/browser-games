const Suits = ["club", "diamond", "heart", "spade"] as const;
type Suit = (typeof Suits)[number];

const Ranks = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t", "j", "q", "k"] as const;
export type Card = `${Suit}-${Rank}`;

type Rank = (typeof Ranks)[number];
export const Cards = [
  "club-a",
  "club-2",
  "club-3",
  "club-4",
  "club-5",
  "club-6",
  "club-7",
  "club-8",
  "club-9",
  "club-t",
  "club-j",
  "club-q",
  "club-k",

  "diamond-a",
  "diamond-2",
  "diamond-3",
  "diamond-4",
  "diamond-5",
  "diamond-6",
  "diamond-7",
  "diamond-8",
  "diamond-9",
  "diamond-t",
  "diamond-j",
  "diamond-q",
  "diamond-k",

  "heart-a",
  "heart-2",
  "heart-3",
  "heart-4",
  "heart-5",
  "heart-6",
  "heart-7",
  "heart-8",
  "heart-9",
  "heart-t",
  "heart-j",
  "heart-q",
  "heart-k",

  "spade-a",
  "spade-2",
  "spade-3",
  "spade-4",
  "spade-5",
  "spade-6",
  "spade-7",
  "spade-8",
  "spade-9",
  "spade-t",
  "spade-j",
  "spade-q",
  "spade-k",
] as const satisfies Card[];

export const suitOf = (card: Card): Suit => {
  return card.split("-")[0] as Suit;
};

export const rankOf = (card: Card): Rank => {
  return Number.parseInt(card.split("-")[1] ?? "") as Rank;
};

export const colorOf = (card: Suit): "black" | "red" => {
  return (
    {
      club: "black",
      diamond: "red",
      heart: "red",
      spade: "black",
    } as const
  )[card];
};

export const incrementRank = {
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: "t",
  a: 2,
  j: "q",
  k: undefined,
  q: "k",
  t: "j",
} as const satisfies Record<Rank, Rank | undefined>;

export const decrementRank = {
  2: "a",
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  a: undefined,
  j: "t",
  k: "q",
  q: "j",
  t: 9,
} as const satisfies Record<Rank, Rank | undefined>;
