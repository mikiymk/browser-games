// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");
const types = common.types;

// test import
test {
    _ = @import("./bit-board.test.zig");
}

pub fn BitBoard(comptime height: u16, comptime width: u16) type {
    const size = height * width;
    const string_size = size + height - 1;
    const bit_length = std.math.log2_int_ceil(u16, size);

    return struct {
        /// ビットボードの型。
        /// [高さ] × [幅]ビット。
        pub const Board = std.bit_set.StaticBitSet(size);

        /// 高さの型。
        /// 0から[高さ] - 1が全て表現できる最小の整数型。
        pub const UHeight: type = types.UInt(std.math.log2_int_ceil(u16, height));

        /// 幅の型。
        /// 0から[幅] - 1が全て表現できる最小の整数型。
        pub const UWidth: type = types.UInt(std.math.log2_int_ceil(u16, width));

        /// ビットボードのビット長さの型。
        /// 0から[高さ] × [幅] - 1が全て表現できる最小の整数型。
        pub const UBitLength: type = types.UInt(bit_length);

        // 座標を使う関数
        // 座標は(x, y)の組。
        // 左下が(0, 0)、右にいくとx、上にいくとyが大きくなる。

        /// 指定した座標のビット1つのみがオンのビットボードを作成する。
        pub fn fromCoordinate(x: UWidth, y: UHeight) Board {
            const index: UBitLength = x + (@as(UBitLength, height) - y - 1) * @as(UBitLength, width);
            return @as(Board, 1) << index;
        }

        /// 指定した座標のビットをオンにしたビットボードを作成する。
        pub fn setOnCoordinate(board: Board, x: UWidth, y: UHeight) Board {
            return board | fromCoordinate(x, y);
        }

        /// 指定した座標のビットがオンになっているかどうか。
        pub fn getOnCoordinate(board: Board, x: UWidth, y: UHeight) bool {
            return board & fromCoordinate(x, y) == 0;
        }

        // 文字列を使う関数。

        const UCharLength: type = types.UInt(std.math.log2_int_ceil(u16, string_size + 1));

        /// ビットボードの文字列からビットボードを作成する。
        /// [幅]文字の後'\n'を[高さ]回繰り返す。
        /// 最後には'\n'をつけない。
        /// 第二引数で石を示す文字を指定する。
        ///
        /// 範囲外のものが1つでもあると0を返す
        pub fn fromString(str: []const u8, piece_symbol: u8) Board {
            var board: Board = 0;

            if (str.len != size + height - 1) {
                // invalid length
                return 0;
            }

            var char_count: UCharLength = 0;
            var bit_count: UBitLength = 0;
            for (0..height) |n| {
                for (0..width) |_| {
                    const char = str[char_count];

                    if (char == piece_symbol) {
                        board |= @as(Board, 1) << bit_count;
                    }

                    char_count += 1;
                    bit_count +|= 1;
                }

                if (n == height - 1) {
                    break;
                }

                if (str[char_count] != '\n') {
                    // invalid character
                    return 0;
                }

                char_count += 1;
            }

            return board;
        }

        /// ビットボードを文字列に変換する。
        pub fn toString(board: Board, piece_symbol: u8, empty_symbol: u8) [string_size]u8 {
            var str: [string_size]u8 = .{0} ** string_size;

            var char_count: UCharLength = 0;
            var bit_count: UBitLength = 0;
            for (0..height) |l| {
                for (0..width) |_| {
                    if (board & @as(Board, 1) << bit_count != 0) {
                        str[char_count] = piece_symbol;
                    } else {
                        str[char_count] = empty_symbol;
                    }

                    char_count += 1;
                    bit_count +|= 1;
                }

                if (l == height - 1) {
                    break;
                }

                str[char_count] = '\n';
                char_count += 1;
            }

            return str;
        }

        /// ビットボードのビットが立っている場所のみ繰り返す。
        pub const Iterator = struct {
            board: Board,

            pub fn next(self: *Iterator) ?Board {
                const IBoard = types.Int(size);

                if (self.board == 0) {
                    return null;
                }

                // 2の補数表現
                const minus_board = @as(Board, @bitCast(-%@as(IBoard, @bitCast(self.board))));

                // 一番下の立っているビットを１つ取り出す
                const current = self.board & minus_board;

                // 一番下のビットを落とす
                self.board &= self.board - 1;

                return current;
            }
        };

        pub fn iterator(board: Board) Iterator {
            return .{ .board = board };
        }

        pub const Direction = enum { n, s, e, w, nw, ne, sw, se };
        pub fn move(board: Board, direction: Direction) Board {
            const is_minus: bool = switch (direction) {
                .n, .w, .ne, .nw => true,
                .s, .e, .se, .sw => false,
            };

            const length: UBitLength = switch (direction) {
                .n => width,
                .s => width,
                .e => 1,
                .w => 1,
                .nw => width + 1,
                .ne => width - 1,
                .sw => width - 1,
                .se => width + 1,
            };

            if (is_minus) {
                return board >> length;
            } else {
                return board << length;
            }
        }

        pub fn expect(board: Board, comptime expected: []const u8) error{TestExpectedEqual}!void {
            const expected_board = fromString(expected, 'o');

            if (board == expected_board) {
                return;
            }

            std.debug.print(
                \\
                \\- expected --
                \\{s}
                \\
                \\- actual ----
                \\{s}
                \\
            , .{
                toString(expected_board, 'o', '.'),
                toString(board, 'o', '.'),
            });

            return error.TestExpectedEqual;
        }
    };
}
