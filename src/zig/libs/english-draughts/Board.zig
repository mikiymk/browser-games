const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const EnumArray = std.enums.EnumArray;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Board = draughts.Board;
const BitBoard = draughts.BitBoard;
const Color = Game.Color;
const Piece = Game.Piece;

// common import
const common = @import("../common/main.zig");

const ColorBoard = EnumArray(Color, BitBoard);
const PieceColorBoard = EnumArray(Piece, ColorBoard);

boards: PieceColorBoard,

/// ボードを作成する。
pub fn init(a: Allocator, board_white: BitBoard, board_black: BitBoard) @This() {
    _ = a;

    return .{ .boards = PieceColorBoard.init(.{
        .pawn = ColorBoard.init(.{
            .white = board_white,
            .black = board_black,
        }),
        .king = ColorBoard.initFill(BitBoard.init()),
    }) };
}

/// 文字列からボードを作成する。
/// 白はo、黒はxで指定する。
pub fn fromString(a: Allocator, str: []const u8) @This() {
    const mark_white = 'o';
    const mark_black = 'x';

    const board_white = BitBoard.fromString(str, mark_white);
    const board_black = BitBoard.fromString(str, mark_black);

    return init(a, board_white, board_black);
}

/// 指定した色のボード状態を取得する
pub fn getBoard(self: Board, color: Color, piece: Piece) BitBoard {
    return self.boards.get(piece).get(color);
}

/// 指定した色のボード状態を取得する
pub fn getBoardPtr(self: *Board, color: Color, piece: Piece) *BitBoard {
    return self.boards.getPtr(piece).getPtr(color);
}

/// 指定した場所の駒の色と種類を取得する
pub fn getColorPiece(self: Board, position: BitBoard) ?struct { Color, Piece } {
    const white_pawn = self.getBoard(.white, .pawn);
    const white_king = self.getBoard(.white, .king);
    const black_pawn = self.getBoard(.black, .pawn);
    const black_king = self.getBoard(.black, .king);

    if (position.isJoint(white_pawn)) {
        return .{ .white, .pawn };
    } else if (position.isJoint(white_king)) {
        return .{ .white, .king };
    } else if (position.isJoint(black_pawn)) {
        return .{ .black, .pawn };
    } else if (position.isJoint(black_king)) {
        return .{ .black, .king };
    } else {
        return null;
    }
}

/// 指定した場所の駒の色を取得する
pub fn getColor(self: Board, position: BitBoard) ?Color {
    return (self.getColorPiece(position) orelse return null)[0];
}

test "📖Board.getColor" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\..x.....
        \\........
        \\........
    ;

    const board = Board.fromString(a, board_str);

    try std.testing.expectEqual(.white, board.getColor(BitBoard.fromCoordinate(5, 5)));
    try std.testing.expectEqual(.black, board.getColor(BitBoard.fromCoordinate(2, 2)));
    try std.testing.expectEqual(null, board.getColor(BitBoard.fromCoordinate(4, 4)));
}

/// 指定した場所の駒の種類を取得する
pub fn getPiece(self: Board, position: BitBoard) ?Piece {
    return (self.getColorPiece(position) orelse return null)[1];
}

/// 盤上の通常移動を全て取得する。
pub fn getAllWalkMoves(self: Board, a: Allocator, color: Color) ![]Game.Move {
    var walk_moves = std.ArrayList(Game.Move).empty;
    errdefer walk_moves.deinit(a);

    // ポーンの移動を取得
    const pawn_board = self.getBoard(color, .pawn);
    var pawn_iterator = pawn_board.iterator();
    while (pawn_iterator.next()) |pawn_position_index| {
        const pawn_position = BitBoard.fromIndex(pawn_position_index);
        const walk_to = self.movedPawnWalk(pawn_position);

        var walk_to_iterator = walk_to.iterator();
        while (walk_to_iterator.next()) |walk_to_position_index| {
            const move = Game.Move.init(pawn_position_index, walk_to_position_index);
            try walk_moves.append(a, move);
        }
    }

    // キングの移動を取得
    const king_board = self.getBoard(color, .king);
    var king_iterator = king_board.iterator();
    while (king_iterator.next()) |king_position_index| {
        const king_position = BitBoard.fromIndex(king_position_index);
        const walk_to = self.movedKingWalk(king_position);

        var walk_to_iterator = walk_to.iterator();
        while (walk_to_iterator.next()) |walk_to_position_index| {
            const move = Game.Move.init(king_position_index, walk_to_position_index);
            try walk_moves.append(a, move);
        }
    }

    return walk_moves.toOwnedSlice(a);
}

