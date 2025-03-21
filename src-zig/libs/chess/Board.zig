//! 8×8チェスボードの構造体。
//!

// std import
const std = @import("std");
const builtin = @import("builtin");

const PieceBoards = std.enums.EnumArray(PieceType, BitBoard);
const ColorPieceBoards = std.enums.EnumArray(Color, PieceBoards);

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const moves = main.moves;

// test import
test {
    _ = @import("./Board.test.zig");
}

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

    pub fn toColorPiece(self: ColorPieceType) struct { Color, PieceType } {
        return switch (self) {
            .black_pawn => .{ .black, .pawn },
            .black_knight => .{ .black, .knight },
            .black_bishop => .{ .black, .bishop },
            .black_rook => .{ .black, .rook },
            .black_queen => .{ .black, .queen },
            .black_king => .{ .black, .king },

            .white_pawn => .{ .white, .pawn },
            .white_knight => .{ .white, .knight },
            .white_bishop => .{ .white, .bishop },
            .white_rook => .{ .white, .rook },
            .white_queen => .{ .white, .queen },
            .white_king => .{ .white, .king },
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

const Castling = struct {
    black_king: bool,
    black_queen: bool,
    white_king: bool,
    white_queen: bool,
};

pub const position = struct {
    /// a8
    pub const black_queen_rook = BitBoard.fromCoordinate(0, 7);
    /// b8
    pub const black_queen_knight = BitBoard.fromCoordinate(1, 7);
    /// c8
    pub const black_queen_bishop = BitBoard.fromCoordinate(2, 7);
    /// d8
    pub const black_queen = BitBoard.fromCoordinate(3, 7);
    /// e8
    pub const black_king = BitBoard.fromCoordinate(4, 7);
    /// f8
    pub const black_king_bishop = BitBoard.fromCoordinate(5, 7);
    /// g8
    pub const black_king_knight = BitBoard.fromCoordinate(6, 7);
    /// h8
    pub const black_king_rook = BitBoard.fromCoordinate(7, 7);

    /// a1
    pub const white_queen_rook = BitBoard.fromCoordinate(0, 0);
    /// b1
    pub const white_queen_knight = BitBoard.fromCoordinate(1, 0);
    /// c1
    pub const white_queen_bishop = BitBoard.fromCoordinate(2, 0);
    /// d1
    pub const white_queen = BitBoard.fromCoordinate(3, 0);
    /// e1
    pub const white_king = BitBoard.fromCoordinate(4, 0);
    /// f1
    pub const white_king_bishop = BitBoard.fromCoordinate(5, 0);
    /// g1
    pub const white_king_knight = BitBoard.fromCoordinate(6, 0);
    /// h1
    pub const white_king_rook = BitBoard.fromCoordinate(7, 0);

    const mask_black_square = BitBoard.fromString(
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
    , 'o');
    const mask_white_square = BitBoard.fromString(
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
    , 'o');

    const mask_final_rank = BitBoard.fromString(
        \\oooooooo
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\oooooooo
    , 'o');
};

const initial_pieces =
    \\RNBQKBNR
    \\PPPPPPPP
    \\........
    \\........
    \\........
    \\........
    \\pppppppp
    \\rnbqkbnr
;

boards: ColorPieceBoards,

/// アンパサンが可能ならその位置、それ以外では0
enpassant_target: BitBoard = BitBoard.init(),
/// キャスリングが可能かどうか
castling_available: Castling = .{
    .black_king = true,
    .black_queen = true,
    .white_king = true,
    .white_queen = true,
},

pub fn init() Board {
    return fromString(initial_pieces);
}

pub fn fromString(str: []const u8) Board {
    return .{ .boards = ColorPieceBoards.init(.{
        .black = PieceBoards.init(.{
            .pawn = BitBoard.fromString(str, 'P'),
            .knight = BitBoard.fromString(str, 'N'),
            .bishop = BitBoard.fromString(str, 'B'),
            .rook = BitBoard.fromString(str, 'R'),
            .queen = BitBoard.fromString(str, 'Q'),
            .king = BitBoard.fromString(str, 'K'),
        }),

        .white = PieceBoards.init(.{
            .pawn = BitBoard.fromString(str, 'p'),
            .knight = BitBoard.fromString(str, 'n'),
            .bishop = BitBoard.fromString(str, 'b'),
            .rook = BitBoard.fromString(str, 'r'),
            .queen = BitBoard.fromString(str, 'q'),
            .king = BitBoard.fromString(str, 'k'),
        }),
    }) };
}

/// 色と種類、追加する駒を指定し、チェスボードに駒を追加する。
pub fn setPiece(board: *Board, color_piece: ColorPieceType, pieces: BitBoard) void {
    switch (color_piece) {
        .black_pawn => board.getBoardPtr(.black, .pawn).setUnion(pieces),
        .black_knight => board.getBoardPtr(.black, .knight).setUnion(pieces),
        .black_bishop => board.getBoardPtr(.black, .bishop).setUnion(pieces),
        .black_rook => board.getBoardPtr(.black, .rook).setUnion(pieces),
        .black_queen => board.getBoardPtr(.black, .queen).setUnion(pieces),
        .black_king => board.getBoardPtr(.black, .king).setUnion(pieces),

        .white_pawn => board.getBoardPtr(.white, .pawn).setUnion(pieces),
        .white_knight => board.getBoardPtr(.white, .knight).setUnion(pieces),
        .white_bishop => board.getBoardPtr(.white, .bishop).setUnion(pieces),
        .white_rook => board.getBoardPtr(.white, .rook).setUnion(pieces),
        .white_queen => board.getBoardPtr(.white, .queen).setUnion(pieces),
        .white_king => board.getBoardPtr(.white, .king).setUnion(pieces),
    }
}

pub fn getBoard(board: Board, color: Color, piece: PieceType) BitBoard {
    return board.boards.get(color).get(piece);
}

pub fn getBoardPtr(board: *Board, color: Color, piece: PieceType) *BitBoard {
    return board.boards.getPtr(color).getPtr(piece);
}

// 引数の色と種類からその色と種類のすべての駒の位置を返します。
pub fn getPieces(board: Board, color_piece: ColorPieceType) BitBoard {
    const color, const piece = color_piece.toColorPiece();
    return board.getBoard(color, piece);
}

// 引数の色からその色のすべての駒の位置を返します。
pub fn getColorPieces(board: Board, color: Color) BitBoard {
    var color_board = board.boards.get(color);
    var iter = color_board.iterator();

    var pieces = BitBoard.init();
    while (iter.next()) |piece| {
        pieces.setUnion(piece.value.*);
    }

    return pieces;
}

// 場所からそこのマスにいるコマの色と種類を返します。
pub fn getColorType(board: Board, place: BitBoard) ?ColorPieceType {
    for (std.enums.values(Color)) |color| {
        for (std.enums.values(PieceType)) |piece| {
            if (board.getBoard(color, piece).isJoint(place)) {
                return ColorPieceType.fromColorType(color, piece);
            }
        }
    }

    return null;
}

// 場所からそこのマスにいるコマの色を返します。
pub fn getColor(board: Board, place: BitBoard) ?Color {
    return if (board.getColorType(place)) |color_type| color_type.color() else null;
}

// 場所からそこのマスにいるコマの種類を返します。
pub fn getType(board: Board, place: BitBoard) ?PieceType {
    return if (board.getColorType(place)) |color_type| color_type.pieceType() else null;
}

pub fn getMove(board: Board, from: BitBoard) BitBoard {
    const color_type = board.getColorType(from) orelse return BitBoard.init();

    const to_list = board.getNormalMove(from, color_type)
        .unions(board.getCastlingMove(from))
        .unions(board.getEnpassant(from, color_type.color()));

    return board.filterValidMove(from, to_list);
}

/// 通常の動きを取得する。
fn getNormalMove(board: Board, from: BitBoard, color_type: ColorPieceType) BitBoard {
    return switch (color_type.pieceType()) {
        .pawn => moves.pawn(board, from, color_type.color()),
        .knight => moves.knight(board, from, color_type.color()),
        .bishop => moves.bishop(board, from, color_type.color()),
        .rook => moves.rook(board, from, color_type.color()),
        .queen => moves.queen(board, from, color_type.color()),
        .king => moves.king(board, from, color_type.color()),
    };
}

fn getCastlingMove(board: Board, from: BitBoard) BitBoard {
    var new_board = BitBoard.init();
    if (from.eql(position.white_king)) {
        if (board.castling_available.white_king and board.canCastling(.white_king)) {
            new_board.setUnion(position.white_king_rook);
        }
        if (board.castling_available.white_queen and board.canCastling(.white_queen)) {
            new_board.setUnion(position.white_queen_rook);
        }
    } else if (from.eql(position.black_king)) {
        if (board.castling_available.black_king and board.canCastling(.black_king)) {
            new_board.setUnion(position.black_king_rook);
        }
        if (board.castling_available.black_queen and board.canCastling(.black_queen)) {
            new_board.setUnion(position.black_queen_rook);
        }
    }
    return new_board;
}

fn getEnpassant(board: Board, from: BitBoard, color: Color) BitBoard {
    if (board.getBoard(color, .pawn).isJoint(from) and switch (color) {
        .black => from.move(.se).unions(from.move(.sw)).isJoint(board.enpassant_target),
        .white => from.move(.ne).unions(from.move(.nw)).isJoint(board.enpassant_target),
    }) {
        return board.enpassant_target;
    } else {
        return BitBoard.init();
    }
}

/// プロモーションかどうかを判定する。
/// ポーンが最終ランクに到達したとき
pub fn isPromotion(board: Board, from: BitBoard, to: BitBoard) bool {
    return to.isJoint(position.mask_final_rank) and board.getType(from) == .pawn;
}

/// 現在の盤面でキャスリングが可能かどうかを判定する。
/// - キングとルークの間に駒がない
/// - キングの移動範囲が全て攻撃されていない
pub fn canCastling(board: Board, color_piece: ColorPieceType) bool {
    const black_king = position.black_king;
    const black_king_side_rook = position.black_king_rook;
    const black_queen_side_rook = position.black_queen_rook;

    const black_king_side_no_attacked = position.black_king.unions(position.black_king_bishop).unions(position.black_king_knight);
    const black_king_side_no_pieces = position.black_king_bishop.unions(position.black_king_knight);
    const black_queen_side_no_attacked = position.black_queen_bishop.unions(position.black_queen).unions(position.black_king);
    const black_queen_side_no_pieces = position.black_queen_knight.unions(position.black_queen_bishop).unions(position.black_queen);

    const white_king = position.white_king;
    const white_king_side_rook = position.white_king_rook;
    const white_queen_side_rook = position.white_queen_rook;

    const white_king_side_no_attacked = position.white_king.unions(position.white_king_bishop).unions(position.white_king_knight);
    const white_king_side_no_pieces = position.white_king_bishop.unions(position.white_king_knight);
    const white_queen_side_no_attacked = position.white_queen_bishop.unions(position.white_queen).unions(position.white_king);
    const white_queen_side_no_pieces = position.white_queen_knight.unions(position.white_queen_bishop).unions(position.white_queen);

    const pieces = board.getColorPieces(.black).unions(board.getColorPieces(.white));
    switch (color_piece) {
        .black_king => return board.boards.get(.black).get(.king).isJoint(black_king) and
            board.boards.get(.black).get(.rook).isJoint(black_king_side_rook) and
            pieces.isDisjoint(black_king_side_no_pieces) and
            !board.isAttacked(black_king_side_no_attacked, .black),

        .black_queen => return board.boards.get(.black).get(.king).isJoint(black_king) and
            board.boards.get(.black).get(.rook).isJoint(black_queen_side_rook) and
            pieces.isDisjoint(black_queen_side_no_pieces) and
            !board.isAttacked(black_queen_side_no_attacked, .black),

        .white_king => return board.boards.get(.white).get(.king).isJoint(white_king) and
            board.boards.get(.white).get(.rook).isJoint(white_king_side_rook) and
            pieces.isDisjoint(white_king_side_no_pieces) and
            !board.isAttacked(white_king_side_no_attacked, .white),

        .white_queen => return board.boards.get(.white).get(.king).isJoint(white_king) and
            board.boards.get(.white).get(.rook).isJoint(white_queen_side_rook) and
            pieces.isDisjoint(white_queen_side_no_pieces) and
            !board.isAttacked(white_queen_side_no_attacked, .white),

        else => return false,
    }
}

pub fn filterValidMove(board: Board, from: BitBoard, to_list: BitBoard) BitBoard {
    const from_color = board.getColor(from) orelse return BitBoard.init();

    var iter = to_list.iterator();
    var valid_board = BitBoard.init();
    while (iter.next()) |current| {
        // 動かしたボードがチェック状態の移動先を取り除く
        const moved_board = board.getMovedBoard(from, BitBoard.fromIndex(current));
        if (!moved_board.isChecked(from_color)) {
            valid_board.setUnion(BitBoard.fromIndex(current));
        }
    }

    return valid_board;
}

/// 盤がチェック状態になっているか
/// - color - チェックされるキングの色
pub fn isChecked(board: Board, color: Color) bool {
    if (color == .black) {
        return board.isAttacked(board.boards.get(.black).get(.king), .black);
    } else {
        return board.isAttacked(board.boards.get(.white).get(.king), .white);
    }
}

/// placeのマス目のうち1つ以上が攻撃されているかどうか。
/// 攻撃されているならばtrue。
fn isAttacked(board: Board, place: BitBoard, color: Color) bool {
    if (color == .black) {
        if (place.isJoint(moves.king(board, board.boards.get(.white).get(.king), .white))) {
            return true;
        } else if (place.isJoint(moves.queen(board, board.boards.get(.white).get(.queen), .white))) {
            return true;
        } else if (place.isJoint(moves.rook(board, board.boards.get(.white).get(.rook), .white))) {
            return true;
        } else if (place.isJoint(moves.bishop(board, board.boards.get(.white).get(.bishop), .white))) {
            return true;
        } else if (place.isJoint(moves.knight(board, board.boards.get(.white).get(.knight), .white))) {
            return true;
        } else if (place.isJoint(moves.pawn(board, board.boards.get(.white).get(.pawn), .white))) {
            return true;
        }
    } else {
        if (place.isJoint(moves.king(board, board.boards.get(.black).get(.king), .black))) {
            return true;
        } else if (place.isJoint(moves.queen(board, board.boards.get(.black).get(.queen), .black))) {
            return true;
        } else if (place.isJoint(moves.rook(board, board.boards.get(.black).get(.rook), .black))) {
            return true;
        } else if (place.isJoint(moves.bishop(board, board.boards.get(.black).get(.bishop), .black))) {
            return true;
        } else if (place.isJoint(moves.knight(board, board.boards.get(.black).get(.knight), .black))) {
            return true;
        } else if (place.isJoint(moves.pawn(board, board.boards.get(.black).get(.pawn), .black))) {
            return true;
        }
    }

    return false;
}

/// その色に一つ以上の動かせる駒があるかどうか判定する
pub fn canMove(board: Board, color: Color) bool {
    // 自分の色のすべての駒をループ
    var iter = board.getColorPieces(color).iterator();
    while (iter.next()) |current| {
        // 動ける場所が1つでもあれば真を返して終了
        if (!board.getMove(BitBoard.fromIndex(current)).isEmpty()) {
            return true;
        }
    }

    // 最後まで探索して見つからなかった場合は偽
    return false;
}

/// 材料の不足による引き分けを判定する
pub fn isInsufficientMaterial(board: Board) bool {
    // ポーン、ルーク、クイーンのいずれかが1つ以上ある場合、チェックメイトの可能性がある
    for ([_]Color{ .black, .white }) |color| {
        for ([_]PieceType{ .pawn, .rook, .queen }) |piece| {
            if (!board.getBoard(color, piece).isEmpty()) {
                return false;
            }
        }
    }

    // キング対キング
    const bn = board.getBoard(.black, .knight).count(); // black knight count
    const bb = board.getBoard(.black, .bishop).count(); // black bishop count
    const wn = board.getBoard(.white, .knight).count(); // white knight count
    const wb = board.getBoard(.white, .bishop).count(); // white bishop count

    if (bn == 0 and bb == 0 and wn == 0 and wb == 0) {
        return true;
    }

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

    const bishops = board.getBoard(.black, .bishop).unions(board.getBoard(.white, .bishop));

    // キングとビショップ対キングとビショップ、ビショップは同じ色のマスにいる
    if (bn == 0 and
        wn == 0 and
        (bishops.masks(position.mask_black_square).eql(bishops) or
            bishops.masks(position.mask_white_square).eql(bishops)))
    {
        return true;
    }

    return false;
}

/// ボードから動いた状態の新しいボードを作成する。
/// 1. 移動元と移動先のマスを空にする。
/// 2. 移動先のマスを指定のピースにする。
pub fn getMovedBoard(board: Board, from: BitBoard, to: BitBoard) Board {
    const piece_type = board.getColorType(from) orelse return board;
    const to_piece_type = board.getColorType(to);

    if (piece_type.pieceType() == .king and
        to_piece_type != null and
        piece_type.color() == to_piece_type.?.color() and
        to_piece_type.?.pieceType() == .rook)
    {
        // 動かし元にキング、動かし先に味方のルークがある場合
        var new_board = board.getMovedBoardCastling(from, to);
        new_board.setEnpassant(from, piece_type);

        return new_board;
    } else if (piece_type.pieceType() == .pawn and
        (from.move(.ne).eql(to) or
            from.move(.se).eql(to) or
            from.move(.nw).eql(to) or
            from.move(.sw).eql(to)) and
        to_piece_type == null)
    {
        // ポーンが斜めに動いて動かし先に駒がない場合
        return board.getMovedBoardEnpassant(from, to);
    } else {
        // その他の場合
        var new_board = board.getMovedBoardNormalMove(from, to);
        new_board.setEnpassant(from, piece_type);

        // 次にアンパサンが起こる動きならアンパサンの移動先を代入する
        if (piece_type.pieceType() == .pawn and from.move(.n).move(.n).eql(to)) {
            new_board.enpassant_target = from.move(.n);
        } else if (piece_type.pieceType() == .pawn and from.move(.s).move(.s).eql(to)) {
            new_board.enpassant_target = from.move(.s);
        } else {
            new_board.enpassant_target = BitBoard.init();
        }

        return new_board;
    }
}

fn getMovedBoardNormalMove(board: Board, from: BitBoard, to: BitBoard) Board {
    var new_board = board;

    const from_piece_type = new_board.getColorType(from) orelse return new_board;
    const to_piece_type = new_board.getColorType(to);

    if (to_piece_type) |tpt| {
        // 行き先に駒があるなら取り除く

        const to_color, const to_piece = tpt.toColorPiece();

        const to_inv = to.getInverted();
        new_board.boards.getPtr(to_color).getPtr(to_piece).setMask(to_inv);
    }

    // 動かす駒について元と先のビットを反転させる
    const from_to = from.unions(to);

    const from_color, const from_piece = from_piece_type.toColorPiece();

    new_board.boards.getPtr(from_color).getPtr(from_piece).setToggle(from_to);

    return new_board;
}

/// キャスリングをした後のボードを得る
fn getMovedBoardCastling(board: Board, from: BitBoard, to: BitBoard) Board {
    var new_board = board;

    if (from.eql(position.white_king)) {
        // e1は白のキング
        if (to.eql(position.white_queen_rook)) {
            // クイーンサイド
            new_board.getBoardPtr(.white, .king).setToggle(position.white_queen_bishop.unions(position.white_king));
            new_board.getBoardPtr(.white, .rook).setToggle(position.white_queen_rook.unions(position.white_queen));
        } else if (to.eql(position.white_king_rook)) {
            // キングサイド
            new_board.getBoardPtr(.white, .king).setToggle(position.white_king.unions(position.white_king_knight));
            new_board.getBoardPtr(.white, .rook).setToggle(position.white_king_bishop.unions(position.white_king_rook));
        }
    } else if (from.eql(position.white_king)) {
        // e8は黒のキング
        if (to.eql(position.black_queen_rook)) {
            // クイーンサイド
            new_board.getBoardPtr(.black, .king).setToggle(position.black_queen_bishop.unions(position.black_king));
            new_board.getBoardPtr(.black, .rook).setToggle(position.black_queen_rook.unions(position.black_queen));
        } else if (to.eql(position.black_king_rook)) {
            // キングサイド
            new_board.getBoardPtr(.black, .king).setToggle(position.black_king.unions(position.black_king_knight));
            new_board.getBoardPtr(.black, .rook).setToggle(position.black_king_bishop.unions(position.black_king_rook));
        }
    }

    return new_board;
}

/// アンパサンを実行した後のボードを得る
fn getMovedBoardEnpassant(board: Board, from: BitBoard, to: BitBoard) Board {
    var new_board = board;

    const from_piece_type = new_board.getColorType(from) orelse return new_board;

    // 移動先のマスの1つ後ろの駒
    var capture_target: BitBoard = undefined;

    switch (from_piece_type) {
        .black_pawn => {
            new_board.getBoardPtr(.black, .pawn).setToggle(from.unions(to));
            capture_target = to.move(.n);
        },

        .white_pawn => {
            new_board.getBoardPtr(.white, .pawn).setToggle(from.unions(to));
            capture_target = to.move(.s);
        },

        else => unreachable,
    }

    // 駒を取り除く
    const capture_piece_type = new_board.getColorType(capture_target);

    if (capture_piece_type) |cpt| {
        const capture_inv = capture_target.getInverted();

        const capture_color, const capture_piece = cpt.toColorPiece();

        new_board.getBoardPtr(capture_color, capture_piece).setMask(capture_inv);
    }

    return new_board;
}

/// キャスリングのキングとルークの動きを判定
fn setEnpassant(board: *Board, from: BitBoard, piece_type: ColorPieceType) void {
    switch (piece_type) {
        .black_king => {
            board.castling_available.black_king = false;
            board.castling_available.black_queen = false;
        },
        .black_rook => {
            if (from.eql(position.black_queen_rook)) {
                board.castling_available.black_queen = false;
            } else if (from.eql(position.black_king_rook)) {
                board.castling_available.black_king = false;
            }
        },
        .white_king => {
            board.castling_available.white_king = false;
            board.castling_available.white_queen = false;
        },
        .white_rook => {
            if (from.eql(position.white_queen_rook)) {
                board.castling_available.white_queen = false;
            } else if (from.eql(position.white_king_rook)) {
                board.castling_available.white_king = false;
            }
        },
        else => {},
    }
}

/// ボードからプロモーションした状態の新しいボードを作成する。
pub fn getPromotionBoard(board: Board, from: BitBoard, piece_type: PieceType) Board {
    var new_board = board;

    const color_piece_type = board.getColorType(from) orelse return new_board;
    const color, const piece = color_piece_type.toColorPiece();
    _ = piece;

    new_board.getBoardPtr(color, .pawn).setMask(from.getInverted());
    new_board.getBoardPtr(color, piece_type).setUnion(from);

    return new_board;
}
