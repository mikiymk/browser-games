const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Move = Game.Move;
const BitBoard = draughts.BitBoard;

// common import
const common = @import("../common/main.zig");
const random = common.random.getRandomIntRange;

const ai_depth = 5;

const DraughtsContext = struct {
    pub fn get_valid_moves(a: Allocator, game: Game) ![]Game.Move {
        if (game.next_jump) |jump| {
            var jump_moves = std.ArrayList(Game.Move).init(a);
            errdefer jump_moves.deinit();
            const jump_to = game.board.movedKingJump(jump);
            var iterator = jump_to.iterator();
            while (iterator.next()) |position_to| {
                const move = Game.Move.init(jump.toIndexInteger(), position_to);
                try jump_moves.append(move);
            }
            return jump_moves.toOwnedSlice();
        }

        const jumps = try game.board.getAllJumpMoves(a, game.next_color);
        if (jumps.len > 0) {
            return jumps;
        } else {
            return game.board.getAllWalkMoves(a, game.next_color);
        }
    }
};

pub fn ai(a: Allocator, game: *Game) !void {
    var ai_move = try getAiMove(a, game.*, DraughtsContext);

    while (game.setMoved(ai_move)) {
        ai_move = try getAiMove(a, game.*, DraughtsContext);
    }
}

/// AIが考えた打つ場所を返します。
///
/// ```zig
/// Context = {
///     fn get_valid_moves(a: Allocator, game: Game) ![]Move;
/// }
/// ```
pub fn getAiMove(a: Allocator, game: Game, Context: type) !Move {
    const moves = try Context.get_valid_moves(a, game);
    defer a.free(moves);

    if (moves.len == 0) {
        return error.CanNotMove;
    }
    const i = random(0, moves.len);

    return moves[i];
}
