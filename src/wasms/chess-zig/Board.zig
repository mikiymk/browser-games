const std = @import("std");

const bit_board = @import("bit-board");

const moves = @import("moves.zig");

const Board = @This();

pub const ColorPieceType = enum(u8) {
    black_pawn = 1,
    black_knight = 2,
    black_bishop = 3,
    black_rook = 4,
    black_queen = 5,
    black_king = 6,

    white_pawn = 7,
    white_knight = 8,
    white_bishop = 9,
    white_rook = 10,
    white_queen = 11,
    white_king = 12,

    pub fn fromColorType(c: Color, t: PieceType) ColorPieceType {
        return switch (c) {
            .black => switch (t) {
                .pawn => .black_pawn,
                .knight => .black_knight,
                .bishop => .black_bishop,
                .rook => .black_rook,
                .queen => .black_queen,
                .king => .black_king,
            },
            .white => switch (t) {
                .pawn => .white_pawn,
                .knight => .white_knight,
                .bishop => .white_bishop,
                .rook => .white_rook,
                .queen => .white_queen,
                .king => .white_king,
            },
        };
    }

    pub fn color(cp: ColorPieceType) Color {
        return switch (cp) {
            .black_pawn, .black_knight, .black_bishop, .black_rook, .black_queen, .black_king => .black,
            .white_pawn, .white_knight, .white_bishop, .white_rook, .white_queen, .white_king => .white,
        };
    }

    pub fn pieceType(cp: ColorPieceType) PieceType {
        return switch (cp) {
            .black_pawn, .white_pawn => .pawn,
            .black_knight, .white_knight => .knight,
            .black_bishop, .white_bishop => .bishop,
            .black_rook, .white_rook => .rook,
            .black_queen, .white_queen => .queen,
            .black_king, .white_king => .king,
        };
    }
};

pub const Color = enum {
    black,
    white,

    pub fn turn(color: Color) Color {
        return switch (color) {
            .black => .white,
            .white => .black,
        };
    }
};

pub const PieceType = enum {
    pawn,
    knight,
    bishop,
    rook,
    queen,
    king,
};

black_pawn: u64,
black_knight: u64,
black_bishop: u64,
black_rook: u64,
black_queen: u64,
black_king: u64,

white_pawn: u64,
white_knight: u64,
white_bishop: u64,
white_rook: u64,
white_queen: u64,
white_king: u64,

pub fn init() Board {
    return fromString(
        \\rnbqkbnr
        \\pppppppp
        \\........
        \\........
        \\........
        \\........
        \\PPPPPPPP
        \\RNBQKBNR
    );
}

