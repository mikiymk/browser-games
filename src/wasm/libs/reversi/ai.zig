// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;

// test import
test {
    _ = @import("./ai.test.zig");
}

/// AIが考えた打つ場所をインデックスで返します。
pub fn getAiMove(b: Board, comptime random: *const fn () f64) u6 {
    const moves = b.getValidMoves();

    // ここまでの最も良い手
    var best_place: [32]BitBoard = .{BitBoard.init()} ** 32;
    var best_place_count: u5 = 0;
    // ここまでの最も良い手の評価点
    var best_evaluation: isize = std.math.minInt(isize);

    var move_board = moves.iterator();
    while (move_board.next()) |place| {
        const child = b.move(BitBoard.fromIndex(place));
        const evaluation = alphaBeta(child, b.nextColor, 5, std.math.minInt(i32), std.math.maxInt(i32));

        if (best_place_count == 0 or evaluation > best_evaluation) {
            best_evaluation = evaluation;
            best_place[best_place_count] = BitBoard.fromIndex(place);

            best_place_count += 1;
        } else if (evaluation == best_evaluation) {
            best_place[0] = BitBoard.fromIndex(place);
            best_place_count = 1;
        }
    }

    const select_index: u6 = @intFromFloat(random() * @as(f64, @floatFromInt(best_place_count)));
    const selected_best_place = best_place[select_index];

    return @intCast(selected_best_place.board.findFirstSet().?);
}

/// αβ法を使ってよい手を探す
fn alphaBeta(b: Board, player: Board.Color, depth: u8, alpha: isize, beta: isize) isize {
    if (b.isEnd() or depth == 0) {
        if (player == .black) {
            return evaluate(b);
        } else {
            return -evaluate(b);
        }
    }

    if (b.nextColor == player) {
        var moves = b.getValidMoves().iterator();

        var new_alpha = alpha;

        while (moves.next()) |cell| {
            const child = b.move(BitBoard.fromIndex(cell));

            new_alpha = @max(new_alpha, alphaBeta(child, player, depth - 1, new_alpha, beta));
            if (new_alpha >= beta) {
                break;
            }
        }

        return new_alpha;
    } else {
        var moves = b.getValidMoves().iterator();

        var new_beta = beta;

        while (moves.next()) |cell| {
            const child = b.move(BitBoard.fromIndex(cell));

            new_beta = @min(new_beta, alphaBeta(child, player, depth - 1, alpha, new_beta));
            if (alpha >= new_beta) {
                break;
            }
        }

        return new_beta;
    }
}

/// AI用に現在の盤面の評価点数を計算します。
fn evaluate(b: Board) isize {
    // 石の数
    const black_stone_count = b.black.count();
    const white_stone_count = b.white.count();

    // 打てる場所の数
    const player_valid_count = b.getValidMoves().count();
    const opponent_board = Board{
        .black = b.black,
        .white = b.white,
        .nextColor = b.nextColor,
    };
    const opponent_valid_count = opponent_board.getValidMoves().count();

    var black_valid_count: usize = undefined;
    var white_valid_count: usize = undefined;
    if (b.nextColor == .black) {
        black_valid_count = player_valid_count;
        white_valid_count = opponent_valid_count;
    } else {
        black_valid_count = opponent_valid_count;
        white_valid_count = player_valid_count;
    }

    // 確定石の数

    return @bitCast(black_stone_count * 200 -% white_stone_count * 20 +%
        black_valid_count * 700 -% white_valid_count * 700);
}

fn randomAi(b: Board, comptime random: *const fn () f64) u6 {
    const moves = b.getValidMoves();

    const moves_count: f64 = @floatFromInt(@popCount(moves));
    const select_number: u6 = @intFromFloat(random() * moves_count);

    var count: u6 = 0;
    var move_board = moves;
    while (move_board != 0) {
        if (count == select_number) {
            return @truncate(@popCount((move_board & (~move_board + 1)) - 1));
        }

        count += 1;
        move_board &= move_board - 1;
    }

    // 見つからなかった場合
    return 0;
}
