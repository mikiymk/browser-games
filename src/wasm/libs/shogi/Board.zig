// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const moves = main.moves;

// test import
test {
    _ = @import("./Board.test.zig");
}

black_king: u81,
black_rook: u81,
black_bishop: u81,
black_gold: u81,
black_silver: u81,
black_knight: u81,
black_lance: u81,
black_pawn: u81,
black_rook_promoted: u81,
black_bishop_promoted: u81,
black_silver_promoted: u81,
black_knight_promoted: u81,
black_lance_promoted: u81,
black_pawn_promoted: u81,
white_king: u81,
white_rook: u81,
white_bishop: u81,
white_gold: u81,
white_silver: u81,
white_knight: u81,
white_lance: u81,
white_pawn: u81,
white_rook_promoted: u81,
white_bishop_promoted: u81,
white_silver_promoted: u81,
white_knight_promoted: u81,
white_lance_promoted: u81,
white_pawn_promoted: u81,

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
    return .{
        .black_king = BitBoard.fromString(str, 'k'),
        .black_rook = BitBoard.fromString(str, 'r'),
        .black_bishop = BitBoard.fromString(str, 'b'),
        .black_gold = BitBoard.fromString(str, 'g'),
        .black_silver = BitBoard.fromString(str, 's'),
        .black_knight = BitBoard.fromString(str, 'n'),
        .black_lance = BitBoard.fromString(str, 'l'),
        .black_pawn = BitBoard.fromString(str, 'p'),
        .black_rook_promoted = BitBoard.fromString(str, 'd'),
        .black_bishop_promoted = BitBoard.fromString(str, 'h'),
        .black_silver_promoted = BitBoard.fromString(str, 't'),
        .black_knight_promoted = BitBoard.fromString(str, 'o'),
        .black_lance_promoted = BitBoard.fromString(str, 'm'),
        .black_pawn_promoted = BitBoard.fromString(str, 'q'),
        .white_king = BitBoard.fromString(str, 'K'),
        .white_rook = BitBoard.fromString(str, 'R'),
        .white_bishop = BitBoard.fromString(str, 'B'),
        .white_gold = BitBoard.fromString(str, 'G'),
        .white_silver = BitBoard.fromString(str, 'S'),
        .white_knight = BitBoard.fromString(str, 'N'),
        .white_lance = BitBoard.fromString(str, 'L'),
        .white_pawn = BitBoard.fromString(str, 'P'),
        .white_rook_promoted = BitBoard.fromString(str, 'D'),
        .white_bishop_promoted = BitBoard.fromString(str, 'H'),
        .white_silver_promoted = BitBoard.fromString(str, 'T'),
        .white_knight_promoted = BitBoard.fromString(str, 'O'),
        .white_lance_promoted = BitBoard.fromString(str, 'M'),
        .white_pawn_promoted = BitBoard.fromString(str, 'Q'),
    };
}

/// 指定したマスにある駒の種類を取得する。
pub fn getPieceAt(board: Board, position: u81) Game.Square {
    if (board.black_king & position != 0) {
        return .black_king;
    } else if (board.black_rook & position != 0) {
        return .black_rook;
    } else if (board.black_bishop & position != 0) {
        return .black_bishop;
    } else if (board.black_gold & position != 0) {
        return .black_gold;
    } else if (board.black_silver & position != 0) {
        return .black_silver;
    } else if (board.black_knight & position != 0) {
        return .black_knight;
    } else if (board.black_lance & position != 0) {
        return .black_lance;
    } else if (board.black_pawn & position != 0) {
        return .black_pawn;
    } else if (board.black_rook_promoted & position != 0) {
        return .black_rook_promoted;
    } else if (board.black_bishop_promoted & position != 0) {
        return .black_bishop_promoted;
    } else if (board.black_silver_promoted & position != 0) {
        return .black_silver_promoted;
    } else if (board.black_knight_promoted & position != 0) {
        return .black_knight_promoted;
    } else if (board.black_lance_promoted & position != 0) {
        return .black_lance_promoted;
    } else if (board.black_pawn_promoted & position != 0) {
        return .black_pawn_promoted;
    } else if (board.white_king & position != 0) {
        return .white_king;
    } else if (board.white_rook & position != 0) {
        return .white_rook;
    } else if (board.white_bishop & position != 0) {
        return .white_bishop;
    } else if (board.white_gold & position != 0) {
        return .white_gold;
    } else if (board.white_silver & position != 0) {
        return .white_silver;
    } else if (board.white_knight & position != 0) {
        return .white_knight;
    } else if (board.white_lance & position != 0) {
        return .white_lance;
    } else if (board.white_pawn & position != 0) {
        return .white_pawn;
    } else if (board.white_rook_promoted & position != 0) {
        return .white_rook_promoted;
    } else if (board.white_bishop_promoted & position != 0) {
        return .white_bishop_promoted;
    } else if (board.white_silver_promoted & position != 0) {
        return .white_silver_promoted;
    } else if (board.white_knight_promoted & position != 0) {
        return .white_knight_promoted;
    } else if (board.white_lance_promoted & position != 0) {
        return .white_lance_promoted;
    } else if (board.white_pawn_promoted & position != 0) {
        return .white_pawn_promoted;
    }

    return .empty;
}

