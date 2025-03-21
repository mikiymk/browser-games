// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const BitBoard = Board.BitBoard;
const Piece = Board.Piece;
const Color = Board.Color;
const PromotionPiece = Board.PromotionPiece;

// test import
test {
    _ = @import("./Game.test.zig");
}

const SquareStruct = struct {
    color: Color,
    piece: PromotionPiece,
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

    pub fn toColorPiece(square: Square) ?SquareStruct {
        return switch (square) {
            .empty => null,

            .black_king => .{ .color = .black, .piece = .king },
            .black_rook => .{ .color = .black, .piece = .rook },
            .black_bishop => .{ .color = .black, .piece = .bishop },
            .black_gold => .{ .color = .black, .piece = .gold },
            .black_silver => .{ .color = .black, .piece = .silver },
            .black_knight => .{ .color = .black, .piece = .knight },
            .black_lance => .{ .color = .black, .piece = .lance },
            .black_pawn => .{ .color = .black, .piece = .pawn },

            .black_rook_promoted => .{ .color = .black, .piece = .rook_promoted },
            .black_bishop_promoted => .{ .color = .black, .piece = .bishop_promoted },
            .black_silver_promoted => .{ .color = .black, .piece = .silver_promoted },
            .black_knight_promoted => .{ .color = .black, .piece = .knight_promoted },
            .black_lance_promoted => .{ .color = .black, .piece = .lance_promoted },
            .black_pawn_promoted => .{ .color = .black, .piece = .pawn_promoted },

            .white_king => .{ .color = .white, .piece = .king },
            .white_rook => .{ .color = .white, .piece = .rook },
            .white_bishop => .{ .color = .white, .piece = .bishop },
            .white_gold => .{ .color = .white, .piece = .gold },
            .white_silver => .{ .color = .white, .piece = .silver },
            .white_knight => .{ .color = .white, .piece = .knight },
            .white_lance => .{ .color = .white, .piece = .lance },
            .white_pawn => .{ .color = .white, .piece = .pawn },

            .white_rook_promoted => .{ .color = .white, .piece = .rook_promoted },
            .white_bishop_promoted => .{ .color = .white, .piece = .bishop_promoted },
            .white_silver_promoted => .{ .color = .white, .piece = .silver_promoted },
            .white_knight_promoted => .{ .color = .white, .piece = .knight_promoted },
            .white_lance_promoted => .{ .color = .white, .piece = .lance_promoted },
            .white_pawn_promoted => .{ .color = .white, .piece = .pawn_promoted },
        };
    }

    pub fn fromColorPiece(color: Color, piece: PromotionPiece) Square {
        return switch (color) {
            .black => switch (piece) {
                .king => .black_king,
                .rook => .black_rook,
                .bishop => .black_bishop,
                .gold => .black_gold,
                .silver => .black_silver,
                .knight => .black_knight,
                .lance => .black_lance,
                .pawn => .black_pawn,
                .rook_promoted => .black_rook_promoted,
                .bishop_promoted => .black_bishop_promoted,
                .silver_promoted => .black_silver_promoted,
                .knight_promoted => .black_knight_promoted,
                .lance_promoted => .black_lance_promoted,
                .pawn_promoted => .black_pawn_promoted,
            },
            .white => switch (piece) {
                .king => .white_king,
                .rook => .white_rook,
                .bishop => .white_bishop,
                .gold => .white_gold,
                .silver => .white_silver,
                .knight => .white_knight,
                .lance => .white_lance,
                .pawn => .white_pawn,
                .rook_promoted => .white_rook_promoted,
                .bishop_promoted => .white_bishop_promoted,
                .silver_promoted => .white_silver_promoted,
                .knight_promoted => .white_knight_promoted,
                .lance_promoted => .white_lance_promoted,
                .pawn_promoted => .white_pawn_promoted,
            },
        };
    }
};

const Hands = std.EnumArray(Piece, u8);

current_board: Board,
black_hands: Hands,
white_hands: Hands,
current_player: Color,

pub fn init() Game {
    return .{
        .current_board = Board.init(),
        .black_hands = Hands.initFill(0),
        .white_hands = Hands.initFill(0),
        .current_player = .white,
    };
}

/// ボード用スライスに駒の情報を設定する。
pub fn setBoard(game: Game, board_slice: *[]u8) void {
    const board = game.current_board;

    @memset(board_slice.*, @intFromEnum(Square.empty));

    var boards = board.boards;
    var color_iter = boards.iterator();

    while (color_iter.next()) |color| {
        var piece_iter = color.value.iterator();

        while (piece_iter.next()) |piece| {
            setPieceToBoard(
                board_slice,
                piece.value.*,
                @intFromEnum(Square.fromColorPiece(color.key, piece.key)),
            );
        }
    }
}

/// ボードのスライスに駒を設定する
pub fn setPieceToBoard(board: *[]u8, target: BitBoard, value: u8) void {
    var iter = target.iterator();
    while (iter.next()) |n| {
        board.*[n] = value;
    }
}

pub fn getHandPtr(game: Game, color: Color) Hands {
    return switch (color) {
        .black => game.black_hands,
        .white => game.white_hands,
    };
}

/// 勝利したプレイヤーを得る
/// まだゲーム中ならnull
pub fn getWinner(game: Game) ?Color {
    if (game.current_board.isCheckmated(.white)) {
        return .black;
    }
    if (game.current_board.isCheckmated(.black)) {
        return .white;
    }

    return null;
}

pub fn movePositions(game: Game, from: BitBoard) BitBoard {
    return game.current_board.movePositions(from);
}

pub fn hitPositions(game: Game, piece: Piece) BitBoard {
    return game.current_board.hitPositions(game.current_player, piece);
}

/// 駒を移動する
/// 必ず成る場合は成る
/// 成るかどうか選択できる場合はtrueを返す
pub fn move(game: *Game, from: BitBoard, to: BitBoard) bool {
    // 持ち駒を増やす
    const capture_piece = game.current_board.getPieceAt(to);
    if (capture_piece.toColorPiece()) |cp| {
        const primary_piece = cp.piece.toPiece().piece;
        const hands = switch (game.current_player) {
            .black => &game.black_hands,
            .white => &game.white_hands,
        };

        hands.getPtr(primary_piece).* += 1;
    }

    // 駒を移動する
    game.current_board = game.current_board.movedBoard(from, to);

    game.changePlayer();

    // 成る
    if (game.current_board.needsPromotion(to)) {
        game.current_board = game.current_board.promotedBoard(to);
    } else if (game.current_board.canPromotion(from, to)) {
        return true;
    }

    return false;
}

pub fn hit(game: *Game, piece: PromotionPiece, to: BitBoard) void {
    // 持ち駒を減らす
    const primary_piece = piece.toPiece().piece;
    const hands = switch (game.current_player) {
        .black => &game.black_hands,
        .white => &game.white_hands,
    };
    hands.getPtr(primary_piece).* -= 1;

    // 駒を追加する
    game.current_board = game.current_board.hitBoard(game.current_player, piece, to);

    game.changePlayer();
}

pub fn promote(game: *Game, position: BitBoard) void {
    game.current_board = game.current_board.promotedBoard(position);
}

fn changePlayer(game: *Game) void {
    game.current_player = game.current_player.turn();
}
