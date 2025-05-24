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

export const BISHOP = "bishop";
export const BISHOP_PROMOTED = "bishop-promoted";
export const GOLD = "gold";
export const KING = "king";
export const KNIGHT = "knight";
export const KNIGHT_PROMOTED = "knight-promoted";
export const LANCE = "lance";
export const LANCE_PROMOTED = "lance-promoted";
export const PAWN = "pawn";
export const PAWN_PROMOTED = "pawn-promoted";
export const QUEEN = "queen";
export const ROOK = "rook";
export const ROOK_PROMOTED = "rook-promoted";
export const SILVER = "silver";
export const SILVER_PROMOTED = "silver-promoted";

export const CHESS_PIECES = [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING] as const;
export type ChessPiece = (typeof CHESS_PIECES)[number];

export const WHITE = "white";
export const BLACK = "black";

export const CHESS_COLORS = [WHITE, BLACK] as const;
export type ChessColor = (typeof CHESS_COLORS)[number];

export const SHOGI_PIECES = [
  PAWN,
  PAWN_PROMOTED,
  LANCE,
  LANCE_PROMOTED,
  KNIGHT,
  KNIGHT_PROMOTED,
  SILVER,
  SILVER_PROMOTED,
  GOLD,
  BISHOP,
  BISHOP_PROMOTED,
  ROOK,
  ROOK_PROMOTED,
  KING,
] as const;
export type ShogiPiece = (typeof SHOGI_PIECES)[number];

export const UP = "up";
export const DOWN = "down";

export const SHOGI_DIRECTIONS = [UP, DOWN] as const;
export type ShogiDirection = (typeof SHOGI_DIRECTIONS)[number];
export type ShogiId = `${ShogiPiece}-${ShogiDirection}`;

export const CROSS = "cross";
export const NOUGHT = "nought";
export const FLAG = "flag";
export const MINE = "mine";
export const STONE = "stone";
export const STONE_KING = "stone-king";
