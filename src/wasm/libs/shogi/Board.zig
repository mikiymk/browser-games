// std import
const std = @import("std");
const builtin = @import("builtin");

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

black_king: BitBoard,
black_rook: BitBoard,
black_bishop: BitBoard,
black_gold: BitBoard,
black_silver: BitBoard,
black_knight: BitBoard,
black_lance: BitBoard,
black_pawn: BitBoard,
black_rook_promoted: BitBoard,
black_bishop_promoted: BitBoard,
black_silver_promoted: BitBoard,
black_knight_promoted: BitBoard,
black_lance_promoted: BitBoard,
black_pawn_promoted: BitBoard,
white_king: BitBoard,
white_rook: BitBoard,
white_bishop: BitBoard,
white_gold: BitBoard,
white_silver: BitBoard,
white_knight: BitBoard,
white_lance: BitBoard,
white_pawn: BitBoard,
white_rook_promoted: BitBoard,
white_bishop_promoted: BitBoard,
white_silver_promoted: BitBoard,
white_knight_promoted: BitBoard,
white_lance_promoted: BitBoard,
white_pawn_promoted: BitBoard,

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
pub fn getPieceAt(board: Board, position: BitBoard) Game.Square {
    if (board.black_king.isJoint(position)) {
        return .black_king;
    } else if (board.black_rook.isJoint(position)) {
        return .black_rook;
    } else if (board.black_bishop.isJoint(position)) {
        return .black_bishop;
    } else if (board.black_gold.isJoint(position)) {
        return .black_gold;
    } else if (board.black_silver.isJoint(position)) {
        return .black_silver;
    } else if (board.black_knight.isJoint(position)) {
        return .black_knight;
    } else if (board.black_lance.isJoint(position)) {
        return .black_lance;
    } else if (board.black_pawn.isJoint(position)) {
        return .black_pawn;
    } else if (board.black_rook_promoted.isJoint(position)) {
        return .black_rook_promoted;
    } else if (board.black_bishop_promoted.isJoint(position)) {
        return .black_bishop_promoted;
    } else if (board.black_silver_promoted.isJoint(position)) {
        return .black_silver_promoted;
    } else if (board.black_knight_promoted.isJoint(position)) {
        return .black_knight_promoted;
    } else if (board.black_lance_promoted.isJoint(position)) {
        return .black_lance_promoted;
    } else if (board.black_pawn_promoted.isJoint(position)) {
        return .black_pawn_promoted;
    } else if (board.white_king.isJoint(position)) {
        return .white_king;
    } else if (board.white_rook.isJoint(position)) {
        return .white_rook;
    } else if (board.white_bishop.isJoint(position)) {
        return .white_bishop;
    } else if (board.white_gold.isJoint(position)) {
        return .white_gold;
    } else if (board.white_silver.isJoint(position)) {
        return .white_silver;
    } else if (board.white_knight.isJoint(position)) {
        return .white_knight;
    } else if (board.white_lance.isJoint(position)) {
        return .white_lance;
    } else if (board.white_pawn.isJoint(position)) {
        return .white_pawn;
    } else if (board.white_rook_promoted.isJoint(position)) {
        return .white_rook_promoted;
    } else if (board.white_bishop_promoted.isJoint(position)) {
        return .white_bishop_promoted;
    } else if (board.white_silver_promoted.isJoint(position)) {
        return .white_silver_promoted;
    } else if (board.white_knight_promoted.isJoint(position)) {
        return .white_knight_promoted;
    } else if (board.white_lance_promoted.isJoint(position)) {
        return .white_lance_promoted;
    } else if (board.white_pawn_promoted.isJoint(position)) {
        return .white_pawn_promoted;
    } else {
        return .empty;
    }
}