test "📖Board.getAllWalkMoves" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\......o.
        \\........
        \\........
        \\...x....
        \\..o.....
        \\........
        \\........
    ;

    const board = Board.fromString(a, board_str);
    const moves = try board.getAllWalkMoves(a, .white);
    defer a.free(moves);

    const expected = [_]Game.Move{
        Game.Move.init(BitBoard.Coordinate.toIndex(6, 6), BitBoard.Coordinate.toIndex(5, 7)),
        Game.Move.init(BitBoard.Coordinate.toIndex(6, 6), BitBoard.Coordinate.toIndex(7, 7)),
        Game.Move.init(BitBoard.Coordinate.toIndex(2, 2), BitBoard.Coordinate.toIndex(1, 3)),
    };

    try std.testing.expectEqual(expected.len, moves.len);
    for (expected) |expected_move| {
        for (moves) |move| {
            if (expected_move.eql(move)) {
                break;
            }
        } else {
            return error.NotContain;
        }
    }
}

/// 盤上のジャンプを全て取得する。
pub fn getAllJumpMoves(self: Board, a: Allocator, color: Color) ![]Game.Move {
    var jump_moves = std.ArrayList(Game.Move).empty;
    errdefer jump_moves.deinit(a);

    // ポーンの移動を取得
    const pawn_board = self.getBoard(color, .pawn);
    var pawn_iterator = pawn_board.iterator();
    while (pawn_iterator.next()) |pawn_position_index| {
        const pawn_position = BitBoard.fromIndex(pawn_position_index);
        const jump_to = self.movedPawnJump(pawn_position);

        var jump_to_iterator = jump_to.iterator();
        while (jump_to_iterator.next()) |jump_to_position_index| {
            const move = Game.Move.init(pawn_position_index, jump_to_position_index);
            try jump_moves.append(a, move);
        }
    }

    // キングの移動を取得
    const king_board = self.getBoard(color, .king);
    var king_iterator = king_board.iterator();
    while (king_iterator.next()) |king_position_index| {
        const king_position = BitBoard.fromIndex(king_position_index);
        const jump_to = self.movedKingJump(king_position);

        var jump_to_iterator = jump_to.iterator();
        while (jump_to_iterator.next()) |jump_to_position_index| {
            const move = Game.Move.init(king_position_index, jump_to_position_index);
            try jump_moves.append(a, move);
        }
    }

    return jump_moves.toOwnedSlice(a);
}

test "📖Board.getAllJumpMoves" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\......o.
        \\........
        \\........
        \\...x....
        \\..o.....
        \\........
        \\........
    ;

    const board = Board.fromString(a, board_str);
    const moves = try board.getAllJumpMoves(a, .white);
    defer a.free(moves);

    const expected = [_]Game.Move{
        Game.Move.init(BitBoard.Coordinate.toIndex(2, 2), BitBoard.Coordinate.toIndex(4, 4)),
    };

    try std.testing.expectEqual(expected.len, moves.len);
    for (expected) |expected_move| {
        for (moves) |move| {
            if (expected_move.eql(move)) {
                break;
            }
        } else {
            return error.NotContain;
        }
    }
}

fn pawnDirections(color: Color) [2]BitBoard.Direction {
    return switch (color) {
        .white => [2]BitBoard.Direction{ .ne, .nw },
        .black => [2]BitBoard.Direction{ .se, .sw },
    };
}

