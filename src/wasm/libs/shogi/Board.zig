// std import
const std = @import("std");
const builtin = @import("builtin");

const PieceBoards = std.enums.EnumArray(PromotionPiece, BitBoard);
const ColorPieceBoards = std.enums.EnumArray(Color, PieceBoards);

// common import
const common = @import("../common/main.zig");
pub const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const moves = main.moves;

// test import
test {
    _ = @import("./Board.test.zig");
}

/// 駒の種類
pub const Piece = enum { king, rook, bishop, gold, silver, knight, lance, pawn };

/// 成りの種類
pub const Promotion = enum { normal, promoted };

/// プレイヤーの種類
pub const Color = enum(u8) {
    /// 先手
    white = 1,
    /// 後手
    black = 2,

    pub fn turn(self: Color) Color {
        return switch (self) {
            .black => .white,
            .white => .black,
        };
    }
};

pub const PromotionPieceStruct = struct {
    piece: Piece,
    promotion: Promotion = .normal,
};

/// 駒の種類
pub const PromotionPiece = enum {
    /// 王将
    king,
    /// 飛車
    rook,
    /// 角行
    bishop,
    /// 金将
    gold,
    /// 銀将
    silver,
    /// 桂馬
    knight,
    /// 香車
    lance,
    /// 歩兵
    pawn,
    /// 龍王
    rook_promoted,
    /// 龍馬
    bishop_promoted,
    /// 成銀
    silver_promoted,
    /// 成桂
    knight_promoted,
    /// 成香
    lance_promoted,
    /// と金
    pawn_promoted,

    pub fn toPiece(self: PromotionPiece) PromotionPieceStruct {
        return switch (self) {
            .king => .{ .piece = .king },
            .rook => .{ .piece = .rook },
            .bishop => .{ .piece = .bishop },
            .gold => .{ .piece = .gold },
            .silver => .{ .piece = .silver },
            .knight => .{ .piece = .knight },
            .lance => .{ .piece = .lance },
            .pawn => .{ .piece = .pawn },
            .rook_promoted => .{ .piece = .rook, .promotion = .promoted },
            .bishop_promoted => .{ .piece = .bishop, .promotion = .promoted },
            .silver_promoted => .{ .piece = .silver, .promotion = .promoted },
            .knight_promoted => .{ .piece = .knight, .promotion = .promoted },
            .lance_promoted => .{ .piece = .lance, .promotion = .promoted },
            .pawn_promoted => .{ .piece = .pawn, .promotion = .promoted },
        };
    }

    pub fn fromPiece(piece: Piece, promotion: Promotion) PromotionPiece {
        return switch (piece) {
            .king => switch (promotion) {
                .normal => .king,
                .promoted => unreachable,
            },
            .rook => switch (promotion) {
                .normal => .rook,
                .promoted => .rook_promoted,
            },
            .bishop => switch (promotion) {
                .normal => .bishop,
                .promoted => .bishop_promoted,
            },
            .gold => switch (promotion) {
                .normal => .gold,
                .promoted => unreachable,
            },
            .silver => switch (promotion) {
                .normal => .silver,
                .promoted => .silver_promoted,
            },
            .knight => switch (promotion) {
                .normal => .knight,
                .promoted => .knight_promoted,
            },
            .lance => switch (promotion) {
                .normal => .lance,
                .promoted => .lance_promoted,
            },
            .pawn => switch (promotion) {
                .normal => .pawn,
                .promoted => .pawn_promoted,
            },
        };
    }

    pub fn promoted(self: PromotionPiece) PromotionPiece {
        const piece = self.toPiece();
        return fromPiece(piece.piece, .promoted);
    }
};

boards: ColorPieceBoards,

pub fn init() Board {
    return fromString(
        \\lnsgkgsnl
        \\.r.....b.
        \\ppppppppp
        \\.........
        \\.........
        \\.........
        \\PPPPPPPPP
        \\.B.....R.
        \\LNSGKGSNL
    );
}

