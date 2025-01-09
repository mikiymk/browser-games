// std import
const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const AllocError = Allocator.Error;

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const Color = Board.Color;

// test import
test {
    _ = @import("./ai.test.zig");
}

const Move = struct { from: BitBoard, to: BitBoard };
const MoveList = std.ArrayList(Move);

/// AIが考えた打つ場所を返します。
pub fn getAiMove(board: Board, allocator: Allocator, color: Color, depth: u8, comptime random: *const fn () f64) AllocError!Move {
    // 次の手のリスト
    const moves = try getValidMoves(board, allocator, color);
    defer allocator.free(moves);

    // ここまでの最も良い手
    var best_places = MoveList.init(allocator);
    defer best_places.deinit();
    // ここまでの最も良い手の評価点
    var best_evaluation: isize = std.math.minInt(isize);

    for (moves) |from_moves| {
        const from = from_moves.from;

        var to_iter = from_moves.to.iterator();
        while (to_iter.next()) |to| {
            const to_board = BitBoard.initWithIndex(to);
            const moved = board.getMovedBoard(from, to_board);

            const evaluation = try alphaBeta(
                moved,
                allocator,
                color,
                color.turn(),
                depth,
                std.math.minInt(i32),
                std.math.maxInt(i32),
            );

            if (best_places.items.len == 0 or evaluation > best_evaluation) {
                best_evaluation = evaluation;
                best_places.items.len = 0;
                try best_places.append(.{ .from = from, .to = to_board });
            } else if (evaluation == best_evaluation) {
                try best_places.append(.{ .from = from, .to = to_board });
            }
        }
    }

    const select_index: u6 = @intFromFloat(random() * @as(f64, @floatFromInt(best_places.items.len)));
    return best_places.items[select_index];
}

/// 合法手をすべてリストする
fn getValidMoves(board: Board, allocator: Allocator, color: Color) AllocError![]Move {
    var moves = MoveList.init(allocator);

    const boards = board.boards.get(color);

    for (boards.values) |b| {
        var iter = b.iterator();

        while (iter.next()) |current| {
            const to = board.getMove(BitBoard.initWithIndex(current));

            if (!to.isEmpty()) {
                try moves.append(.{
                    .from = BitBoard.initWithIndex(current),
                    .to = to,
                });
            }
        }
    }

    return moves.toOwnedSlice();
}

/// αβ法を使ってよい手を探す
/// - player_color - 最大の手を見つけたい色
fn alphaBeta(board: Board, allocator: Allocator, player_color: Color, current_color: Color, depth: u8, alpha: isize, beta: isize) AllocError!isize {
    const moves = try getValidMoves(board, allocator, current_color);
    defer allocator.free(moves);

    // ボードの評価を計算する
    if (depth == 0 or moves.len == 0) {
        if (current_color == player_color) {
            return evaluate(board);
        } else {
            return -evaluate(board);
        }
    }

    if (current_color == player_color) {
        var new_alpha = alpha;
        var value: isize = std.math.minInt(isize);

        moves_loop: for (moves) |from_moves| {
            const from = from_moves.from;

            var to_iter = from_moves.to.iterator();
            while (to_iter.next()) |to| {
                const moved = board.getMovedBoard(from, BitBoard.initWithIndex(to));

                value = @max(value, try alphaBeta(
                    moved,
                    allocator,
                    player_color,
                    current_color.turn(),
                    depth - 1,
                    new_alpha,
                    beta,
                ));

                // { // fail-soft
                //     new_alpha = @max(new_alpha, value);

                //     if (value >= beta) {
                //         // beta cutoff
                //         break :moves_loop;
                //     }
                // }

                { // fail-hard
                    if (value > beta) {
                        // beta cutoff
                        break :moves_loop;
                    }

                    new_alpha = @max(new_alpha, value);
                }
            }
        }

        return new_alpha;
    } else {
        var new_beta = beta;
        var value: isize = std.math.maxInt(isize);

        moves_loop: for (moves) |from_moves| {
            const from = from_moves.from;

            var to_iter = from_moves.to.iterator();
            while (to_iter.next()) |to| {
                const moved = board.getMovedBoard(from, BitBoard.initWithIndex(to));

                value = @min(value, try alphaBeta(
                    moved,
                    allocator,
                    player_color,
                    current_color.turn(),
                    depth - 1,
                    alpha,
                    new_beta,
                ));

                // { // fail-soft
                //     new_beta = @min(new_beta, value);

                //     if (value < alpha) {
                //         // alpha cutoff
                //         break :moves_loop;
                //     }
                // }

                { // fail-hard
                    if (value < alpha) {
                        // alpha cutoff
                        break :moves_loop;
                    }

                    new_beta = @min(new_beta, value);
                }
            }
        }

        return new_beta;
    }
}

/// AI用に現在の盤面の評価点数を計算します。
/// 黒に有利なら+、白に有利なら-
fn evaluate(board: Board) isize {
    // 駒の数
    const black_pawn_count: isize = @intCast(board.boards.get(.black).get(.pawn).count());
    const black_knight_count: isize = @intCast(board.boards.get(.black).get(.knight).count());
    const black_bishop_count: isize = @intCast(board.boards.get(.black).get(.bishop).count());
    const black_rook_count: isize = @intCast(board.boards.get(.black).get(.rook).count());
    const black_queen_count: isize = @intCast(board.boards.get(.black).get(.queen).count());
    const black_king_count: isize = @intCast(board.boards.get(.black).get(.king).count());
    const white_pawn_count: isize = @intCast(board.boards.get(.white).get(.pawn).count());
    const white_knight_count: isize = @intCast(board.boards.get(.white).get(.knight).count());
    const white_bishop_count: isize = @intCast(board.boards.get(.white).get(.bishop).count());
    const white_rook_count: isize = @intCast(board.boards.get(.white).get(.rook).count());
    const white_queen_count: isize = @intCast(board.boards.get(.white).get(.queen).count());
    const white_king_count: isize = @intCast(board.boards.get(.white).get(.king).count());

    const black_pieces_count =
        black_pawn_count * 1 +
        black_knight_count * 3 +
        black_bishop_count * 3 +
        black_rook_count * 5 +
        black_queen_count * 7 +
        black_king_count * 999;

    const white_pieces_count =
        white_pawn_count * 1 +
        white_knight_count * 3 +
        white_bishop_count * 3 +
        white_rook_count * 5 +
        white_queen_count * 7 +
        white_king_count * 999;

    // 動かせる場所の数

    const black_movable = blk: {
        var movable_count: isize = 0;
        var iter = board.getColorPieces(.black).iterator();

        while (iter.next()) |from| {
            const move_targets = board.getMove(BitBoard.initWithIndex(from));

            movable_count += @intCast(move_targets.count());
        }

        break :blk movable_count;
    };

    const white_movable = blk: {
        var movable_count: isize = 0;
        var iter = board.getColorPieces(.white).iterator();

        while (iter.next()) |from| {
            const move_targets = board.getMove(BitBoard.initWithIndex(from));

            movable_count += @intCast(move_targets.count());
        }

        break :blk movable_count;
    };

    return black_pieces_count * 20 - white_pieces_count * 20 +
        black_movable * 10 - white_movable * 10;
}
