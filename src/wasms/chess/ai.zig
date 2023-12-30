const std = @import("std");
const Allocator = std.mem.Allocator;
const AllocError = Allocator.Error;

const bit_board = @import("bit-board");

const Board = @import("./Board.zig");
const Color = Board.Color;

const Move = struct { from: u64, to: u64 };
const MoveList = std.ArrayList(Move);

/// AIが考えた打つ場所を返します。
pub fn getAiMove(board: Board, allocator: Allocator, color: Color, comptime random: *const fn () f64) AllocError!Move {
    // 次の手のリスト
    const moves = try getValidMoves(board, allocator, color);
    defer allocator.free(moves);

    // ここまでの最も良い手
    var best_places = MoveList.init(allocator);
    // ここまでの最も良い手の評価点
    var best_evaluation: i32 = std.math.minInt(i32);

    for (moves) |from_moves| {
        const from = from_moves.from;

        var to_iter = bit_board.iterator(from_moves.to);
        while (to_iter.next()) |to| {
            const moved = board.getMovedBoard(from, to);

            const evaluation = try alphaBeta(
                moved,
                allocator,
                color,
                color.turn(),
                3,
                std.math.minInt(i32),
                std.math.maxInt(i32),
            );

            if (best_places.items.len == 0 or evaluation > best_evaluation) {
                best_evaluation = evaluation;
                try best_places.append(.{ .from = from, .to = to });
            } else if (evaluation == best_evaluation) {
                best_places.items.len = 0;
                try best_places.append(.{ .from = from, .to = to });
            }
        }
    }

    const select_index: u6 = @intFromFloat(random() * @as(f64, @floatFromInt(best_places.items.len)));
    return best_places.items[select_index];
}

/// 合法手をすべてリストする
fn getValidMoves(board: Board, allocator: Allocator, color: Color) AllocError![]Move {
    var moves = MoveList.init(allocator);

    const boards: [6]u64 = switch (color) {
        .black => .{
            board.black_pawn,
            board.black_knight,
            board.black_bishop,
            board.black_rook,
            board.black_queen,
            board.black_king,
        },
        .white => .{
            board.white_pawn,
            board.white_knight,
            board.white_bishop,
            board.white_rook,
            board.white_queen,
            board.white_king,
        },
    };

    for (boards) |b| {
        var iter = bit_board.iterator(b);

        while (iter.next()) |current| {
            const to = board.getMove(current);

            if (to != 0) {
                try moves.append(.{
                    .from = current,
                    .to = to,
                });
            }
        }
    }

    return moves.toOwnedSlice();
}

/// αβ法を使ってよい手を探す
/// - player_color - 最大の手を見つけたい色
fn alphaBeta(board: Board, allocator: Allocator, player_color: Color, current_color: Color, depth: u8, alpha: i32, beta: i32) AllocError!i32 {
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
        var value: i32 = std.math.minInt(i32);

        moves_loop: for (moves) |from_moves| {
            const from = from_moves.from;

            var to_iter = bit_board.iterator(from_moves.to);
            while (to_iter.next()) |to| {
                const moved = board.getMovedBoard(from, to);

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
        var value: i32 = std.math.maxInt(i32);

        moves_loop: for (moves) |from_moves| {
            const from = from_moves.from;

            var to_iter = bit_board.iterator(from_moves.to);
            while (to_iter.next()) |to| {
                const moved = board.getMovedBoard(from, to);

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
fn evaluate(board: Board) i32 {
    // 駒の数
    const black_pawn_count: i32 = @popCount(board.black_pawn);
    const black_knight_count: i32 = @popCount(board.black_knight);
    const black_bishop_count: i32 = @popCount(board.black_bishop);
    const black_rook_count: i32 = @popCount(board.black_rook);
    const black_queen_count: i32 = @popCount(board.black_queen);
    const black_king_count: i32 = @popCount(board.black_king);
    const white_pawn_count: i32 = @popCount(board.white_pawn);
    const white_knight_count: i32 = @popCount(board.white_knight);
    const white_bishop_count: i32 = @popCount(board.white_bishop);
    const white_rook_count: i32 = @popCount(board.white_rook);
    const white_queen_count: i32 = @popCount(board.white_queen);
    const white_king_count: i32 = @popCount(board.white_king);

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

    const black_movable: i32 = blk: {
        var movable_count: i32 = 0;
        var iter = bit_board.iterator(board.getColorPieces(.black));

        while (iter.next()) |from| {
            const move_targets = board.getMove(from);

            movable_count += @popCount(move_targets);
        }

        break :blk movable_count;
    };

    const white_movable: i32 = blk: {
        var movable_count: i32 = 0;
        var iter = bit_board.iterator(board.getColorPieces(.white));

        while (iter.next()) |from| {
            const move_targets = board.getMove(from);

            movable_count += @popCount(move_targets);
        }

        break :blk movable_count;
    };

    return black_pieces_count * 20 - white_pieces_count * 20 +
        black_movable * 10 - white_movable * 10;
}
