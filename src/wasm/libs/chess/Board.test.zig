// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const moves = main.moves;

test "📖Board.initWithString: 文字列からボードを初期化する" {
    const board = Board.initWithString(
        \\RNBQKBNR
        \\PPPPPPPP
        \\........
        \\........
        \\........
        \\........
        \\pppppppp
        \\rnbqkbnr
    );

    try board.getBoard(.black, .pawn).expect(
        \\........
        \\oooooooo
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );

    try board.getBoard(.white, .rook).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o......o
    );
}

test "📖Board.filterValidMove: 有効な動きだけをフィルターする" {
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
    const board = Board.initWithString(board_str);
    const from = BitBoard.initWithString(board_str, 'r');
    const to = moves.rook(board, from, .white);

    const actual = board.filterValidMove(from, to);

    try actual.expect(
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

test "📖Board.canCastling: キャスリングができるか判定する" {
    const board = Board.initWithString(
        \\R...K..R
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\r...k..r
    );

    try std.testing.expect(board.canCastling(.black_king));
    try std.testing.expect(board.canCastling(.black_queen));
    try std.testing.expect(board.canCastling(.white_king));
    try std.testing.expect(board.canCastling(.white_queen));
}

test "📖Board.canCastling: キングが攻撃されている" {
    const board = Board.initWithString(
        \\....K..R
        \\........
        \\........
        \\........
        \\....r...
        \\........
        \\........
        \\........
    );

    try std.testing.expect(!board.canCastling(.black_king));
}

test "📖Board.canCastling: 駒が動いた" {
    var board = Board.initWithString(
        \\R...K...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....k..r
    );

    board = board.getMovedBoard(BitBoard.initWithCoordinate(4, 7), BitBoard.initWithCoordinate(4, 6));
    board = board.getMovedBoard(BitBoard.initWithCoordinate(7, 0), BitBoard.initWithCoordinate(7, 2));

    try std.testing.expect(!board.canCastling(.black_queen));
    try std.testing.expect(!board.canCastling(.white_king));
}

test "📖Board.canCastling: 他の駒が間にある" {
    const board = Board.initWithString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\rn..k...
    );

    try std.testing.expect(!board.canCastling(.white_queen));
}

test "📖Board.isChecked: チェックされている" {
    const board = Board.initWithString(
        \\........
        \\.....R..
        \\........
        \\.K......
        \\.....k..
        \\........
        \\.q......
        \\........
    );

    try std.testing.expect(board.isChecked(.black));
    try std.testing.expect(board.isChecked(.white));
}

test "📖Board.isChecked: チェックされていない" {
    const board = Board.initWithString(
        \\........
        \\......B.
        \\........
        \\...K....
        \\........
        \\........
        \\..q...k.
        \\........
    );

    try std.testing.expect(!board.isChecked(.black));
    try std.testing.expect(!board.isChecked(.white));
}

test "📖Board.canMove: 動けるかどうか" {
    {
        const board = Board.initWithString(
            \\....K...
            \\........
            \\..b..q..
            \\........
            \\........
            \\........
            \\........
            \\........
        );

        try std.testing.expect(!board.canMove(.black));
    }

    {
        const board = Board.initWithString(
            \\....K...
            \\.r......
            \\.....n..
            \\........
            \\........
            \\........
            \\........
            \\........
        );

        try std.testing.expect(board.canMove(.black));
    }
}

test "📖Board.getMove: 動ける場所を計算する" {
    const board = Board.initWithString(
        \\........
        \\........
        \\........
        \\........
        \\...r....
        \\........
        \\........
        \\........
    );

    try board.getMove(BitBoard.initWithCoordinate(3, 3)).expect(
        \\...o....
        \\...o....
        \\...o....
        \\...o....
        \\ooo.oooo
        \\...o....
        \\...o....
        \\...o....
    );
}

test "📖Board.getMove: キャスリング" {
    const board = Board.initWithString(
        \\R...K..R
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );

    try board.getMove(BitBoard.initWithCoordinate(4, 7)).expect(
        \\o..o.o.o
        \\...ooo..
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "📖Board.getMove: アンパッサン" {
    var board = Board.initWithString(
        \\........
        \\........
        \\........
        \\........
        \\...pPp..
        \\........
        \\........
        \\........
    );
    board.enpassant_target = BitBoard.initWithCoordinate(5, 2);

    try board.getMove(BitBoard.initWithCoordinate(4, 3)).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....oo..
        \\........
        \\........
    );
}

test "📖Board.isPromotion: プロモーションする動きか判定する" {
    const board = Board.initWithString(
        \\........
        \\.r..P...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );

    try std.testing.expect(board.isPromotion(BitBoard.initWithCoordinate(4, 6), BitBoard.initWithCoordinate(4, 7)));
    try std.testing.expect(!board.isPromotion(BitBoard.initWithCoordinate(1, 6), BitBoard.initWithCoordinate(1, 7)));
}

test "📖Board.getMovedBoard: 動く" {
    const board = Board.init();

    const actual = board.getMovedBoard(
        BitBoard.initWithCoordinate(4, 1),
        BitBoard.initWithCoordinate(4, 3),
    );

    try actual.getBoard(.white, .pawn).expect(
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\oooo.ooo
        \\........
    );

    try actual.getBoard(.white, .rook).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o......o
    );
}

test "📖Board.getMovedBoard: キャプチャ" {
    const board = Board.initWithString(
        \\........
        \\..PP....
        \\....p...
        \\........
        \\........
        \\........
        \\pppp.ppp
        \\rnbqkbnr
    );

    const actual = board.getMovedBoard(
        BitBoard.initWithCoordinate(4, 5),
        BitBoard.initWithCoordinate(3, 6),
    );

    try actual.getBoard(.white, .pawn).expect(
        \\........
        \\...o....
        \\........
        \\........
        \\........
        \\........
        \\oooo.ooo
        \\........
    );

    try actual.getBoard(.black, .pawn).expect(
        \\........
        \\..o.....
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "📖Board.getMovedBoard: キャスリング" {
    const board = Board.initWithString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\pppp.ppp
        \\r...k...
    );

    const actual = board.getMovedBoard(
        BitBoard.initWithCoordinate(4, 0),
        BitBoard.initWithCoordinate(0, 0),
    );

    try actual.getBoard(.white, .rook).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...o....
    );

    try actual.getBoard(.white, .king).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\..o.....
    );
}

