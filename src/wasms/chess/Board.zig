//! 8×8チェスボードの構造体。
//!

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

/// アンパサンが可能ならその位置、それ以外では0
enpassant_target: u64 = 0,
/// キャスリングが可能かどうか
castling_available: struct {
    black_kingside: bool,
    black_queenside: bool,
    white_kingside: bool,
    white_queenside: bool,
} = .{
    .black_kingside = true,
    .black_queenside = true,
    .white_kingside = true,
    .white_queenside = true,
},

pub fn init() Board {
    return fromString(
        \\RNBQKBNR
        \\PPPPPPPP
        \\........
        \\........
        \\........
        \\........
        \\pppppppp
        \\rnbqkbnr
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

/// 色と種類、追加する駒を指定し、チェスボードに駒を追加する。
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

    const to_list = b.getNormalMove(from, color_type) |
        b.getCastlingMove(from) |
        b.getEnpassant(from, color_type.color());

    return b.filterValidMove(from, to_list);
}

/// 通常の動きを取得する。
fn getNormalMove(b: Board, from: u64, color_type: ColorPieceType) u64 {
    return switch (color_type.pieceType()) {
        .pawn => moves.pawn(b, from, color_type.color()),
        .knight => moves.knight(b, from, color_type.color()),
        .bishop => moves.bishop(b, from, color_type.color()),
        .rook => moves.rook(b, from, color_type.color()),
        .queen => moves.queen(b, from, color_type.color()),
        .king => moves.king(b, from, color_type.color()),
    };
}

fn getCastlingMove(b: Board, from: u64) u64 {
    var board: u64 = 0;
    if (from == bit_board.fromNotation("e1")) {
        if (b.castling_available.white_kingside and b.canCastling(.white_king)) {
            board |= bit_board.fromNotation("h1");
        }
        if (b.castling_available.white_queenside and b.canCastling(.white_queen)) {
            board |= bit_board.fromNotation("a1");
        }
    } else if (from == bit_board.fromNotation("e8")) {
        if (b.castling_available.black_kingside and b.canCastling(.black_king)) {
            board |= bit_board.fromNotation("h8");
        }
        if (b.castling_available.black_queenside and b.canCastling(.black_queen)) {
            board |= bit_board.fromNotation("a8");
        }
    }
    return board;
}

fn getEnpassant(b: Board, from: u64, color: Color) u64 {
    switch (color) {
        .black => if (from & b.black_pawn != 0 and
            (from << 7 | from << 9) & b.enpassant_target != 0)
        {
            return b.enpassant_target;
        },
        .white => if (from & b.white_pawn != 0 and
            (from >> 7 | from >> 9) & b.enpassant_target != 0)
        {
            return b.enpassant_target;
        },
    }

    return 0;
}

/// プロモーションかどうかを判定する。
/// ポーンが最終ランクに到達したとき
pub fn isPromotion(b: Board, from: u64, to: u64) bool {
    return to & bit_board.fromString(
        \\oooooooo
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\oooooooo
    , 'o') != 0 and b.getType(from) == .pawn;
}

/// 現在の盤面でキャスリングが可能かどうかを判定する。
/// - キングとルークの間に駒がない
/// - キングの移動範囲が全て攻撃されていない
pub fn canCastling(b: Board, color_piece: ColorPieceType) bool {
    const black_king = bit_board.fromNotation("e8");
    const black_kingside_rook = bit_board.fromNotation("h8");
    const black_kingside_no_attacked = bit_board.fromNotations(&.{ "e8", "f8", "g8" });
    const black_kingside_no_pieces = bit_board.fromNotations(&.{ "f8", "g8" });
    const black_queenside_rook = bit_board.fromNotation("a8");
    const black_queenside_no_attacked = bit_board.fromNotations(&.{ "c8", "d8", "e8" });
    const black_queenside_no_pieces = bit_board.fromNotations(&.{ "b8", "c8", "d8" });

    const white_king = bit_board.fromNotation("e1");
    const white_kingside_rook = bit_board.fromNotation("h1");
    const white_kingside_no_attacked = bit_board.fromNotations(&.{ "e1", "f1", "g1" });
    const white_kingside_no_pieces = bit_board.fromNotations(&.{ "f1", "g1" });
    const white_queenside_rook = bit_board.fromNotation("a1");
    const white_queenside_no_attacked = bit_board.fromNotations(&.{ "c1", "d1", "e1" });
    const white_queenside_no_pieces = bit_board.fromNotations(&.{ "b1", "c1", "d1" });

    const pieces = b.getColorPieces(.black) | b.getColorPieces(.white);
    switch (color_piece) {
        .black_king => return b.black_king & black_king != 0 and
            b.black_rook & black_kingside_rook != 0 and
            pieces & black_kingside_no_pieces == 0 and
            !b.isAttacked(black_kingside_no_attacked, .black),

        .black_queen => return b.black_king & black_king != 0 and
            b.black_rook & black_queenside_rook != 0 and
            pieces & black_queenside_no_pieces == 0 and
            !b.isAttacked(black_queenside_no_attacked, .black),

        .white_king => return b.white_king & white_king != 0 and
            b.white_rook & white_kingside_rook != 0 and
            pieces & white_kingside_no_pieces == 0 and
            !b.isAttacked(white_kingside_no_attacked, .white),

        .white_queen => return b.white_king & white_king != 0 and
            b.white_rook & white_queenside_rook != 0 and
            pieces & white_queenside_no_pieces == 0 and
            !b.isAttacked(white_queenside_no_attacked, .white),

        else => return false,
    }
}

pub fn filterValidMove(b: Board, from: u64, to_list: u64) u64 {
    const from_color = b.getColor(from) orelse return 0;

    var iter = bit_board.iterator(to_list);
    var valid_board: u64 = 0;
    while (iter.next()) |current| {
        // 動かしたボードがチェック状態の移動先を取り除く
        const moved_board = b.getMovedBoard(from, current);
        if (!moved_board.isChecked(from_color)) {
            valid_board |= current;
        }
    }

    return valid_board;
}

/// 盤がチェック状態になっているか
/// - color - チェックされるキングの色
pub fn isChecked(b: Board, color: Color) bool {
    if (color == .black) {
        return b.isAttacked(b.black_king, .black);
    } else {
        return b.isAttacked(b.white_king, .white);
    }
}

/// placeのマス目のうち1つ以上が攻撃されているかどうか。
/// 攻撃されているならばtrue。
fn isAttacked(b: Board, place: u64, color: Color) bool {
    if (color == .black) {
        if (place & moves.king(b, b.white_king, .white) != 0) {
            return true;
        } else if (place & moves.queen(b, b.white_queen, .white) != 0) {
            return true;
        } else if (place & moves.rook(b, b.white_rook, .white) != 0) {
            return true;
        } else if (place & moves.bishop(b, b.white_bishop, .white) != 0) {
            return true;
        } else if (place & moves.knight(b, b.white_knight, .white) != 0) {
            return true;
        } else if (place & moves.pawn(b, b.white_pawn, .white) != 0) {
            return true;
        }
    } else {
        if (place & moves.king(b, b.black_king, .black) != 0) {
            return true;
        } else if (place & moves.queen(b, b.black_queen, .black) != 0) {
            return true;
        } else if (place & moves.rook(b, b.black_rook, .black) != 0) {
            return true;
        } else if (place & moves.bishop(b, b.black_bishop, .black) != 0) {
            return true;
        } else if (place & moves.knight(b, b.black_knight, .black) != 0) {
            return true;
        } else if (place & moves.pawn(b, b.black_pawn, .black) != 0) {
            return true;
        }
    }

    return false;
}

/// その色に一つ以上の動かせる駒があるかどうか判定する
pub fn canMove(board: Board, color: Color) bool {
    // 自分の色のすべての駒をループ
    var iter = bit_board.iterator(board.getColorPieces(color));
    while (iter.next()) |current| {
        // 動ける場所が1つでもあれば真を返して終了
        if (board.getMove(current) != 0) {
            return true;
        }
    }

    // 最後まで探索して見つからなかった場合は偽
    return false;
}

/// 材料の不足による引き分けを判定する
pub fn isInsufficientMaterial(board: Board) bool {
    // ポーン、ルーク、クイーンのいずれかが1つ以上ある場合、チェックメイトの可能性がある
    // ルークとクイーンは
    if (board.black_pawn != 0 or
        board.black_rook != 0 or
        board.black_queen != 0 or
        board.white_pawn != 0 or
        board.white_rook != 0 or
        board.white_queen != 0)
    {
        return false;
    }

    // キング対キング
    if (board.black_knight == 0 and
        board.black_bishop == 0 and
        board.white_knight == 0 and
        board.white_bishop == 0)
    {
        return true;
    }

    const bn = @popCount(board.black_knight); // black knight count
    const bb = @popCount(board.black_bishop); // black bishop count
    const wn = @popCount(board.white_knight); // white knight count
    const wb = @popCount(board.white_bishop); // white bishop count

    // キングとビショップ対キング
    if ((bn == 0 and bb == 1 and wn == 0 and wb == 0) or
        (bn == 0 and bb == 0 and wn == 0 and wb == 1))
    {
        return true;
    }

    // キングとナイト対キング
    if ((bn == 1 and bb == 0 and wn == 0 and wb == 0) or
        (bn == 0 and bb == 0 and wn == 1 and wb == 0))
    {
        return true;
    }

    const black_square_mask = bit_board.fromString(
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
    , 'o');
    const white_square_mask = bit_board.fromString(
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
    , 'o');

    // キングとビショップ対キングとビショップ、ビショップは同じ色のマスにいる
    if (bn == 0 and wn == 0 and
        ((board.black_bishop | board.white_bishop) & black_square_mask == board.black_bishop | board.white_bishop or
        (board.black_bishop | board.white_bishop) & white_square_mask == board.black_bishop | board.white_bishop))
    {
        return true;
    }

    return false;
}

/// ボードから動いた状態の新しいボードを作成する。
/// 1. 移動元と移動先のマスを空にする。
/// 2. 移動先のマスを指定のピースにする。
pub fn getMovedBoard(b: Board, from: u64, to: u64) Board {
    const piece_type = b.getColorType(from) orelse return b;
    const to_piece_type = b.getColorType(to);

    if (piece_type.pieceType() == .king and
        to_piece_type != null and
        piece_type.color() == to_piece_type.?.color() and
        to_piece_type.?.pieceType() == .rook)
    {
        // 動かし元にキング、動かし先に味方のルークがある場合
        var new_board = b.getMovedBoardCastling(from, to);
        new_board.setEnpassant(from, piece_type);

        return new_board;
    } else if (piece_type.pieceType() == .pawn and
        (from << 7 == to or
        from << 9 == to or
        from >> 7 == to or
        from >> 9 == to) and
        to_piece_type == null)
    {
        // ポーンが斜めに動いて動かし先に駒がない場合
        return b.getMovedBoardEnpassant(from, to);
    } else {
        // その他の場合
        var new_board = b.getMovedBoardNormalMove(from, to);
        new_board.setEnpassant(from, piece_type);

        // 次にアンパサンが起こる動きならアンパサンの移動先を代入する
        if (piece_type.pieceType() == .pawn and from << 16 == to) {
            new_board.enpassant_target = from << 8;
        } else if (piece_type.pieceType() == .pawn and from >> 16 == to) {
            new_board.enpassant_target = from >> 8;
        } else {
            new_board.enpassant_target = 0;
        }

        return new_board;
    }
}

fn getMovedBoardNormalMove(b: Board, from: u64, to: u64) Board {
    var new_board = b;

    const from_piece_type = new_board.getColorType(from) orelse return new_board;
    const to_piece_type = new_board.getColorType(to);

    if (to_piece_type) |tpt| {
        // 行き先に駒があるなら取り除く
        switch (tpt) {
            .black_pawn => new_board.black_pawn &= ~to,
            .black_knight => new_board.black_knight &= ~to,
            .black_bishop => new_board.black_bishop &= ~to,
            .black_rook => new_board.black_rook &= ~to,
            .black_queen => new_board.black_queen &= ~to,
            .black_king => new_board.black_king &= ~to,

            .white_pawn => new_board.white_pawn &= ~to,
            .white_knight => new_board.white_knight &= ~to,
            .white_bishop => new_board.white_bishop &= ~to,
            .white_rook => new_board.white_rook &= ~to,
            .white_queen => new_board.white_queen &= ~to,
            .white_king => new_board.white_king &= ~to,
        }
    }

    // 動かす駒について元と先のビットを反転させる
    switch (from_piece_type) {
        .black_pawn => new_board.black_pawn ^= (from | to),
        .black_knight => new_board.black_knight ^= (from | to),
        .black_bishop => new_board.black_bishop ^= (from | to),
        .black_rook => new_board.black_rook ^= (from | to),
        .black_queen => new_board.black_queen ^= (from | to),
        .black_king => new_board.black_king ^= (from | to),

        .white_pawn => new_board.white_pawn ^= (from | to),
        .white_knight => new_board.white_knight ^= (from | to),
        .white_bishop => new_board.white_bishop ^= (from | to),
        .white_rook => new_board.white_rook ^= (from | to),
        .white_queen => new_board.white_queen ^= (from | to),
        .white_king => new_board.white_king ^= (from | to),
    }

    return new_board;
}

/// キャスリングをした後のボードを得る
fn getMovedBoardCastling(b: Board, from: u64, to: u64) Board {
    var new_board = b;
    switch (from) {
        // e1は白のキング
        bit_board.fromNotation("e1") => {
            switch (to) {
                // クイーンサイド
                bit_board.fromNotation("a1") => {
                    new_board.white_king ^= bit_board.fromNotations(&.{ "c1", "e1" });
                    new_board.white_rook ^= bit_board.fromNotations(&.{ "a1", "d1" });
                },

                // キングサイド
                bit_board.fromNotation("h1") => {
                    new_board.white_king ^= bit_board.fromNotations(&.{ "e1", "g1" });
                    new_board.white_rook ^= bit_board.fromNotations(&.{ "f1", "h1" });
                },

                else => {},
            }
        },

        // e8は黒のキング
        bit_board.fromNotation("e8") => {
            switch (to) {
                // クイーンサイド
                bit_board.fromNotation("a8") => {
                    new_board.black_king ^= bit_board.fromNotations(&.{ "c8", "e8" });
                    new_board.black_rook ^= bit_board.fromNotations(&.{ "a8", "d8" });
                },

                // キングサイド
                bit_board.fromNotation("h8") => {
                    new_board.black_king ^= bit_board.fromNotations(&.{ "e8", "g8" });
                    new_board.black_rook ^= bit_board.fromNotations(&.{ "f8", "h8" });
                },

                else => {},
            }
        },

        else => {},
    }

    return new_board;
}

/// アンパサンを実行した後のボードを得る
fn getMovedBoardEnpassant(b: Board, from: u64, to: u64) Board {
    var new_board = b;

    const from_piece_type = new_board.getColorType(from) orelse return new_board;

    // 移動先のマスの1つ後ろの駒
    var capture_target: u64 = undefined;

    switch (from_piece_type) {
        .black_pawn => {
            new_board.black_pawn ^= from | to;
            capture_target = to >> 8;
        },

        .white_pawn => {
            new_board.white_pawn ^= from | to;
            capture_target = to << 8;
        },

        else => {},
    }

    // 駒を取り除く
    const capture_piece_type = new_board.getColorType(capture_target);

    if (capture_piece_type) |cpt| {
        switch (cpt) {
            .black_pawn => new_board.black_pawn &= ~capture_target,
            .black_knight => new_board.black_knight &= ~capture_target,
            .black_bishop => new_board.black_bishop &= ~capture_target,
            .black_rook => new_board.black_rook &= ~capture_target,
            .black_queen => new_board.black_queen &= ~capture_target,
            .black_king => new_board.black_king &= ~capture_target,

            .white_pawn => new_board.white_pawn &= ~capture_target,
            .white_knight => new_board.white_knight &= ~capture_target,
            .white_bishop => new_board.white_bishop &= ~capture_target,
            .white_rook => new_board.white_rook &= ~capture_target,
            .white_queen => new_board.white_queen &= ~capture_target,
            .white_king => new_board.white_king &= ~capture_target,
        }
    }

    return new_board;
}

/// キャスリングのキングとルークの動きを判定
fn setEnpassant(board: *Board, from: u64, piece_type: ColorPieceType) void {
    switch (piece_type) {
        .black_king => {
            board.castling_available.black_kingside = false;
            board.castling_available.black_queenside = false;
        },
        .black_rook => {
            if (from == bit_board.fromNotation("a8")) {
                board.castling_available.black_queenside = false;
            } else if (from == bit_board.fromNotation("h8")) {
                board.castling_available.black_kingside = false;
            }
        },
        .white_king => {
            board.castling_available.white_kingside = false;
            board.castling_available.white_queenside = false;
        },
        .white_rook => {
            if (from == bit_board.fromNotation("a1")) {
                board.castling_available.white_queenside = false;
            } else if (from == bit_board.fromNotation("h1")) {
                board.castling_available.white_kingside = false;
            }
        },
        else => {},
    }
}

/// ボードからプロモーションした状態の新しいボードを作成する。
pub fn getPromotionBoard(board: Board, from: u64, piece_type: PieceType) Board {
    var new_board = board;

    const color_piece_type = board.getColorType(from) orelse return new_board;

    switch (color_piece_type) {
        .black_pawn => {
            new_board.black_pawn &= ~from;

            switch (piece_type) {
                .knight => new_board.black_knight |= from,
                .bishop => new_board.black_bishop |= from,
                .rook => new_board.black_rook |= from,
                .queen => new_board.black_queen |= from,
                else => {},
            }
        },
        .white_pawn => {
            new_board.white_pawn &= ~from;

            switch (piece_type) {
                .knight => new_board.white_knight |= from,
                .bishop => new_board.white_bishop |= from,
                .rook => new_board.white_rook |= from,
                .queen => new_board.white_queen |= from,
                else => {},
            }
        },
        else => {},
    }

    return new_board;
}
