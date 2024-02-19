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
    _ = @import("./Board.test.zig");
}

black_king_general: u81,
black_fly_car: u81,
black_corner_line: u81,
black_gold_general: u81,
black_silver_general: u81,
black_cinnamon_horse: u81,
black_incense_car: u81,
black_step_soldier: u81,
black_dragon_king: u81,
black_dragon_horse: u81,
black_promoted_silver_general: u81,
black_promoted_cinnamon_horse: u81,
black_promoted_incense_car: u81,
black_to_gold: u81,
white_king_general: u81,
white_fly_car: u81,
white_corner_line: u81,
white_gold_general: u81,
white_silver_general: u81,
white_cinnamon_horse: u81,
white_incense_car: u81,
white_step_soldier: u81,
white_dragon_king: u81,
white_dragon_horse: u81,
white_promoted_silver_general: u81,
white_promoted_cinnamon_horse: u81,
white_promoted_incense_car: u81,
white_to_gold: u81,

pub fn init() Board {
    return fromString(
        \\lnsgkgsnl
        \\.r.....b.
        \\ppppppppp
        \\.........
        \\.........
        \\.........
        \\PPPPPPPPP
        \\.B.....R.
        \\LNSGKGSNL
    );
}

pub fn fromString(str: []const u8) Board {
    return .{
        .black_king_general = BitBoard.fromString(str, 'k'),
        .black_fly_car = BitBoard.fromString(str, 'r'),
        .black_corner_line = BitBoard.fromString(str, 'b'),
        .black_gold_general = BitBoard.fromString(str, 'g'),
        .black_silver_general = BitBoard.fromString(str, 's'),
        .black_cinnamon_horse = BitBoard.fromString(str, 'n'),
        .black_incense_car = BitBoard.fromString(str, 'l'),
        .black_step_soldier = BitBoard.fromString(str, 'p'),
        .black_dragon_king = BitBoard.fromString(str, 'd'),
        .black_dragon_horse = BitBoard.fromString(str, 'h'),
        .black_promoted_silver_general = BitBoard.fromString(str, 't'),
        .black_promoted_cinnamon_horse = BitBoard.fromString(str, 'o'),
        .black_promoted_incense_car = BitBoard.fromString(str, 'm'),
        .black_to_gold = BitBoard.fromString(str, 'q'),
        .white_king_general = BitBoard.fromString(str, 'K'),
        .white_fly_car = BitBoard.fromString(str, 'R'),
        .white_corner_line = BitBoard.fromString(str, 'B'),
        .white_gold_general = BitBoard.fromString(str, 'G'),
        .white_silver_general = BitBoard.fromString(str, 'S'),
        .white_cinnamon_horse = BitBoard.fromString(str, 'N'),
        .white_incense_car = BitBoard.fromString(str, 'L'),
        .white_step_soldier = BitBoard.fromString(str, 'P'),
        .white_dragon_king = BitBoard.fromString(str, 'D'),
        .white_dragon_horse = BitBoard.fromString(str, 'H'),
        .white_promoted_silver_general = BitBoard.fromString(str, 'T'),
        .white_promoted_cinnamon_horse = BitBoard.fromString(str, 'O'),
        .white_promoted_incense_car = BitBoard.fromString(str, 'M'),
        .white_to_gold = BitBoard.fromString(str, 'Q'),
    };
}

/// 指定したマスにある駒の種類を取得する。
pub fn getPieceAt(board: Board, position: u81) Game.Square {
    if (board.black_king_general & position != 0) {
        return .black_king_general;
    } else if (board.black_fly_car & position != 0) {
        return .black_fly_car;
    } else if (board.black_corner_line & position != 0) {
        return .black_corner_line;
    } else if (board.black_gold_general & position != 0) {
        return .black_gold_general;
    } else if (board.black_silver_general & position != 0) {
        return .black_silver_general;
    } else if (board.black_cinnamon_horse & position != 0) {
        return .black_cinnamon_horse;
    } else if (board.black_incense_car & position != 0) {
        return .black_incense_car;
    } else if (board.black_step_soldier & position != 0) {
        return .black_step_soldier;
    } else if (board.black_dragon_king & position != 0) {
        return .black_dragon_king;
    } else if (board.black_dragon_horse & position != 0) {
        return .black_dragon_horse;
    } else if (board.black_promoted_silver_general & position != 0) {
        return .black_promoted_silver_general;
    } else if (board.black_promoted_cinnamon_horse & position != 0) {
        return .black_promoted_cinnamon_horse;
    } else if (board.black_promoted_incense_car & position != 0) {
        return .black_promoted_incense_car;
    } else if (board.black_to_gold & position != 0) {
        return .black_to_gold;
    } else if (board.white_king_general & position != 0) {
        return .white_king_general;
    } else if (board.white_fly_car & position != 0) {
        return .white_fly_car;
    } else if (board.white_corner_line & position != 0) {
        return .white_corner_line;
    } else if (board.white_gold_general & position != 0) {
        return .white_gold_general;
    } else if (board.white_silver_general & position != 0) {
        return .white_silver_general;
    } else if (board.white_cinnamon_horse & position != 0) {
        return .white_cinnamon_horse;
    } else if (board.white_incense_car & position != 0) {
        return .white_incense_car;
    } else if (board.white_step_soldier & position != 0) {
        return .white_step_soldier;
    } else if (board.white_dragon_king & position != 0) {
        return .white_dragon_king;
    } else if (board.white_dragon_horse & position != 0) {
        return .white_dragon_horse;
    } else if (board.white_promoted_silver_general & position != 0) {
        return .white_promoted_silver_general;
    } else if (board.white_promoted_cinnamon_horse & position != 0) {
        return .white_promoted_cinnamon_horse;
    } else if (board.white_promoted_incense_car & position != 0) {
        return .white_promoted_incense_car;
    } else if (board.white_to_gold & position != 0) {
        return .white_to_gold;
    }

    return .empty;
}

pub fn getColorPieces(board: Board, color: Game.PlayerColor) u81 {
    return switch (color) {
        .black => board.black_king_general |
            board.black_fly_car |
            board.black_corner_line |
            board.black_gold_general |
            board.black_silver_general |
            board.black_cinnamon_horse |
            board.black_incense_car |
            board.black_step_soldier |
            board.black_dragon_king |
            board.black_dragon_horse |
            board.black_promoted_silver_general |
            board.black_promoted_cinnamon_horse |
            board.black_promoted_incense_car |
            board.black_to_gold,
        .white => board.white_king_general |
            board.white_fly_car |
            board.white_corner_line |
            board.white_gold_general |
            board.white_silver_general |
            board.white_cinnamon_horse |
            board.white_incense_car |
            board.white_step_soldier |
            board.white_dragon_king |
            board.white_dragon_horse |
            board.white_promoted_silver_general |
            board.white_promoted_cinnamon_horse |
            board.white_promoted_incense_car |
            board.white_to_gold,
    };
}
