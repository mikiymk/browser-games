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
        // pub const Board = std.bit_set.IntegerBitSet(size);
        pub const Board = std.bit_set.ArrayBitSet(usize, size);
        // pub const Board = std.bit_set.StaticBitSet(size);

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
            var board: Board = Board.initEmpty();

            if (str.len != size + height - 1) {
                // invalid length
                return Board.initEmpty();
            }

            var char_count: UCharLength = 0;
            var bit_count: UBitLength = 0;
            for (0..height) |n| {
                for (0..width) |_| {
                    const char = str[char_count];

                    if (char == piece_symbol) {
                        board.set(bit_count);
                    }

                    char_count += 1;
                    bit_count +|= 1;
                }

                if (n == height - 1) {
                    break;
                }

                if (str[char_count] != '\n') {
                    // invalid character
                    return Board.initEmpty();
                }

                char_count += 1;
            }

            return board;
        }

        /// 番号からボードを作成する。
        pub fn fromIndex(index: usize) Board {
            var board = Board.initEmpty();
            board.set(index);
            return board;
        }

        /// ボードが空かどうか判定する。
        pub fn isEmpty(board: Board) bool {
            return board.eql(Board.initEmpty());
        }

        /// ボードを整数に変換する
        pub fn toInteger(board: Board) types.UInt(size) {
            if (Board == std.bit_set.IntegerBitSet(size)) {
                return board.mask;
            } else if (Board == std.bit_set.ArrayBitSet(usize, size)) {
                const masks = board.masks;
                const masks_int: types.UInt(@bitSizeOf(@TypeOf(masks))) = @bitCast(masks);
                return @intCast(masks_int);
            } else {
                @compileError("board is static bitset");
            }
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

        pub fn iterator(board: Board) void {
            _ = board;
        }

        /// board << length
        fn shl(board: Board, length: usize) Board {
            if (Board == std.bit_set.IntegerBitSet(size)) {
                return Board{ .mask = board.mask << length };
            } else if (Board == std.bit_set.ArrayBitSet(usize, size)) {
                const ubit = @bitSizeOf(usize);
                const shift_usize = length / ubit;
                const shift_bit = length % ubit;
                _ = shift_bit;
                const num_masks = @bitSizeOf(@TypeOf(board.masks)) / @bitSizeOf(usize);

                // ff    00
                // ff -> ff
                // 00    ff

                // TODO

                var new_mask = board.masks;
                @memcpy(new_mask[shift_usize..num_masks], board.masks[0 .. num_masks - shift_usize]);

                return Board{ .masks = new_mask };
            } else {
                @compileError("board is static bitset");
            }
        }

        /// board >> length
        fn shr(board: Board, length: usize) Board {
            if (Board == std.bit_set.IntegerBitSet(size)) {
                return Board{ .mask = board.mask >> length };
            } else if (Board == std.bit_set.ArrayBitSet(usize, size)) {
                const masks = board.masks;
                const masks_int: types.UInt(masks.len * @bitSizeOf(@TypeOf(masks))) = @bitCast(masks);
                _ = masks_int;

                // TODO

                return Board{ .masks = .{0} };
            } else {
                @compileError("board is static bitset");
            }
        }

        pub const Direction = enum { n, s, e, w, nw, ne, sw, se, ns, ew, nesw, nwse };
        pub fn move(board: Board, direction: Direction) Board {
            const length: UBitLength = switch (direction) {
                .n, .s, .ns => width,
                .e, .w, .ew => 1,
                .ne, .sw, .nesw => width - 1,
                .nw, .se, .nwse => width + 1,
            };

            switch (direction) {
                .n, .w, .ne, .nw => {
                    return shr(board, length);
                },
                .s, .e, .se, .sw => {
                    return shl(board, length);
                },
                .ns, .ew, .nesw, .nwse => {
                    return shl(board, length).intersectWith(shr(board, length));
                },
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
