//! ビットボード

// std import
const std = @import("std");
const builtin = @import("builtin");
const assert = std.debug.assert;

// common import
const common = @import("./main.zig");
const types = common.types;

// test import
test {
    _ = @import("./bit-board.test.zig");
}

pub fn BitBoard(comptime height_arg: u16, comptime width_arg: u16) type {
    return struct {
        // # 必要な関数
        //
        // - [ ] union, intersection, xor
        // - [ ] setUnion, setIntersection, setXor,
        // - [ ] inverse,
        // - [ ] fromInteger, toInteger,
        // - [ ] fromString, toString,
        // - [ ] shiftLeft, shiftRight,
        // - [ ] iterator

        /// ビットボードを表す型。
        const Self = @This();

        pub const height = height_arg;
        pub const width = width_arg;
        pub const size = height * width;

        const string_size = size + height - 1;
        const bit_length = std.math.log2_int_ceil(u16, size);

        /// ビットボードの型。
        /// [高さ] × [幅]ビット。
        // pub const Board = std.bit_set.IntegerBitSet(size);
        // pub const Board = std.bit_set.ArrayBitSet(usize, size);
        pub const Board: type = std.bit_set.StaticBitSet(size);

        /// 高さの型。
        /// 0から[高さ] - 1が全て表現できる最小の整数型。
        pub const Height: type = std.meta.Int(.unsigned, std.math.log2_int_ceil(u16, height));

        /// 幅の型。
        /// 0から[幅] - 1が全て表現できる最小の整数型。
        pub const Width: type = std.meta.Int(.unsigned, std.math.log2_int_ceil(u16, width));

        /// ビットボードのビット長さの型。
        /// 0から[高さ] × [幅] - 1が全て表現できる最小の整数型。
        pub const Index: type = std.meta.Int(.unsigned, bit_length);

        const UCharLength: type = std.meta.Int(.unsigned, std.math.log2_int_ceil(u16, string_size + 1));

        /// ビットボードの値
        board: Board,

        /// 空のボードを作成する。
        pub fn init() Self {
            return .{ .board = Board.initEmpty() };
        }

        /// 座標をインデックスに変換する関数
        /// 座標は(x, y)の組。
        /// 左下が(0, 0)、右にいくとx、上にいくとyが大きくなる。
        fn coordinateToIndex(x: Width, y: Height) Index {
            return x + (@as(Index, height) - y - 1) * @as(Index, width);
        }

        /// 指定した座標のビット1つのみがオンのビットボードを作成する。
        pub fn fromCoordinate(x: Width, y: Height) Self {
            return fromIndex(coordinateToIndex(x, y));
        }

        // 文字列を使う関数。

        /// 番号からボードを作成する。
        pub fn fromIndex(index: usize) Self {
            var board = Board.initEmpty();
            board.set(index);
            return .{ .board = board };
        }

        /// ビットの整数表現から変換する。
        pub fn fromInteger(int: std.meta.Int(.unsigned, size)) Self {
            if (Board == std.bit_set.IntegerBitSet(size)) {
                return .{ .board = .{ .mask = int } };
            } else if (Board == std.bit_set.ArrayBitSet(usize, size)) {
                const usize_bits = @bitSizeOf(usize);
                const num_masks = (size + usize_bits - 1) / usize_bits;
                const masks_type = [num_masks]usize;
                const int_masks: masks_type = @bitCast(@as(std.meta.Int(.unsigned, @bitSizeOf(masks_type)), int));
                return .{ .board = .{ .masks = int_masks } };
            } else {
                @compileError("board is static bitset");
            }
        }

        /// ビットボードの文字列からビットボードを作成する。
        /// [幅]文字の後'\n'を[高さ]回繰り返す。
        /// 最後には'\n'をつけない。
        /// 第二引数で石を示す文字を指定する。
        ///
        /// 範囲外のものが1つでもあると0を返す
        pub fn fromString(str: []const u8, piece_symbol: u8) Self {
            assert(str.len == string_size);

            var board: Board = Board.initEmpty();
            var char_count: UCharLength = 0;
            var bit_count: Index = 0;

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

                assert(str[char_count] == '\n');
                char_count += 1;
            }

            return .{ .board = board };
        }

        pub fn eql(self: Self, other: Self) bool {
            return self.board.eql(other.board);
        }

        /// ボードが空かどうか判定する。
        /// `self == 0`
        pub fn isEmpty(self: Self) bool {
            return self.board.eql(Board.initEmpty());
        }

        /// 2つのボードが重なりを持たないかどうか判定する。
        /// `self & mask != 0`
        pub fn isJoint(self: Self, mask: Self) bool {
            return !self.isDisjoint(mask);
        }

        /// 2つのボードが重なりを持たないかどうか判定する。
        /// `self & mask == 0`
        pub fn isDisjoint(self: Self, mask: Self) bool {
            return self.masks(mask).isEmpty();
        }

        /// ボードを整数に変換する
        pub fn toInteger(self: Self) std.meta.Int(.unsigned, size) {
            switch (Board) {
                std.bit_set.IntegerBitSet(size) => {
                    return self.board.mask;
                },
                std.bit_set.ArrayBitSet(usize, size) => {
                    const mask = self.board.masks;
                    const masks_int: std.meta.Int(.unsigned, @bitSizeOf(@TypeOf(mask))) = @bitCast(mask);
                    return @intCast(masks_int);
                },
                else => {
                    @compileError("board is static bitset");
                },
            }
        }

        pub fn toIndexInteger(self: Self) Index {
            const int = self.toInteger();

            return @intCast(@ctz(int));
        }

        pub fn toCoordinate(self: Self) struct { Width, Height } {
            const int = self.toIndexInteger();

            const x: Width = @intCast(int % @as(Index, width));
            const y: Height = @intCast(@as(Index, height) - @divTrunc(int, @as(Index, width)) - 1);

            return .{ x, y };
        }

        /// ビットボードを文字列に変換する。
        pub fn toString(self: Self, piece_symbol: u8, empty_symbol: u8) [string_size]u8 {
            var str: [string_size]u8 = .{empty_symbol} ** string_size;

            var char_count: UCharLength = 0;
            var bit_count: Index = 0;
            for (0..height) |l| {
                for (0..width) |_| {
                    if (self.board.isSet(bit_count)) {
                        str[char_count] = piece_symbol;
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

        ///  ビットのあるマスを数える。
        pub fn count(self: Self) usize {
            return self.board.count();
        }

        pub inline fn iterator(self: Self) Board.Iterator(.{}) {
            return self.board.iterator(.{});
        }

        /// board << length
        pub fn shl(self: Self, length: usize) Self {
            assert(length <= size);

            const mask_int = self.toInteger();
            const shifted_mask = mask_int << @intCast(length);
            return fromInteger(shifted_mask);
        }

        /// board >> length
        pub fn shr(self: Self, length: usize) Self {
            assert(length <= size);

            const mask_int = self.toInteger();
            const shifted_mask = mask_int >> @intCast(length);
            return fromInteger(shifted_mask);
        }

        /// selfにotherのビットを足し合わせる。
        /// `self |= other;`
        pub fn setUnion(self: *Self, other: Self) void {
            self.board.setUnion(other.board);
        }

        /// selfにotherのビットを足し合わせたビットボードを返す。
        /// `self | other;`
        pub fn unions(self: Self, other: Self) Self {
            return .{
                .board = self.board.unionWith(other.board),
            };
        }

        /// selfにotherのビットをマスクする。
        /// `self &= other;`
        pub fn setMask(self: *Self, other: Self) void {
            self.board.setIntersection(other.board);
        }

        /// selfにotherのビットをマスクしたビットボードを返す。
        /// `self & other;`
        pub fn masks(self: Self, other: Self) Self {
            return .{
                .board = self.board.intersectWith(other.board),
            };
        }

        /// selfにotherのビットを反転する。
        /// `self ^= other;`
        pub fn setToggle(self: *Self, other: Self) void {
            self.board.toggleSet(other.board);
        }

        /// selfにotherのビットを反転したビットボードを返す。
        /// `self ^ other;`
        pub fn toggled(self: Self, other: Self) Self {
            return .{
                .board = self.board.xorWith(other.board),
            };
        }

        /// selfのindex番目のビットを反転する。
        /// `self ^= 1 << index;`
        pub fn setToggleIndex(self: *Self, index: usize) void {
            self.board.set(index);
        }

        /// すべてのビットを反転する。
        /// `self = ~self;`
        pub fn setInverse(self: *Self) void {
            self.board.toggleAll();
        }

        /// すべてのビットをマスクしたビットボードを返す。
        /// `~self;`
        pub fn inversed(self: Self) Self {
            return .{
                .board = self.board.complement(),
            };
        }

        /// selfからotherのビットを除外したビットボードを返す。
        /// `self & ~other;`
        pub fn excludes(self: Self, other: Self) Self {
            return .{
                .board = self.board.differenceWith(other.board),
            };
        }

        pub const Direction = enum { n, s, e, w, nw, ne, sw, se };
        pub fn move(self: Self, direction: Direction) Self {
            const length: Index = switch (direction) {
                .n, .s => width,
                .e, .w => 1,
                .ne, .sw => width - 1,
                .nw, .se => width + 1,
            };

            switch (direction) {
                .n, .w, .ne, .nw => return self.shr(length),
                .s, .e, .se, .sw => return self.shl(length),
            }
        }

        pub fn moveMultiple(self: Self, directions: []const Direction) Self {
            var result = init();

            for (directions) |direction| {
                result.setUnion(self.move(direction));
            }

            return result;
        }

        pub fn expect(self: Self, expected: []const u8) error{TestExpectedEqual}!void {
            const expected_board = fromString(expected, 'o');

            if (self.eql(expected_board)) {
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
                self.toString('o', '.'),
            });

            return error.TestExpectedEqual;
        }

        pub fn expectJoint(self: Self, expected: []const u8) error{TestExpectedEqual}!void {
            const expected_board = fromString(expected, 'o');

            if (self.isJoint(expected_board)) {
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
                self.toString('o', '.'),
            });

            return error.TestExpectedEqual;
        }
    };
}
