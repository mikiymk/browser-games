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
    const UBoard: type = types.UInt(size);
    const UHeight: type = types.UInt(std.math.log2_int_ceil(u16, height + 1));
    const UWidth: type = types.UInt(std.math.log2_int_ceil(u16, width + 1));
    const UBitLength: type = types.UInt(std.math.log2_int_ceil(u16, size));
    const UCharLength: type = types.UInt(std.math.log2_int_ceil(u16, string_size + 1));

    return struct {
        field: UBoard,

        const Self = @This();

        pub const empty: Self = .{ .field = 0 };

        /// ビットボードの文字列からビットボードを作成する。
        /// 第二引数で石を示す文字を指定する。
        ///
        /// 範囲外のものが1つでもあると0を返す
        pub fn fromString(str: []const u8, piece_symbol: u8) Self {
            var field: UBoard = 0;

            if (str.len != size + height - 1) {
                // invalid length
                return empty;
            }

            var char_count: UCharLength = 0;
            var bit_count: UBitLength = 0;
            for (0..height) |n| {
                for (0..width) |_| {
                    const char = str[char_count];

                    if (char == piece_symbol) {
                        field |= @as(UBoard, 1) << bit_count;
                    }

                    char_count += 1;
                    bit_count +|= 1;
                }

                if (n == height - 1) {
                    break;
                }

                if (str[char_count] != '\n') {
                    // invalid character
                    return empty;
                }

                char_count += 1;
            }

            return .{ .field = field };
        }

        /// 座標のビットをオンにする。
        /// 左下が(0, 0)、右にいくとx、上にいくとyが大きくなる。
        ///
        /// - coord: (x, y)
        ///
        /// 範囲外のものが1つでもあると0を返す
        pub fn setCoordinate(board: Self, x: UWidth, y: UHeight) Self {
            var field: UBoard = board.field;

            const index: UBitLength = x + (@as(UBitLength, height) - y - 1) * @as(UBitLength, width);
            field |= @as(UBoard, 1) << index;

            return .{ .field = field };
        }

        pub fn toString(board: Self, piece_symbol: u8, empty_symbol: u8) [string_size]u8 {
            var str: [string_size]u8 = .{0} ** string_size;

            var char_count: UCharLength = 0;
            var bit_count: UBitLength = 0;
            for (0..height) |l| {
                for (0..width) |_| {
                    if (board.field & @as(UBoard, 1) << bit_count != 0) {
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

        pub const Iterator = struct {
            board: UBoard,

            pub fn next(self: *Iterator) ?Self {
                if (self.board == 0) {
                    return null;
                }

                // 一番下の立っているビットを１つ取り出す
                const current = self.board & (~self.board + 1);

                // 一番下のビットを落とす
                self.board &= self.board - 1;

                return .{ .field = current };
            }
        };

        pub fn iterator(board: Self) Iterator {
            return .{ .board = board.field };
        }

        pub fn expect(board: Self, comptime expected: []const u8) error{TestExpectedEqual}!void {
            const expected_board = fromString(expected, 'o');

            if (board.field == expected_board.field) {
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
                expected_board.toString('o', '.'),
                board.toString('o', '.'),
            });

            return error.TestExpectedEqual;
        }
    };
}