/// 指定した座標のポーンの駒が移動できる範囲を取得する。
pub fn movedPawnWalk(self: Board, position: BitBoard) BitBoard {
    const color = self.getColor(position) orelse return BitBoard.init();

    const ally_pawn = self.getBoard(color, .pawn);
    const ally_king = self.getBoard(color, .king);
    const opponent_pawn = self.getBoard(color.turn(), .pawn);
    const opponent_king = self.getBoard(color.turn(), .king);

    const ally_board = ally_pawn.unions(ally_king);
    const opponent_board = opponent_pawn.unions(opponent_king);
    const occupied_positions = ally_board.unions(opponent_board);

    const move_to = position.moveMaskedMultiple(&pawnDirections(color));

    return move_to.excludes(occupied_positions);
}

test "📖Board.movedPawnWalk" {
    const a = std.testing.allocator;
    const board_str =
        \\.....o.x
        \\......o.
        \\.x......
        \\........
        \\........
        \\......x.
        \\.o...x.o
        \\........
    ;

    const board = Board.fromString(a, board_str);

    // ポーンは前方にのみ移動できる
    try board.movedPawnWalk(BitBoard.fromCoordinate(1, 1)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o.o.....
        \\........
        \\........
    );

    try board.movedPawnWalk(BitBoard.fromCoordinate(1, 5)).expect(
        \\........
        \\........
        \\........
        \\o.o.....
        \\........
        \\........
        \\........
        \\........
    );

    // 移動先に駒がある場合は移動できない
    try board.movedPawnWalk(BitBoard.fromCoordinate(6, 6)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );

    try board.movedPawnWalk(BitBoard.fromCoordinate(6, 2)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

/// 指定した座標のキングの駒が移動できる範囲を取得する。
pub fn movedKingWalk(self: Board, position: BitBoard) BitBoard {
    const color = self.getColor(position) orelse return BitBoard.init();

    const ally_pawn = self.getBoard(color, .pawn);
    const ally_king = self.getBoard(color, .king);
    const opponent_pawn = self.getBoard(color.turn(), .pawn);
    const opponent_king = self.getBoard(color.turn(), .king);

    const ally_board = ally_pawn.unions(ally_king);
    const opponent_board = opponent_pawn.unions(opponent_king);
    const occupied_positions = ally_board.unions(opponent_board);

    const move_to = position.moveMaskedMultiple(&.{ .ne, .se, .nw, .sw });

    return move_to.excludes(occupied_positions);
}

test "📖Board.movedKingWalk" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\......o.
        \\.....o..
        \\........
        \\........
        \\..x.....
        \\.o......
        \\........
    ;

    const board = Board.fromString(a, board_str);

    try board.movedKingWalk(BitBoard.fromCoordinate(1, 1)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o.......
        \\........
        \\o.o.....
    );

    try board.movedKingWalk(BitBoard.fromCoordinate(6, 6)).expect(
        \\.....o.o
        \\........
        \\.......o
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

/// 指定した座標のポーンの駒が相手の駒を飛び越えて移動できる範囲を取得する。
pub fn movedPawnJump(self: Board, position: BitBoard) BitBoard {
    const color = self.getColor(position) orelse return BitBoard.init();

    const ally_pawn = self.getBoard(color, .pawn);
    const ally_king = self.getBoard(color, .king);
    const opponent_pawn = self.getBoard(color.turn(), .pawn);
    const opponent_king = self.getBoard(color.turn(), .king);

    const ally_board = ally_pawn.unions(ally_king);
    const opponent_board = opponent_pawn.unions(opponent_king);
    const occupied_positions = ally_board.unions(opponent_board);

    var move_jump = BitBoard.init();

    const directions = pawnDirections(color);
    for (directions) |direction| {
        const intermediate_position = position.moveMasked(direction).masks(opponent_board);

        move_jump.setUnion(intermediate_position.moveMasked(direction));
    }

    return move_jump.excludes(occupied_positions);
}

test "📖Board.movedPawnJump" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\..o.x...
        \\...o....
        \\........
    ;

    const board = Board.fromString(a, board_str);

    try board.movedPawnJump(BitBoard.fromCoordinate(3, 1)).expect(
        \\........
        \\........
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\........
    );
}

/// 指定した座標のキングの駒が相手の駒を飛び越えて移動できる範囲を取得する。
pub fn movedKingJump(self: Board, position: BitBoard) BitBoard {
    const color = self.getColor(position) orelse return BitBoard.init();

    const ally_pawn = self.getBoard(color, .pawn);
    const ally_king = self.getBoard(color, .king);
    const opponent_pawn = self.getBoard(color.turn(), .pawn);
    const opponent_king = self.getBoard(color.turn(), .king);

    const ally_board = ally_pawn.unions(ally_king);
    const opponent_board = opponent_pawn.unions(opponent_king);
    const occupied_positions = ally_board.unions(opponent_board);

    var move_jump = BitBoard.init();

    const directions = [_]BitBoard.Direction{ .ne, .se, .nw, .sw };
    for (directions) |direction| {
        const intermediate_position = position.moveMasked(direction).masks(opponent_board);

        move_jump.setUnion(intermediate_position.moveMasked(direction));
    }

    return move_jump.excludes(occupied_positions);
}

test "📖Board.getMoveJump" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\.x......
        \\..x.o...
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    const board = Board.fromString(a, board_str);

    try board.movedKingJump(BitBoard.fromCoordinate(3, 3)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.o......
        \\........
    );
}

/// 指定した位置の駒を反転させる
fn togglePiece(self: *Board, position: BitBoard, color: Color, piece: Piece) void {
    self.getBoardPtr(color, piece).setToggle(position);
}

/// 駒を移動させる。
/// 最も上に到達した場合はキングに昇格し、trueを返す。
pub fn setMovedWalk(self: *Board, position_from: BitBoard, position_to: BitBoard) void {
    const color, const piece = self.getColorPiece(position_from) orelse return;

    self.togglePiece(position_from, color, piece);

    if ((color == .white and position_to.isJoint(BitBoard.north_mask.getInverted())) or
        (color == .black and position_to.isJoint(BitBoard.south_mask.getInverted())))
    {
        self.togglePiece(position_to, color, .king);
    } else {
        self.togglePiece(position_to, color, piece);
    }
}

test "📖Board.setMovedWalk" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\......o.
        \\........
        \\........
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    var board = Board.fromString(a, board_str);
    {
        board.setMovedWalk(
            BitBoard.fromCoordinate(3, 3),
            BitBoard.fromCoordinate(4, 4),
        );

        try board.getBoard(.white, .pawn).expect(
            \\........
            \\......o.
            \\........
            \\....o...
            \\........
            \\........
            \\........
            \\........
        );
    }

    {
        board.setMovedWalk(
            BitBoard.fromCoordinate(6, 6),
            BitBoard.fromCoordinate(5, 7),
        );

        try board.getBoard(.white, .king).expect(
            \\.....o..
            \\........
            \\........
            \\........
            \\........
            \\........
            \\........
            \\........
        );
    }
}