/// 駒を移動したボードを作成する
pub fn movedBoard(board: Board, from: BitBoard, to: BitBoard) Board {
    var new_board = board;

    const piece_board: *BitBoard =
        if (new_board.black_king.isJoint(from))
        &new_board.black_king
    else if (new_board.black_rook.isJoint(from))
        &new_board.black_rook
    else if (new_board.black_bishop.isJoint(from))
        &new_board.black_bishop
    else if (new_board.black_gold.isJoint(from))
        &new_board.black_gold
    else if (new_board.black_silver.isJoint(from))
        &new_board.black_silver
    else if (new_board.black_knight.isJoint(from))
        &new_board.black_knight
    else if (new_board.black_lance.isJoint(from))
        &new_board.black_lance
    else if (new_board.black_pawn.isJoint(from))
        &new_board.black_pawn
    else if (new_board.black_rook_promoted.isJoint(from))
        &new_board.black_rook_promoted
    else if (new_board.black_bishop_promoted.isJoint(from))
        &new_board.black_bishop_promoted
    else if (new_board.black_silver_promoted.isJoint(from))
        &new_board.black_silver_promoted
    else if (new_board.black_knight_promoted.isJoint(from))
        &new_board.black_knight_promoted
    else if (new_board.black_lance_promoted.isJoint(from))
        &new_board.black_lance_promoted
    else if (new_board.black_pawn_promoted.isJoint(from))
        &new_board.black_pawn_promoted
    else if (new_board.white_king.isJoint(from))
        &new_board.white_king
    else if (new_board.white_rook.isJoint(from))
        &new_board.white_rook
    else if (new_board.white_bishop.isJoint(from))
        &new_board.white_bishop
    else if (new_board.white_gold.isJoint(from))
        &new_board.white_gold
    else if (new_board.white_silver.isJoint(from))
        &new_board.white_silver
    else if (new_board.white_knight.isJoint(from))
        &new_board.white_knight
    else if (new_board.white_lance.isJoint(from))
        &new_board.white_lance
    else if (new_board.white_pawn.isJoint(from))
        &new_board.white_pawn
    else if (new_board.white_rook_promoted.isJoint(from))
        &new_board.white_rook_promoted
    else if (new_board.white_bishop_promoted.isJoint(from))
        &new_board.white_bishop_promoted
    else if (new_board.white_silver_promoted.isJoint(from))
        &new_board.white_silver_promoted
    else if (new_board.white_knight_promoted.isJoint(from))
        &new_board.white_knight_promoted
    else if (new_board.white_lance_promoted.isJoint(from))
        &new_board.white_lance_promoted
    else if (new_board.white_pawn_promoted.isJoint(from))
        &new_board.white_pawn_promoted
    else
        return new_board;

    const to_inversed = to.inversed();

    new_board.black_king.setMask(to_inversed);
    new_board.black_rook.setMask(to_inversed);
    new_board.black_bishop.setMask(to_inversed);
    new_board.black_gold.setMask(to_inversed);
    new_board.black_silver.setMask(to_inversed);
    new_board.black_knight.setMask(to_inversed);
    new_board.black_lance.setMask(to_inversed);
    new_board.black_pawn.setMask(to_inversed);
    new_board.black_rook_promoted.setMask(to_inversed);
    new_board.black_bishop_promoted.setMask(to_inversed);
    new_board.black_silver_promoted.setMask(to_inversed);
    new_board.black_knight_promoted.setMask(to_inversed);
    new_board.black_lance_promoted.setMask(to_inversed);
    new_board.black_pawn_promoted.setMask(to_inversed);
    new_board.white_king.setMask(to_inversed);
    new_board.white_rook.setMask(to_inversed);
    new_board.white_bishop.setMask(to_inversed);
    new_board.white_gold.setMask(to_inversed);
    new_board.white_silver.setMask(to_inversed);
    new_board.white_knight.setMask(to_inversed);
    new_board.white_lance.setMask(to_inversed);
    new_board.white_pawn.setMask(to_inversed);
    new_board.white_rook_promoted.setMask(to_inversed);
    new_board.white_bishop_promoted.setMask(to_inversed);
    new_board.white_silver_promoted.setMask(to_inversed);
    new_board.white_knight_promoted.setMask(to_inversed);
    new_board.white_lance_promoted.setMask(to_inversed);
    new_board.white_pawn_promoted.setMask(to_inversed);

    piece_board.setToggle(from.unions(to));

    return new_board;
}