pub fn fromString(str: []const u8) Board {
    return .{ .boards = ColorPieceBoards.init(.{
        .black = PieceBoards.init(.{
            .king = BitBoard.fromString(str, 'k'),
            .rook = BitBoard.fromString(str, 'r'),
            .bishop = BitBoard.fromString(str, 'b'),
            .gold = BitBoard.fromString(str, 'g'),
            .silver = BitBoard.fromString(str, 's'),
            .knight = BitBoard.fromString(str, 'n'),
            .lance = BitBoard.fromString(str, 'l'),
            .pawn = BitBoard.fromString(str, 'p'),
            .rook_promoted = BitBoard.fromString(str, 'd'),
            .bishop_promoted = BitBoard.fromString(str, 'h'),
            .silver_promoted = BitBoard.fromString(str, 't'),
            .knight_promoted = BitBoard.fromString(str, 'o'),
            .lance_promoted = BitBoard.fromString(str, 'm'),
            .pawn_promoted = BitBoard.fromString(str, 'q'),
        }),
        .white = PieceBoards.init(.{
            .king = BitBoard.fromString(str, 'K'),
            .rook = BitBoard.fromString(str, 'R'),
            .bishop = BitBoard.fromString(str, 'B'),
            .gold = BitBoard.fromString(str, 'G'),
            .silver = BitBoard.fromString(str, 'S'),
            .knight = BitBoard.fromString(str, 'N'),
            .lance = BitBoard.fromString(str, 'L'),
            .pawn = BitBoard.fromString(str, 'P'),
            .rook_promoted = BitBoard.fromString(str, 'D'),
            .bishop_promoted = BitBoard.fromString(str, 'H'),
            .silver_promoted = BitBoard.fromString(str, 'T'),
            .knight_promoted = BitBoard.fromString(str, 'O'),
            .lance_promoted = BitBoard.fromString(str, 'M'),
            .pawn_promoted = BitBoard.fromString(str, 'Q'),
        }),
    }) };
}

/// 選択した色、種類の駒のボードを取得する。
pub fn getBoard(board: Board, color: Color, piece: PromotionPiece) BitBoard {
    return board.boards.get(color).get(piece);
}

/// 選択した色、種類の駒のボードのポインタを取得する。
pub fn getBoardPtr(board: *Board, color: Color, piece: PromotionPiece) *BitBoard {
    return board.boards.getPtr(color).getPtr(piece);
}

/// 指定したマスにある駒の種類を取得する。
pub fn getPieceAt(board: Board, position: BitBoard) Game.Square {
    var boards = board.boards;
    var color_iter = boards.iterator();

    while (color_iter.next()) |color_board| {
        var piece_iter = color_board.value.iterator();

        while (piece_iter.next()) |piece_board| {
            if (piece_board.value.isJoint(position)) {
                return Game.Square.fromColorPiece(color_board.key, piece_board.key);
            }
        }
    }

    return .empty;
}

/// 駒を移動したボードを作成する
pub fn movedBoard(board: Board, from: BitBoard, to: BitBoard) Board {
    var new_board = board;

    const from_square = board.getPieceAt(from);
    const from_color_piece = from_square.toColorPiece() orelse return new_board;
    const from_color = from_color_piece.color;
    const from_piece = from_color_piece.piece;

    const to_square = board.getPieceAt(to);

    new_board.getBoardPtr(from_color, from_piece).setToggle(from.unions(to));

    if (to_square.toColorPiece()) |to_color_piece| {
        const to_color = to_color_piece.color;
        const to_piece = to_color_piece.piece;

        const to_inversed = to.inversed();
        new_board.getBoardPtr(to_color, to_piece).setMask(to_inversed);
    }

    return new_board;
}

pub fn promotedBoard(board: Board, position: BitBoard) Board {
    const square = board.getPieceAt(position);
    const color_piece = square.toColorPiece() orelse unreachable;
    const color = color_piece.color;
    const piece = color_piece.piece;

    var new_board = board;

    new_board.getBoardPtr(color, piece).setMask(position.inversed());
    new_board.getBoardPtr(color, piece.promoted()).setUnion(position);

    return new_board;
}

/// 駒を盤上に追加する
pub fn hitBoard(board: Board, color: Color, piece: PromotionPiece, to: BitBoard) Board {
    var new_board = board;
    new_board.getBoardPtr(color, piece).setUnion(to);
    return new_board;
}

pub fn getColorPiecesArray(board: Board, color: Color) [14]BitBoard {
    return board.boards.get(color).values;
}

pub fn getColorPieces(board: Board, color: Color) BitBoard {
    var union_board = BitBoard.init();
    for (board.boards.get(color).values) |color_board| {
        union_board.setUnion(color_board);
    }

    return union_board;
}

/// 駒を指定して、その駒の行ける範囲を得る
pub fn movePositions(board: Board, from: BitBoard) BitBoard {
    const piece_type = board.getPieceAt(from);
    const color_piece = piece_type.toColorPiece() orelse return BitBoard.init();
    const color = color_piece.color;
    const piece = color_piece.piece;

    const move_to = moves.moveByPiece(board, from, piece, color);
    const filtered_move_to = board.filterMove(color, from, move_to);

    return filtered_move_to;
}