/// 駒を移動したボードを作成する
pub fn movedBoard(board: Board, from: u81, to: u81) Board {
    var new_board = board;

    const piece_board: *u81 =
        if (new_board.black_king & from != 0)
        &new_board.black_king
    else if (new_board.black_rook & from != 0)
        &new_board.black_rook
    else if (new_board.black_bishop & from != 0)
        &new_board.black_bishop
    else if (new_board.black_gold & from != 0)
        &new_board.black_gold
    else if (new_board.black_silver & from != 0)
        &new_board.black_silver
    else if (new_board.black_knight & from != 0)
        &new_board.black_knight
    else if (new_board.black_lance & from != 0)
        &new_board.black_lance
    else if (new_board.black_pawn & from != 0)
        &new_board.black_pawn
    else if (new_board.black_rook_promoted & from != 0)
        &new_board.black_rook_promoted
    else if (new_board.black_bishop_promoted & from != 0)
        &new_board.black_bishop_promoted
    else if (new_board.black_silver_promoted & from != 0)
        &new_board.black_silver_promoted
    else if (new_board.black_knight_promoted & from != 0)
        &new_board.black_knight_promoted
    else if (new_board.black_lance_promoted & from != 0)
        &new_board.black_lance_promoted
    else if (new_board.black_pawn_promoted & from != 0)
        &new_board.black_pawn_promoted
    else if (new_board.white_king & from != 0)
        &new_board.white_king
    else if (new_board.white_rook & from != 0)
        &new_board.white_rook
    else if (new_board.white_bishop & from != 0)
        &new_board.white_bishop
    else if (new_board.white_gold & from != 0)
        &new_board.white_gold
    else if (new_board.white_silver & from != 0)
        &new_board.white_silver
    else if (new_board.white_knight & from != 0)
        &new_board.white_knight
    else if (new_board.white_lance & from != 0)
        &new_board.white_lance
    else if (new_board.white_pawn & from != 0)
        &new_board.white_pawn
    else if (new_board.white_rook_promoted & from != 0)
        &new_board.white_rook_promoted
    else if (new_board.white_bishop_promoted & from != 0)
        &new_board.white_bishop_promoted
    else if (new_board.white_silver_promoted & from != 0)
        &new_board.white_silver_promoted
    else if (new_board.white_knight_promoted & from != 0)
        &new_board.white_knight_promoted
    else if (new_board.white_lance_promoted & from != 0)
        &new_board.white_lance_promoted
    else if (new_board.white_pawn_promoted & from != 0)
        &new_board.white_pawn_promoted
    else
        return new_board;

    new_board.black_king |= ~to;
    new_board.black_rook |= ~to;
    new_board.black_bishop |= ~to;
    new_board.black_gold |= ~to;
    new_board.black_silver |= ~to;
    new_board.black_knight |= ~to;
    new_board.black_lance |= ~to;
    new_board.black_pawn |= ~to;
    new_board.black_rook_promoted |= ~to;
    new_board.black_bishop_promoted |= ~to;
    new_board.black_silver_promoted |= ~to;
    new_board.black_knight_promoted |= ~to;
    new_board.black_lance_promoted |= ~to;
    new_board.black_pawn_promoted |= ~to;
    new_board.white_king |= ~to;
    new_board.white_rook |= ~to;
    new_board.white_bishop |= ~to;
    new_board.white_gold |= ~to;
    new_board.white_silver |= ~to;
    new_board.white_knight |= ~to;
    new_board.white_lance |= ~to;
    new_board.white_pawn |= ~to;
    new_board.white_rook_promoted |= ~to;
    new_board.white_bishop_promoted |= ~to;
    new_board.white_silver_promoted |= ~to;
    new_board.white_knight_promoted |= ~to;
    new_board.white_lance_promoted |= ~to;
    new_board.white_pawn_promoted |= ~to;

    piece_board.* ^= from & to;

    return new_board;
}