test "📖Board.getMovedBoard: アンパッサン" {
    const board = Board.initWithString(
        \\........
        \\........
        \\........
        \\....pPP.
        \\........
        \\........
        \\pppp.ppp
        \\r...k...
    );

    const actual = board.getMovedBoard(
        BitBoard.initWithCoordinate(4, 4),
        BitBoard.initWithCoordinate(5, 5),
    );

    try actual.getBoard(.white, .pawn).expect(
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\........
        \\oooo.ooo
        \\........
    );

    try actual.getBoard(.black, .pawn).expect(
        \\........
        \\........
        \\........
        \\......o.
        \\........
        \\........
        \\........
        \\........
    );
}

test "📖Board.getMovedBoard: 駒が動くとキャスリングができなくなる" {
    var board = Board.initWithString(
        \\R...K..R
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\r...k..r
    );

    try std.testing.expect(board.castling_available.white_queen);
    try std.testing.expect(board.castling_available.white_king);

    board = board.getMovedBoard(BitBoard.initWithCoordinate(0, 0), BitBoard.initWithCoordinate(0, 3));

    try std.testing.expect(!board.castling_available.white_queen);
    try std.testing.expect(board.castling_available.white_king);

    board = board.getMovedBoard(BitBoard.initWithCoordinate(4, 0), BitBoard.initWithCoordinate(4, 3));

    try std.testing.expect(!board.castling_available.white_queen);
    try std.testing.expect(!board.castling_available.white_king);

    try std.testing.expect(board.castling_available.black_queen);
    try std.testing.expect(board.castling_available.black_king);

    board = board.getMovedBoard(BitBoard.initWithCoordinate(4, 7), BitBoard.initWithCoordinate(7, 7));

    try std.testing.expect(!board.castling_available.black_queen);
    try std.testing.expect(!board.castling_available.black_king);
}

test "📖Board.getMovedBoard: ポーンが2個進むとアンパッサン対象になる" {
    var board = Board.initWithString(
        \\........
        \\...P....
        \\........
        \\..p.....
        \\.....P..
        \\........
        \\....p...
        \\........
    );

    board = board.getMovedBoard(BitBoard.initWithCoordinate(4, 1), BitBoard.initWithCoordinate(4, 3));

    try std.testing.expectEqual(board.enpassant_target, BitBoard.initWithCoordinate(4, 2));

    board = board.getMovedBoard(BitBoard.initWithCoordinate(3, 6), BitBoard.initWithCoordinate(3, 4));

    try std.testing.expectEqual(board.enpassant_target, BitBoard.initWithCoordinate(3, 5));
}

test "📖Board.getPromotionBoard: ポーンがプロモーションする" {
    var board = Board.initWithString(
        \\....p...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....P...
    );

    board = board.getPromotionBoard(BitBoard.initWithCoordinate(4, 7), .knight);
    board = board.getPromotionBoard(BitBoard.initWithCoordinate(4, 0), .queen);

    try board.getBoard(.white, .pawn).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
    try board.getBoard(.white, .knight).expect(
        \\....o...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
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
    try board.getBoard(.black, .queen).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
    );
}
