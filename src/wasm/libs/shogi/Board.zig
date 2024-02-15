// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
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
    return .{
        .black_king_general = 0,
        .black_fly_car = 0,
        .black_corner_line = 0,
        .black_gold_general = 0,
        .black_silver_general = 0,
        .black_cinnamon_horse = 0,
        .black_incense_car = 0,
        .black_step_soldier = 0,
        .black_dragon_king = 0,
        .black_dragon_horse = 0,
        .black_promoted_silver_general = 0,
        .black_promoted_cinnamon_horse = 0,
        .black_promoted_incense_car = 0,
        .black_to_gold = 0,
        .white_king_general = 0,
        .white_fly_car = 0,
        .white_corner_line = 0,
        .white_gold_general = 0,
        .white_silver_general = 0,
        .white_cinnamon_horse = 0,
        .white_incense_car = 0,
        .white_step_soldier = 0,
        .white_dragon_king = 0,
        .white_dragon_horse = 0,
        .white_promoted_silver_general = 0,
        .white_promoted_cinnamon_horse = 0,
        .white_promoted_incense_car = 0,
        .white_to_gold = 0,
    };
}