pub fn promotedBoard(board: Board, position: BitBoard) Board {
    var new_board = board;

    if (new_board.black_rook.isJoint(position)) {
        new_board.black_rook.setMask(position.inversed());
        new_board.black_rook_promoted.setUnion(position);
    } else if (new_board.black_bishop.isJoint(position)) {
        new_board.black_bishop.setMask(position.inversed());
        new_board.black_bishop_promoted.setUnion(position);
    } else if (new_board.black_silver.isJoint(position)) {
        new_board.black_silver.setMask(position.inversed());
        new_board.black_silver_promoted.setUnion(position);
    } else if (new_board.black_knight.isJoint(position)) {
        new_board.black_knight.setMask(position.inversed());
        new_board.black_knight_promoted.setUnion(position);
    } else if (new_board.black_lance.isJoint(position)) {
        new_board.black_lance.setMask(position.inversed());
        new_board.black_lance_promoted.setUnion(position);
    } else if (new_board.black_pawn.isJoint(position)) {
        new_board.black_pawn.setMask(position.inversed());
        new_board.black_pawn_promoted.setUnion(position);
    } else if (new_board.white_rook.isJoint(position)) {
        new_board.white_rook.setMask(position.inversed());
        new_board.white_rook_promoted.setUnion(position);
    } else if (new_board.white_bishop.isJoint(position)) {
        new_board.white_bishop.setMask(position.inversed());
        new_board.white_bishop_promoted.setUnion(position);
    } else if (new_board.white_silver.isJoint(position)) {
        new_board.white_silver.setMask(position.inversed());
        new_board.white_silver_promoted.setUnion(position);
    } else if (new_board.white_knight.isJoint(position)) {
        new_board.white_knight.setMask(position.inversed());
        new_board.white_knight_promoted.setUnion(position);
    } else if (new_board.white_lance.isJoint(position)) {
        new_board.white_lance.setMask(position.inversed());
        new_board.white_lance_promoted.setUnion(position);
    } else if (new_board.white_pawn.isJoint(position)) {
        new_board.white_pawn.setMask(position.inversed());
        new_board.white_pawn_promoted.setUnion(position);
    }

    return new_board;
}

/// 駒を盤上に追加する
pub fn hitBoard(board: Board, color: Game.PlayerColor, piece: Game.PieceKind, to: BitBoard) Board {
    var new_board = board;

    switch (piece) {
        .king => switch (color) {
            .black => new_board.black_king.setUnion(to),
            .white => new_board.white_king.setUnion(to),
        },
        .rook => switch (color) {
            .black => new_board.black_rook.setUnion(to),
            .white => new_board.white_rook.setUnion(to),
        },
        .bishop => switch (color) {
            .black => new_board.black_bishop.setUnion(to),
            .white => new_board.white_bishop.setUnion(to),
        },
        .gold => switch (color) {
            .black => new_board.black_gold.setUnion(to),
            .white => new_board.white_gold.setUnion(to),
        },
        .silver => switch (color) {
            .black => new_board.black_silver.setUnion(to),
            .white => new_board.white_silver.setUnion(to),
        },
        .knight => switch (color) {
            .black => new_board.black_knight.setUnion(to),
            .white => new_board.white_knight.setUnion(to),
        },
        .lance => switch (color) {
            .black => new_board.black_lance.setUnion(to),
            .white => new_board.white_lance.setUnion(to),
        },
        .pawn => switch (color) {
            .black => new_board.black_pawn.setUnion(to),
            .white => new_board.white_pawn.setUnion(to),
        },
        else => {},
    }

    return new_board;
}

