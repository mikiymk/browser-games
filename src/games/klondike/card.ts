export const Suits = ["club", "diamond", "heart", "spade"] as const;
export type Suit = (typeof Suits)[number];

export const Ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type Rank = (typeof Ranks)[number];

export type Card = `${Suit}-${Rank}`;
export const Cards = [
  "club-1",
  "club-2",
  "club-3",
  "club-4",
  "club-5",
  "club-6",
  "club-7",
  "club-8",
  "club-9",
  "club-10",
  "club-11",
  "club-12",
  "club-13",

  "diamond-1",
  "diamond-2",
  "diamond-3",
  "diamond-4",
  "diamond-5",
  "diamond-6",
  "diamond-7",
  "diamond-8",
  "diamond-9",
  "diamond-10",
  "diamond-11",
  "diamond-12",
  "diamond-13",

  "heart-1",
  "heart-2",
  "heart-3",
  "heart-4",
  "heart-5",
  "heart-6",
  "heart-7",
  "heart-8",
  "heart-9",
  "heart-10",
  "heart-11",
  "heart-12",
  "heart-13",

  "spade-1",
  "spade-2",
  "spade-3",
  "spade-4",
  "spade-5",
  "spade-6",
  "spade-7",
  "spade-8",
  "spade-9",
  "spade-10",
  "spade-11",
  "spade-12",
  "spade-13",
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
      spade: "black",
      club: "black",
      diamond: "red",
      heart: "red",
    } as const
  )[card];
};