test "chess board from string" {
    const board = fromString(
        \\rnbqkbnr
        \\pppppppp
        \\........
        \\........
        \\........
        \\........
        \\PPPPPPPP
        \\RNBQKBNR
    );

    try bit_board.expectBitBoard(board.black_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
    );

    try bit_board.expectBitBoard(board.white_rook,
        \\o......o
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

pub fn fromString(comptime str: []const u8) Board {
    return .{
        .black_pawn = bit_board.fromString(str, 'P'),
        .black_knight = bit_board.fromString(str, 'N'),
        .black_bishop = bit_board.fromString(str, 'B'),
        .black_rook = bit_board.fromString(str, 'R'),
        .black_queen = bit_board.fromString(str, 'Q'),
        .black_king = bit_board.fromString(str, 'K'),

        .white_pawn = bit_board.fromString(str, 'p'),
        .white_knight = bit_board.fromString(str, 'n'),
        .white_bishop = bit_board.fromString(str, 'b'),
        .white_rook = bit_board.fromString(str, 'r'),
        .white_queen = bit_board.fromString(str, 'q'),
        .white_king = bit_board.fromString(str, 'k'),
    };
}

pub fn setPiece(b: *Board, color_piece: ColorPieceType, pieces: u64) void {
    switch (color_piece) {
        .black_pawn => b.black_pawn |= pieces,
        .black_knight => b.black_knight |= pieces,
        .black_bishop => b.black_bishop |= pieces,
        .black_rook => b.black_rook |= pieces,
        .black_queen => b.black_queen |= pieces,
        .black_king => b.black_king |= pieces,

        .white_pawn => b.white_pawn |= pieces,
        .white_knight => b.white_knight |= pieces,
        .white_bishop => b.white_bishop |= pieces,
        .white_rook => b.white_rook |= pieces,
        .white_queen => b.white_queen |= pieces,
        .white_king => b.white_king |= pieces,
    }
}

// 引数の色と種類からその色と種類のすべての駒の位置を返します。
pub fn getPieces(b: Board, color_piece: ColorPieceType) u64 {
    return switch (color_piece) {
        .black_pawn => b.black_pawn,
        .black_knight => b.black_knight,
        .black_bishop => b.black_bishop,
        .black_rook => b.black_rook,
        .black_queen => b.black_queen,
        .black_king => b.black_king,

        .white_pawn => b.white_pawn,
        .white_knight => b.white_knight,
        .white_bishop => b.white_bishop,
        .white_rook => b.white_rook,
        .white_queen => b.white_queen,
        .white_king => b.white_king,
    };
}

// 引数の色からその色のすべての駒の位置を返します。
pub fn getColorPieces(b: Board, color: Color) u64 {
    return switch (color) {
        .black => b.black_pawn |
            b.black_knight |
            b.black_bishop |
            b.black_rook |
            b.black_queen |
            b.black_king,
        .white => b.white_pawn |
            b.white_knight |
            b.white_bishop |
            b.white_rook |
            b.white_queen |
            b.white_king,
    };
}

// 場所からそこのマスにいるコマの色と種類を返します。
pub fn getColorType(b: Board, place: u64) ?ColorPieceType {
    if (b.black_pawn & place != 0) {
        return .black_pawn;
    } else if (b.black_knight & place != 0) {
        return .black_knight;
    } else if (b.black_bishop & place != 0) {
        return .black_bishop;
    } else if (b.black_rook & place != 0) {
        return .black_rook;
    } else if (b.black_queen & place != 0) {
        return .black_queen;
    } else if (b.black_king & place != 0) {
        return .black_king;
    } else if (b.white_pawn & place != 0) {
        return .white_pawn;
    } else if (b.white_knight & place != 0) {
        return .white_knight;
    } else if (b.white_bishop & place != 0) {
        return .white_bishop;
    } else if (b.white_rook & place != 0) {
        return .white_rook;
    } else if (b.white_queen & place != 0) {
        return .white_queen;
    } else if (b.white_king & place != 0) {
        return .white_king;
    }

    return null;
}

// 場所からそこのマスにいるコマの色を返します。
pub fn getColor(b: Board, place: u64) ?Color {
    return if (b.getColorType(place)) |color_type| color_type.color() else null;
}

// 場所からそこのマスにいるコマの種類を返します。
pub fn getType(b: Board, place: u64) ?PieceType {
    return if (b.getColorType(place)) |color_type| color_type.pieceType() else null;
}

pub fn getMove(b: Board, from: u64) u64 {
    const color_type = b.getColorType(from) orelse return 0;

    const to_list = switch (color_type.pieceType()) {
        .pawn => moves.pawn(b, from, color_type.color()),
        .knight => moves.knight(b, from, color_type.color()),
        .bishop => moves.bishop(b, from, color_type.color()),
        .rook => moves.rook(b, from, color_type.color()),
        .queen => moves.queen(b, from, color_type.color()),
        .king => moves.king(b, from, color_type.color()),
    };

    return b.filterValidMove(from, to_list, color_type.color(), color_type.pieceType());
}

fn filterValidMove(b: Board, from: u64, to_list: u64, color: Color, piece: PieceType) u64 {
    // ループ用ビットボード
    var bits = to_list;
    var valid_board: u64 = 0;
    while (bits != 0) {
        // 一番下の立っているビットを１つ取り出す
        const current_board = bits & (~bits + 1);

        // ここからループ本体

        // 動かしたボードがチェック状態の移動先を取り除く
        const moved_board = b.getMovedBoard(from, current_board, color, piece);
        if (!moved_board.isChecked(color)) {
            valid_board |= current_board;
        }

        // ここまでループ本体

        // 一番下のビットを落とす
        bits &= bits - 1;
    }

    return valid_board;
}

test "filter check move" {
    const board_str =
        \\........
        \\...R....
        \\........
        \\........
        \\........
        \\........
        \\...r....
        \\...k....
    ;
    const board = fromString(board_str);
    const from = bit_board.fromString(board_str, 'r');
    const to = moves.rook(board, from, .white);

    const actual = board.filterValidMove(from, to, .white, .rook);

    try bit_board.expectBitBoard(actual,
        \\........
        \\...o....
        \\...o....
        \\...o....
        \\...o....
        \\...o....
        \\........
        \\........
    );
}

/// 盤がチェック状態になっているか
/// - color - チェックされるキングの色
fn isChecked(b: Board, color: Color) bool {
    var king: u64 = undefined;

    var danger_zone: u64 = undefined;

    if (color == .black) {
        king = b.black_king;

        danger_zone = moves.king(b, b.white_king, .white) |
            moves.queen(b, b.white_queen, .white) |
            moves.rook(b, b.white_rook, .white) |
            moves.bishop(b, b.white_bishop, .white) |
            moves.knight(b, b.white_knight, .white) |
            moves.pawn(b, b.white_pawn, .white);
    } else {
        king = b.white_king;

        danger_zone = moves.king(b, b.black_king, .black) |
            moves.queen(b, b.black_queen, .black) |
            moves.rook(b, b.black_rook, .black) |
            moves.bishop(b, b.black_bishop, .black) |
            moves.knight(b, b.black_knight, .black) |
            moves.pawn(b, b.black_pawn, .black);
    }

    return king & danger_zone != 0;
}

test "black king is checked" {
    const board = fromString(
        \\........
        \\...q....
        \\........
        \\........
        \\...K....
        \\........
        \\........
        \\........
    );

    const actual = board.isChecked(.black);
    const expected = true;

    try std.testing.expect(actual == expected);
}

test "black king is not checked" {
    const board = fromString(
        \\........
        \\..q.....
        \\........
        \\........
        \\...K....
        \\........
        \\........
        \\........
    );

    const actual = board.isChecked(.black);
    const expected = false;

    try std.testing.expect(actual == expected);
}

test "white king is checked" {
    const board = fromString(
        \\........
        \\...R....
        \\........
        \\........
        \\........
        \\........
        \\...k....
        \\........
    );

    const actual = board.isChecked(.white);
    const expected = true;

    try std.testing.expect(actual == expected);
}

test "white king is not checked" {
    const board = fromString(
        \\........
        \\..R.....
        \\........
        \\........
        \\........
        \\........
        \\...k....
        \\........
    );

    const actual = board.isChecked(.white);
    const expected = false;

    try std.testing.expect(actual == expected);
}

/// ボードから動いた状態の新しいボードを作成する。
/// 1. 移動元と移動先のマスを空にする。
/// 2. 移動先のマスを指定のピースにする。
pub fn getMovedBoard(b: Board, from: u64, to: u64, color: Color, piece: PieceType) Board {
    var new_board = b;
    const reset_board = ~(from | to);

    new_board.black_pawn &= reset_board;
    new_board.black_knight &= reset_board;
    new_board.black_bishop &= reset_board;
    new_board.black_rook &= reset_board;
    new_board.black_queen &= reset_board;
    new_board.black_king &= reset_board;
    new_board.white_pawn &= reset_board;
    new_board.white_knight &= reset_board;
    new_board.white_bishop &= reset_board;
    new_board.white_rook &= reset_board;
    new_board.white_queen &= reset_board;
    new_board.white_king &= reset_board;

    switch (piece) {
        .pawn => if (color == .black) {
            new_board.black_pawn |= to;
        } else {
            new_board.white_pawn |= to;
        },
        .knight => if (color == .black) {
            new_board.black_knight |= to;
        } else {
            new_board.white_knight |= to;
        },
        .bishop => if (color == .black) {
            new_board.black_bishop |= to;
        } else {
            new_board.white_bishop |= to;
        },
        .rook => if (color == .black) {
            new_board.black_rook |= to;
        } else {
            new_board.white_rook |= to;
        },
        .queen => if (color == .black) {
            new_board.black_queen |= to;
        } else {
            new_board.white_queen |= to;
        },
        .king => if (color == .black) {
            new_board.black_king |= to;
        } else {
            new_board.white_king |= to;
        },
    }

    return new_board;
}

test "moved board 1: single pawn" {
    const board = fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );
}

test "moved board 2: multiple pawns" {
    const board = fromString(
        \\........
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );
}

test "moved board 3: pawns and other pieces" {
    const board = fromString(
        \\rnbqkbnr
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );

    try bit_board.expectBitBoard(actual.white_knight,
        \\.o....o.
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "moved board 4: capture" {
    const board = fromString(
        \\rnbqkbnr
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\..PP....
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\........
    );

    try bit_board.expectBitBoard(actual.black_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\..o.....
        \\........
    );
}
