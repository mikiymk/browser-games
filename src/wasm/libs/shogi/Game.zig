// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;

// test import
test {
    _ = @import("./Game.test.zig");
}

pub const PrimaryPiece = enum { king, rook, bishop, gold, silver, knight, lance, pawn };

/// 駒の種類
pub const PieceKind = enum {
    /// 王将
    king,
    /// 飛車
    rook,
    /// 角行
    bishop,
    /// 金将
    gold,
    /// 銀将
    silver,
    /// 桂馬
    knight,
    /// 香車
    lance,
    /// 歩兵
    pawn,
    /// 龍王
    rook_promoted,
    /// 龍馬
    bishop_promoted,
    /// 成銀
    silver_promoted,
    /// 成桂
    knight_promoted,
    /// 成香
    lance_promoted,
    /// と金
    pawn_promoted,

    pub fn primary(self: PieceKind) PrimaryPiece {
        return switch (self) {
            .king => .king,
            .rook => .rook,
            .bishop => .bishop,
            .gold => .gold,
            .silver => .silver,
            .knight => .knight,
            .lance => .lance,
            .pawn => .pawn,
            .rook_promoted => .rook,
            .bishop_promoted => .bishop,
            .silver_promoted => .silver,
            .knight_promoted => .knight,
            .lance_promoted => .lance,
            .pawn_promoted => .pawn,
        };
    }

    pub fn fromPrimary(prim: PrimaryPiece, prom: bool) PieceKind {
        return switch (prim) {
            .king => .king,
            .rook => if (prom) .rook_promoted else .rook,
            .bishop => if (prom) .bishop_promoted else .bishop,
            .gold => .gold,
            .silver => if (prom) .silver_promoted else .silver,
            .knight => if (prom) .knight_promoted else .knight,
            .lance => if (prom) .lance_promoted else .lance,
            .pawn => if (prom) .pawn_promoted else .pawn,
        };
    }

    pub fn isPromoted(self: PieceKind) bool {
        return switch (self) {
            .rook_promoted,
            .bishop_promoted,
            .silver_promoted,
            .knight_promoted,
            .lance_promoted,
            .pawn_promoted,
            => true,
            else => false,
        };
    }

    pub fn promote(self: PieceKind) ?PieceKind {
        return switch (self) {
            .rook => .rook_promoted,
            .bishop => .bishop_promoted,
            .silver => .silver_promoted,
            .knight => .knight_promoted,
            .lance => .lance_promoted,
            .pawn => .pawn_promoted,
            else => null,
        };
    }

    pub fn unpromote(self: PieceKind) ?PieceKind {
        return switch (self) {
            .rook_promoted => .rook,
            .bishop_promoted => .bishop,
            .silver_promoted => .silver,
            .knight_promoted => .knight,
            .lance_promoted => .lance,
            .pawn_promoted => .pawn,
            else => null,
        };
    }
};

/// プレイヤーの種類
pub const PlayerColor = enum {
    /// 先手
    white,
    /// 後手
    black,

    pub fn turn(self: PlayerColor) PlayerColor {
        return switch (self) {
            .black => .white,
            .white => .black,
        };
    }
};