pub fn getColorPiecesArray(board: Board, color: Game.PlayerColor) [14]BitBoard {
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

pub fn getColorPieces(board: Board, color: Game.PlayerColor) BitBoard {
    return switch (color) {
        .black => board.black_king
            .unions(board.black_rook)
            .unions(board.black_bishop)
            .unions(board.black_gold)
            .unions(board.black_silver)
            .unions(board.black_knight)
            .unions(board.black_lance)
            .unions(board.black_pawn)
            .unions(board.black_rook_promoted)
            .unions(board.black_bishop_promoted)
            .unions(board.black_silver_promoted)
            .unions(board.black_knight_promoted)
            .unions(board.black_lance_promoted)
            .unions(board.black_pawn_promoted),
        .white => board.white_king
            .unions(board.white_rook)
            .unions(board.white_bishop)
            .unions(board.white_gold)
            .unions(board.white_silver)
            .unions(board.white_knight)
            .unions(board.white_lance)
            .unions(board.white_pawn)
            .unions(board.white_rook_promoted)
            .unions(board.white_bishop_promoted)
            .unions(board.white_silver_promoted)
            .unions(board.white_knight_promoted)
            .unions(board.white_lance_promoted)
            .unions(board.white_pawn_promoted),
    };
}

/// 駒を指定して、その駒の行ける範囲を得る
pub fn movePositions(board: Board, from: BitBoard) BitBoard {
    const piece_type = board.getPieceAt(from);

    const move_to = switch (piece_type) {
        .empty => return BitBoard.init(),
        .black_king => moves.king(board, from, .black),
        .black_rook => moves.rook(board, from, .black),
        .black_bishop => moves.bishop(board, from, .black),
        .black_gold => moves.gold(board, from, .black),
        .black_silver => moves.silver(board, from, .black),
        .black_knight => moves.knight(board, from, .black),
        .black_lance => moves.lance(board, from, .black),
        .black_pawn => moves.pawn(board, from, .black),
        .black_rook_promoted => moves.promotedRook(board, from, .black),
        .black_bishop_promoted => moves.promotedBishop(board, from, .black),
        .black_silver_promoted => moves.gold(board, from, .black),
        .black_knight_promoted => moves.gold(board, from, .black),
        .black_lance_promoted => moves.gold(board, from, .black),
        .black_pawn_promoted => moves.gold(board, from, .black),
        .white_king => moves.king(board, from, .white),
        .white_rook => moves.rook(board, from, .white),
        .white_bishop => moves.bishop(board, from, .white),
        .white_gold => moves.gold(board, from, .white),
        .white_silver => moves.silver(board, from, .white),
        .white_knight => moves.knight(board, from, .white),
        .white_lance => moves.lance(board, from, .white),
        .white_pawn => moves.pawn(board, from, .white),
        .white_rook_promoted => moves.promotedRook(board, from, .white),
        .white_bishop_promoted => moves.promotedBishop(board, from, .white),
        .white_silver_promoted => moves.gold(board, from, .white),
        .white_knight_promoted => moves.gold(board, from, .white),
        .white_lance_promoted => moves.gold(board, from, .white),
        .white_pawn_promoted => moves.gold(board, from, .white),
    };

    const color = piece_type.color() orelse unreachable; // nullになるやつは前でリターンされている
    const filtered_move_to = board.filterMove(color, from, move_to);

    return filtered_move_to;
}

pub fn hitPositions(board: Board, color: Game.PlayerColor, piece: Game.PrimaryPiece) BitBoard {
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
pub fn getAllMoves(board: Board, color: Game.PlayerColor) BitBoard {
    switch (color) {
        .white => {
            var move_places = BitBoard.init();
            move_places.setUnion(moves.whitePawn(board, board.white_pawn));
            move_places.setUnion(moves.whiteLance(board, board.white_lance));
            move_places.setUnion(moves.whiteKnight(board, board.white_knight));
            move_places.setUnion(moves.whiteSilver(board, board.white_silver));
            move_places.setUnion(moves.whiteGold(board, board.white_gold));
            move_places.setUnion(moves.bishop(board, board.white_bishop, .white));
            move_places.setUnion(moves.rook(board, board.white_rook, .white));
            move_places.setUnion(moves.king(board, board.white_king, .white));

            move_places.setUnion(moves.whiteGold(board, board.white_pawn_promoted));
            move_places.setUnion(moves.whiteGold(board, board.white_lance_promoted));
            move_places.setUnion(moves.whiteGold(board, board.white_knight_promoted));
            move_places.setUnion(moves.whiteGold(board, board.white_silver_promoted));

            move_places.setUnion(moves.promotedRook(board, board.white_rook_promoted, .white));
            move_places.setUnion(moves.promotedBishop(board, board.white_bishop_promoted, .white));

            return move_places;
        },
        .black => {
            var move_places = BitBoard.init();
            move_places.setUnion(moves.blackPawn(board, board.black_pawn));
            move_places.setUnion(moves.blackLance(board, board.black_lance));
            move_places.setUnion(moves.blackKnight(board, board.black_knight));
            move_places.setUnion(moves.blackSilver(board, board.black_silver));
            move_places.setUnion(moves.blackGold(board, board.black_gold));
            move_places.setUnion(moves.bishop(board, board.black_bishop, .black));
            move_places.setUnion(moves.rook(board, board.black_rook, .black));
            move_places.setUnion(moves.king(board, board.black_king, .black));

            move_places.setUnion(moves.blackGold(board, board.black_pawn_promoted));
            move_places.setUnion(moves.blackGold(board, board.black_lance_promoted));
            move_places.setUnion(moves.blackGold(board, board.black_knight_promoted));
            move_places.setUnion(moves.blackGold(board, board.black_silver_promoted));

            move_places.setUnion(moves.promotedRook(board, board.black_rook_promoted, .black));
            move_places.setUnion(moves.promotedBishop(board, board.black_bishop_promoted, .black));

            return move_places;
        },
    }
}

/// セルフ王手を除く
pub fn filterMove(board: Board, color: Game.PlayerColor, from: BitBoard, to: BitBoard) BitBoard {
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
pub fn isAttacked(board: Board, place: BitBoard, color: Game.PlayerColor) bool {
    return place.isJoint(board.getAllMoves(color.turn()));
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
    const is_promotionable_piece = switch (piece_type.piece() orelse return false) {
        .rook, .bishop, .silver, .knight, .lance, .pawn => true,
        else => false,
    };

    if (!is_promotionable_piece) {
        return false;
    }

    return switch (piece_type.color() orelse return false) {
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