pub fn getColorPiecesArray(board: Board, color: Game.PlayerColor) [14]u81 {
    return switch (color) {
        .black => .{
            board.black_king,
            board.black_rook,
            board.black_bishop,
            board.black_gold,
            board.black_silver,
            board.black_knight,
            board.black_lance,
            board.black_pawn,
            board.black_rook_promoted,
            board.black_bishop_promoted,
            board.black_silver_promoted,
            board.black_knight_promoted,
            board.black_lance_promoted,
            board.black_pawn_promoted,
        },
        .white => .{
            board.white_king,
            board.white_rook,
            board.white_bishop,
            board.white_gold,
            board.white_silver,
            board.white_knight,
            board.white_lance,
            board.white_pawn,
            board.white_rook_promoted,
            board.white_bishop_promoted,
            board.white_silver_promoted,
            board.white_knight_promoted,
            board.white_lance_promoted,
            board.white_pawn_promoted,
        },
    };
}

pub fn getColorPieces(board: Board, color: Game.PlayerColor) u81 {
    return switch (color) {
        .black => board.black_king |
            board.black_rook |
            board.black_bishop |
            board.black_gold |
            board.black_silver |
            board.black_knight |
            board.black_lance |
            board.black_pawn |
            board.black_rook_promoted |
            board.black_bishop_promoted |
            board.black_silver_promoted |
            board.black_knight_promoted |
            board.black_lance_promoted |
            board.black_pawn_promoted,
        .white => board.white_king |
            board.white_rook |
            board.white_bishop |
            board.white_gold |
            board.white_silver |
            board.white_knight |
            board.white_lance |
            board.white_pawn |
            board.white_rook_promoted |
            board.white_bishop_promoted |
            board.white_silver_promoted |
            board.white_knight_promoted |
            board.white_lance_promoted |
            board.white_pawn_promoted,
    };
}

/// その色の駒の行ける範囲をすべて得る
pub fn getAllMoves(board: Board, color: Game.PlayerColor) u81 {
    switch (color) {
        .white => {
            var move_places: u81 = 0;
            move_places |= moves.whitePawn(board, board.white_pawn);
            move_places |= moves.whiteLance(board, board.white_lance);
            move_places |= moves.whiteKnight(board, board.white_knight);
            move_places |= moves.whiteSilver(board, board.white_silver);
            move_places |= moves.whiteGold(board, board.white_gold);
            move_places |= moves.bishop(board, board.white_bishop, .white);
            move_places |= moves.rook(board, board.white_rook, .white);
            move_places |= moves.king(board, board.white_king, .white);

            move_places |= moves.whiteGold(board, board.white_pawn_promoted);
            move_places |= moves.whiteGold(board, board.white_lance_promoted);
            move_places |= moves.whiteGold(board, board.white_knight_promoted);
            move_places |= moves.whiteGold(board, board.white_silver_promoted);

            return move_places;
        },
        .black => {
            var move_places: u81 = 0;
            move_places |= moves.blackPawn(board, board.black_pawn);
            move_places |= moves.blackLance(board, board.black_lance);
            move_places |= moves.blackKnight(board, board.black_knight);
            move_places |= moves.blackSilver(board, board.black_silver);
            move_places |= moves.blackGold(board, board.black_gold);
            move_places |= moves.bishop(board, board.black_bishop, .black);
            move_places |= moves.rook(board, board.black_rook, .black);
            move_places |= moves.king(board, board.black_king, .black);

            move_places |= moves.blackGold(board, board.black_pawn_promoted);
            move_places |= moves.blackGold(board, board.black_lance_promoted);
            move_places |= moves.blackGold(board, board.black_knight_promoted);
            move_places |= moves.blackGold(board, board.black_silver_promoted);

            return move_places;
        },
    }
}

/// セルフ王手を除く
pub fn filterMove(board: Board, color: Game.PlayerColor, from: u81, to: u81) u81 {
    var filtered: u81 = 0;
    var to_iter = BitBoard.iterator(to);

    while (to_iter.next()) |t| {
        const new_board = board.movedBoard(from, t);

        if (!new_board.isChecked(color)) {
            filtered |= t;
        }
    }

    return filtered;
}

/// 指定したマスが攻撃されているか
pub fn isAttacked(board: Board, place: u81, color: Game.PlayerColor) bool {
    return place & board.getAllMoves(color) != 0;
}

/// 指定した色の王が王手状態になっているかどうか
pub fn isChecked(board: Board, color: Game.PlayerColor) bool {
    const king = switch (color) {
        .white => board.white_king,
        .black => board.black_king,
    };

    return board.isAttacked(king, color);
}

/// 指定した色の王が王手を逃れられない状態になっているかどうか
pub fn isCheckmated(board: Board, color: Game.PlayerColor) bool {
    if (!board.isChecked(color)) {
        return false;
    }

    const pieces = board.getColorPiecesArray(color);

    for (pieces) |piece| {
        var piece_iter = BitBoard.iterator(piece);

        while (piece_iter.next()) |p| {
            const move_to = moves.move(board, p);
            const filtered_moves = board.filterMove(color, p, move_to);

            if (filtered_moves != 0) {
                return false;
            }
        }
    }

    return true;
}