/// マス目の状態すべて
pub const Square = enum(u8) {
    empty = 0b0000_0000,

    black_king = 0b1000_0000,
    black_rook = 0b1000_0001,
    black_bishop = 0b1000_0010,
    black_gold = 0b1000_0011,
    black_silver = 0b1000_0100,
    black_knight = 0b1000_0101,
    black_lance = 0b1000_0110,
    black_pawn = 0b1000_0111,

    black_rook_promoted = 0b1001_0001,
    black_bishop_promoted = 0b1001_0010,
    black_silver_promoted = 0b1001_0100,
    black_knight_promoted = 0b1001_0101,
    black_lance_promoted = 0b1001_0110,
    black_pawn_promoted = 0b1001_0111,

    white_king = 0b1010_0000,
    white_rook = 0b1010_0001,
    white_bishop = 0b1010_0010,
    white_gold = 0b1010_0011,
    white_silver = 0b1010_0100,
    white_knight = 0b1010_0101,
    white_lance = 0b1010_0110,
    white_pawn = 0b1010_0111,

    white_rook_promoted = 0b1011_0001,
    white_bishop_promoted = 0b1011_0010,
    white_silver_promoted = 0b1011_0100,
    white_knight_promoted = 0b1011_0101,
    white_lance_promoted = 0b1011_0110,
    white_pawn_promoted = 0b1011_0111,

    pub fn color(self: Square) ?PlayerColor {
        return switch (self) {
            .empty => null,

            .black_king,
            .black_rook,
            .black_bishop,
            .black_gold,
            .black_silver,
            .black_knight,
            .black_lance,
            .black_pawn,
            .black_rook_promoted,
            .black_bishop_promoted,
            .black_silver_promoted,
            .black_knight_promoted,
            .black_lance_promoted,
            .black_pawn_promoted,
            => .black,

            .white_king,
            .white_rook,
            .white_bishop,
            .white_gold,
            .white_silver,
            .white_knight,
            .white_lance,
            .white_pawn,
            .white_rook_promoted,
            .white_bishop_promoted,
            .white_silver_promoted,
            .white_knight_promoted,
            .white_lance_promoted,
            .white_pawn_promoted,
            => .white,
        };
    }

    pub fn piece(self: Square) ?PieceKind {
        return switch (self) {
            .empty => null,

            .black_king, .white_king => .king,
            .black_rook, .white_rook => .rook,
            .black_bishop, .white_bishop => .bishop,
            .black_gold, .white_gold => .gold,
            .black_silver, .white_silver => .silver,
            .black_knight, .white_knight => .knight,
            .black_lance, .white_lance => .lance,
            .black_pawn, .white_pawn => .pawn,

            .black_rook_promoted, .white_rook_promoted => .rook_promoted,
            .black_bishop_promoted, .white_bishop_promoted => .bishop_promoted,
            .black_silver_promoted, .white_silver_promoted => .silver_promoted,
            .black_knight_promoted, .white_knight_promoted => .knight_promoted,
            .black_lance_promoted, .white_lance_promoted => .lance_promoted,
            .black_pawn_promoted, .white_pawn_promoted => .pawn_promoted,
        };
    }
};

const Hands = std.EnumMap(PrimaryPiece, u8);

current_board: Board,
black_hands: Hands,
white_hands: Hands,
current_player: PlayerColor,

pub fn init() Game {
    return .{
        .current_board = Board.init(),
        .black_hands = .{},
        .white_hands = .{},
        .current_player = .white,
    };
}

