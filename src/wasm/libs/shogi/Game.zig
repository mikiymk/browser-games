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

/// 駒の種類
pub const PieceKind = enum {
    /// 王将
    king_general,
    /// 飛車
    fly_car,
    /// 角行
    corner_line,
    /// 金将
    gold_general,
    /// 銀将
    silver_general,
    /// 桂馬
    cinnamon_horse,
    /// 香車
    incense_car,
    /// 歩兵
    step_soldier,
    /// 龍王
    dragon_king,
    /// 龍馬
    dragon_horse,
    /// 成銀
    promoted_silver_general,
    /// 成桂
    promoted_cinnamon_horse,
    /// 成香
    promoted_incense_car,
    /// と金
    to_gold,

    pub fn isPromoted(self: PieceKind) bool {
        return switch (self) {
            .dragon_king,
            .dragon_horse,
            .promoted_silver_general,
            .promoted_cinnamon_horse,
            .promoted_incense_car,
            .to_gold,
            => true,
            else => false,
        };
    }

    pub fn promote(self: PieceKind) ?PieceKind {
        return switch (self) {
            .fly_car => .dragon_king,
            .corner_line => .dragon_horse,
            .silver_general => .promoted_silver_general,
            .cinnamon_horse => .promoted_cinnamon_horse,
            .incense_car => .promoted_incense_car,
            .step_soldier => .to_gold,
            else => null,
        };
    }

    pub fn unpromote(self: PieceKind) ?PieceKind {
        return switch (self) {
            .dragon_king => .fly_car,
            .dragon_horse => .corner_line,
            .promoted_silver_general => .silver_general,
            .promoted_cinnamon_horse => .cinnamon_horse,
            .promoted_incense_car => .incense_car,
            .to_gold => .step_soldier,
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
pub const Square = enum {
    empty,
    black_king_general,
    black_fly_car,
    black_corner_line,
    black_gold_general,
    black_silver_general,
    black_cinnamon_horse,
    black_incense_car,
    black_step_soldier,
    black_dragon_king,
    black_dragon_horse,
    black_promoted_silver_general,
    black_promoted_cinnamon_horse,
    black_promoted_incense_car,
    black_to_gold,
    white_king_general,
    white_fly_car,
    white_corner_line,
    white_gold_general,
    white_silver_general,
    white_cinnamon_horse,
    white_incense_car,
    white_step_soldier,
    white_dragon_king,
    white_dragon_horse,
    white_promoted_silver_general,
    white_promoted_cinnamon_horse,
    white_promoted_incense_car,
    white_to_gold,
};

current_board: Board,
current_player: PlayerColor,

pub fn init() Game {
    return .{
        .current_board = Board.init(),
        .current_player = .white,
    };
}

/// ボード用スライスに駒の情報を設定する。
pub fn setBoard(game: Game, board_slice: *[]u8) void {
    var position: u81 = 1;

    for (0..81) |i| {
        const square = game.current_board.getPieceAt(position);

        board_slice.*[i] = @intFromEnum(square);

        position <<= 1;
    }
}
