// ID文字列

// トランプ
export const SPADE = "spade";
export const CLUB = "club";
export const DIAMOND = "diamond";
export const HEART = "heart";

// チェスと将棋
export const BISHOP = "bishop";
const BISHOP_PROMOTED = "bishop-promoted";
const GOLD = "gold";
export const KING = "king";
export const KNIGHT = "knight";
const KNIGHT_PROMOTED = "knight-promoted";
const LANCE = "lance";
const LANCE_PROMOTED = "lance-promoted";
export const PAWN = "pawn";
const PAWN_PROMOTED = "pawn-promoted";
export const QUEEN = "queen";
export const ROOK = "rook";
const ROOK_PROMOTED = "rook-promoted";
const SILVER = "silver";
const SILVER_PROMOTED = "silver-promoted";

// 駒の色
export const WHITE = "white";
export const BLACK = "black";

// 将棋の駒の方向
const UP = "up";
const DOWN = "down";

// その他
export const CROSS_ID = "cross";
export const NOUGHT_ID = "nought";
export const FLAG = "flag";
export const MINE = "mine";
export const STONE = "stone";
export const STONE_KING = "stone-king";
export const MARKER = "marker";

// IDのリスト
/** カードのスート */
export const CARD_SUITS = [SPADE, CLUB, DIAMOND, HEART] as const;
/** カードのランク (数字) */
export const CARD_PIP_RANKS = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t"] as const;
/** カードのランク (絵札) */
export const CARD_COURT_RANKS = ["j", "q", "k"] as const;
/** カードのランク (すべて) */
export const CARD_RANKS = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t", "j", "q", "k"] as const;
/** チェスの駒 */
export const CHESS_PIECES = [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING] as const;
/** チェスの色 */
export const CHESS_COLORS = [WHITE, BLACK] as const;
/** 将棋の駒 */
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
/** 将棋の駒の方向 */
export const SHOGI_DIRECTIONS = [UP, DOWN] as const;

// IDの型
export type CardCourtRank = (typeof CARD_COURT_RANKS)[number];
export type CardId = "card-back" | "card-empty" | "card-joker" | `card-${CardSuit}-${CardRank}`;
export type CardPipRank = (typeof CARD_PIP_RANKS)[number];
export type CardRank = CardCourtRank | CardPipRank;
export type CardSuit = (typeof CARD_SUITS)[number];
export type ShogiId = `${ShogiPiece}-${ShogiDirection}`;
export type ShogiPiece = (typeof SHOGI_PIECES)[number];
type ShogiDirection = (typeof SHOGI_DIRECTIONS)[number];