/// ボード用スライスに駒の情報を設定する。
pub fn setBoard(game: Game, board_slice: *[]u8) void {
    const board = game.current_board;

    @memset(board_slice.*, 0);

    setPieceToBoard(board_slice, board.white_pawn, @intFromEnum(Square.white_pawn));
    setPieceToBoard(board_slice, board.white_lance, @intFromEnum(Square.white_lance));
    setPieceToBoard(board_slice, board.white_knight, @intFromEnum(Square.white_knight));
    setPieceToBoard(board_slice, board.white_silver, @intFromEnum(Square.white_silver));
    setPieceToBoard(board_slice, board.white_gold, @intFromEnum(Square.white_gold));
    setPieceToBoard(board_slice, board.white_bishop, @intFromEnum(Square.white_bishop));
    setPieceToBoard(board_slice, board.white_rook, @intFromEnum(Square.white_rook));
    setPieceToBoard(board_slice, board.white_pawn_promoted, @intFromEnum(Square.white_pawn_promoted));
    setPieceToBoard(board_slice, board.white_knight_promoted, @intFromEnum(Square.white_knight_promoted));
    setPieceToBoard(board_slice, board.white_lance_promoted, @intFromEnum(Square.white_lance_promoted));
    setPieceToBoard(board_slice, board.white_silver_promoted, @intFromEnum(Square.white_silver_promoted));
    setPieceToBoard(board_slice, board.white_bishop_promoted, @intFromEnum(Square.white_bishop_promoted));
    setPieceToBoard(board_slice, board.white_rook_promoted, @intFromEnum(Square.white_rook_promoted));
    setPieceToBoard(board_slice, board.white_king, @intFromEnum(Square.white_king));

    setPieceToBoard(board_slice, board.black_pawn, @intFromEnum(Square.black_pawn));
    setPieceToBoard(board_slice, board.black_lance, @intFromEnum(Square.black_lance));
    setPieceToBoard(board_slice, board.black_knight, @intFromEnum(Square.black_knight));
    setPieceToBoard(board_slice, board.black_silver, @intFromEnum(Square.black_silver));
    setPieceToBoard(board_slice, board.black_gold, @intFromEnum(Square.black_gold));
    setPieceToBoard(board_slice, board.black_bishop, @intFromEnum(Square.black_bishop));
    setPieceToBoard(board_slice, board.black_rook, @intFromEnum(Square.black_rook));
    setPieceToBoard(board_slice, board.black_pawn_promoted, @intFromEnum(Square.black_pawn_promoted));
    setPieceToBoard(board_slice, board.black_knight_promoted, @intFromEnum(Square.black_knight_promoted));
    setPieceToBoard(board_slice, board.black_lance_promoted, @intFromEnum(Square.black_lance_promoted));
    setPieceToBoard(board_slice, board.black_silver_promoted, @intFromEnum(Square.black_silver_promoted));
    setPieceToBoard(board_slice, board.black_bishop_promoted, @intFromEnum(Square.black_bishop_promoted));
    setPieceToBoard(board_slice, board.black_rook_promoted, @intFromEnum(Square.black_rook_promoted));
    setPieceToBoard(board_slice, board.black_king, @intFromEnum(Square.black_king));
}

/// ボードのスライスに駒を設定する
pub fn setPieceToBoard(board: *[]u8, target: u81, value: u8) void {
    var iter = BitBoard.iterator(target);
    while (iter.next()) |n| {
        board.*[@ctz(n)] = value;
    }
}

pub fn getHandPtr(game: Game, color: PlayerColor) Hands {
    return switch (color) {
        .black => game.black_hands,
        .white => game.white_hands,
    };
}

/// 勝利したプレイヤーを得る
/// まだゲーム中ならnull
pub fn getWinner(game: Game) ?PlayerColor {
    if (game.current_board.isCheckmated(.white)) {
        return .black;
    }
    if (game.current_board.isCheckmated(.black)) {
        return .white;
    }

    return null;
}

pub fn movePositions(game: Game, from: u81) u81 {
    return game.current_board.movePositions(from);
}

/// 駒を移動する
/// 必ず成る場合は成る
/// 成るかどうか選択できる場合はtrueを返す
pub fn move(game: *Game, from: u81, to: u81) bool {
    // 持ち駒を増やす
    const capture_piece = game.current_board.getPieceAt(to);
    if (capture_piece.piece()) |p| {
        const primary_piece = p.primary();
        const hands = switch (game.current_player) {
            .black => &game.black_hands,
            .white => &game.white_hands,
        };

        const num_hand = hands.get(primary_piece) orelse 0;
        hands.put(primary_piece, num_hand +% 1);
    }

    // 駒を移動する
    game.current_board = game.current_board.movedBoard(from, to);

    // 成る
    if (game.current_board.needsPromotion(to)) {
        game.current_board = game.current_board.promotedBoard(to);
    } else if (game.current_board.canPromotion(from, to)) {
        return true;
    }

    return false;
}

pub fn hit(game: *Game, piece: PieceKind, to: u81) void {
    // 持ち駒を減らす
    const primary_piece = piece.primary();
    const hands = switch (game.current_player) {
        .black => &game.black_hands,
        .white => &game.white_hands,
    };
    const num_hand = hands.get(primary_piece) orelse 0;
    hands.put(primary_piece, num_hand -| 1);

    // 駒を追加する
    game.current_board = game.current_board.hitBoard(game.current_player, piece, to);
}

pub fn promote(game: *Game, position: u81) void {
    game.current_board = game.current_board.promotedBoard(position);
}