/// 駒を移動させ、途中の相手の駒を取りのぞく
/// 最も上に到達した場合はキングに昇格し、trueを返す。
pub fn setMovedJump(self: *Board, position_from: BitBoard, position_to: BitBoard, position_jumped: BitBoard) bool {
    const color, const piece = self.getColorPiece(position_from) orelse return false;

    var is_promoted = false;
    self.togglePiece(position_from, color, piece);
    if ((color == .white and position_to.isJoint(BitBoard.north_mask.getInverted())) or
        (color == .black and position_to.isJoint(BitBoard.south_mask.getInverted())))
    {
        self.togglePiece(position_to, color, .king);
        is_promoted = true;
    } else {
        self.togglePiece(position_to, color, piece);
    }

    const color_jumped, const piece_jumped = self.getColorPiece(position_jumped) orelse return is_promoted;
    self.togglePiece(position_jumped, color_jumped, piece_jumped);

    return is_promoted;
}

test "📖Board.setMovedJump" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    var board = Board.fromString(a, board_str);
    const result = board.setMovedJump(
        BitBoard.fromCoordinate(3, 3),
        BitBoard.fromCoordinate(1, 1),
        BitBoard.fromCoordinate(2, 2),
    );

    try std.testing.expect(!result);
    try board.getBoard(.white, .pawn).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.o......
        \\........
    );
    try board.getBoard(.black, .pawn).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}