pub fn hitPositions(board: Board, color: Color, piece: Piece) BitBoard {
    const empty = board.getColorPieces(.black).unions(board.getColorPieces(.white)).inversed();

    return switch (piece) {
        .pawn, .lance => switch (color) {
            .white => empty.excludes(white_farest),
            .black => empty.excludes(black_farest),
        },
        .knight => switch (color) {
            .white => empty.excludes(white_farest2),
            .black => empty.excludes(black_farest2),
        },
        else => empty,
    };
}

/// その色の駒の行ける範囲をすべて得る
pub fn getAllMoves(board: Board, color: Color) BitBoard {
    var boards = board.boards.get(color);
    var iter = boards.iterator();

    var move_places = BitBoard.init();

    while (iter.next()) |piece_board| {
        move_places.setUnion(moves.moveByPiece(board, piece_board.value.*, piece_board.key, color));
    }

    return move_places;
}

/// セルフ王手を除く
pub fn filterMove(board: Board, color: Color, from: BitBoard, to: BitBoard) BitBoard {
    var filtered = BitBoard.init();
    var to_iter = to.iterator();

    while (to_iter.next()) |t| {
        const to_item = BitBoard.fromIndex(t);
        const new_board = board.movedBoard(from, to_item);

        if (!new_board.isChecked(color)) {
            filtered.setUnion(to_item);
        }
    }

    return filtered;
}

/// 指定したマスが攻撃されているか
pub fn isAttacked(board: Board, place: BitBoard, color: Color) bool {
    return place.isJoint(board.getAllMoves(color.turn()));
}

/// 指定した色の王が王手状態になっているかどうか
pub fn isChecked(board: Board, color: Color) bool {
    const king = board.getBoard(color, .king);

    return board.isAttacked(king, color);
}

/// 指定した色の王が王手を逃れられない状態になっているかどうか
pub fn isCheckmated(board: Board, color: Color) bool {
    if (!board.isChecked(color)) {
        return false;
    }

    const pieces = board.getColorPiecesArray(color);

    for (pieces) |piece| {
        var piece_iter = piece.iterator();

        while (piece_iter.next()) |p| {
            const piece_board = BitBoard.fromIndex(p);
            const move_to = moves.move(board, piece_board);
            const filtered_moves = board.filterMove(color, piece_board, move_to);

            if (!filtered_moves.isEmpty()) {
                return false;
            }
        }
    }

    return true;
}

pub const black_farest = BitBoard.fromString(
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\ooooooooo
, 'o');
pub const black_farest2 = BitBoard.fromString(
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\ooooooooo
    \\ooooooooo
, 'o');
const black_farest3 = BitBoard.fromString(
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\ooooooooo
    \\ooooooooo
    \\ooooooooo
, 'o');
pub const white_farest = BitBoard.fromString(
    \\ooooooooo
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
, 'o');
pub const white_farest2 = BitBoard.fromString(
    \\ooooooooo
    \\ooooooooo
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
, 'o');
const white_farest3 = BitBoard.fromString(
    \\ooooooooo
    \\ooooooooo
    \\ooooooooo
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
    \\.........
, 'o');

/// 成るかどうか選択できる場合
/// 移動元または移動先が奥から3つ以内
/// 成れる駒の種類
pub fn canPromotion(board: Board, from: BitBoard, to: BitBoard) bool {
    const piece_type = board.getPieceAt(to);
    const color_piece = piece_type.toColorPiece() orelse return false;
    const is_promotionable_piece = switch (color_piece.piece) {
        .rook, .bishop, .silver, .knight, .lance, .pawn => true,
        else => false,
    };

    if (!is_promotionable_piece) {
        return false;
    }

    return switch (color_piece.color) {
        .black => black_farest3.isJoint(from.unions(to)),
        .white => white_farest3.isJoint(from.unions(to)),
    };
}

/// 必ず成らないといけない場合
///
/// - 歩兵、香車が最も奥にいる
/// - 桂馬が奥から2つ以内にいる
pub fn needsPromotion(board: Board, to: BitBoard) bool {
    const piece_type = board.getPieceAt(to);

    return switch (piece_type) {
        .black_pawn, .black_lance => to.isJoint(black_farest),
        .black_knight => to.isJoint(black_farest2),
        .white_pawn, .white_lance => to.isJoint(white_farest),
        .white_knight => to.isJoint(white_farest2),
        else => false,
    };
}
