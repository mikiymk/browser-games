//! ビットボード

// std import
const std = @import("std");
const builtin = @import("builtin");
const testing = std.testing;
const assert = std.debug.assert;

// common import
const common = @import("./main.zig");
const types = common.types;

test {
    _ = @import("./bit-board.test.zig");
}

pub fn BitBoard(comptime height_arg: u16, comptime width_arg: u16) type {
    return struct {
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

        /// ビットボードの座標を表す型。
        /// x: 幅、y: 高さ。
        pub const Coordinate = struct {
            x: Width,
            y: Height,

            /// 座標をインデックスに変換する関数
            /// 座標は(x, y)の組。
            /// 左下が(0, 0)、右にいくとx、上にいくとyが大きくなる。
            pub fn toIndex(x: Width, y: Height) Index {
                return x + (@as(Index, height) - y - 1) * @as(Index, width);
            }

            /// 座標をインデックスに変換する関数
            /// 座標は(x, y)の組。
            /// 左下が(0, 0)、右にいくとx、上にいくとyが大きくなる。
            pub fn fromIndex(index: Index) Coordinate {
                const x: Width = @intCast(index % @as(Index, width));
                const y: Height = @intCast(@as(Index, height) - @divTrunc(index, @as(Index, width)) - 1);

                return .{ .x = x, .y = y };
            }
        };

        const UCharLength: type = std.meta.Int(.unsigned, std.math.log2_int_ceil(u16, string_size + 1));

        /// ビットボードの値
        board: Board,

        /// 空のボードを作成する。
        pub fn init() Self {
            return .{ .board = Board.initEmpty() };
        }

        /// 指定した座標のビット1つのみがオンのビットボードを作成する。
        pub fn fromCoordinate(x: Width, y: Height) Self {
            return fromIndex(Coordinate.toIndex(x, y));
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

        /// 西(左側)だけが0のビットボード
        ///
        ///     011
        ///     011
        ///     011
        pub const west_mask = blk: {
            var board = init();

            for (0..height) |y| {
                board.set(Coordinate.toIndex(0, y));
            }

            break :blk board.getInverted();
        };

        /// 東(右側)だけが0のビットボード
        ///
        ///     110
        ///     110
        ///     110
        pub const east_mask = blk: {
            var board = init();

            for (0..height) |y| {
                board.setToggleCoordinate(width - 1, y);
            }

            break :blk board.getInverted();
        };

        /// 北(上側)だけが0のビットボード
        ///
        ///     000
        ///     111
        ///     111
        pub const north_mask = blk: {
            var board = init();

            for (0..width) |x| {
                board.setToggleCoordinate(x, height - 1);
            }

            break :blk board.getInverted();
        };

        /// 南(下側)だけが0のビットボード
        ///
        ///     111
        ///     111
        ///     000
        pub const south_mask = blk: {
            var board = init();

            for (0..width) |x| {
                board.setToggleCoordinate(x, 0);
            }

            break :blk board.getInverted();
        };

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

        ///  ビットのあるマスを数える。
        pub fn count(self: Self) usize {
            return self.board.count();
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

        /// ビットを1にする。
        pub fn set(self: *Self, index: Index) void {
            self.board.set(index);
        }

        /// ビットを0にする。
        pub fn unset(self: *Self, index: Index) void {
            self.board.unset(index);
        }

        /// selfにotherのビットを足し合わせる。
        /// `self |= other;`
        pub fn setUnion(self: *Self, other: Self) void {
            self.board.setUnion(other.board);
        }

        /// selfにotherのビットを足し合わせたビットボードを返す。
        /// `self | other;`
        pub fn unions(self: Self, other: Self) Self { // unionは予約語
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

        /// selfの(x,y)のビットを反転する。
        pub fn setToggleCoordinate(self: *Self, x: Width, y: Height) void {
            self.setToggleIndex(Coordinate.toIndex(x, y));
        }

        /// すべてのビットを反転する。
        /// `self = ~self;`
        pub fn invert(self: *Self) void {
            self.board.toggleAll();
        }

        /// すべてのビットをマスクしたビットボードを返す。
        /// `~self;`
        pub fn getInverted(self: Self) Self {
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

        /// 8方向
        pub const Direction = enum { n, s, e, w, nw, ne, sw, se };

        /// 方向に対応する移動距離を計算する。
        fn moveLength(direction: Direction) Index {
            return switch (direction) {
                .n, .s => width,
                .e, .w => 1,
                .ne, .sw => width - 1,
                .nw, .se => width + 1,
            };
        }

        /// ボードの全てのビットを移動する。
        pub fn move(self: Self, direction: Direction) Self {
            const length = moveLength(direction);

            switch (direction) {
                .n, .w, .ne, .nw => return self.shr(length),
                .s, .e, .se, .sw => return self.shl(length),
            }
        }

        /// ボードの全てのビットを移動する。
        /// 右端→左端、左端→右端の移動を制御する。
        pub fn moveMasked(self: Self, direction: Direction) Self {
            const length = moveLength(direction);

            switch (direction) {
                .n => return self.shr(length),
                .w, .nw => return self.masks(west_mask).shr(length),
                .ne => return self.masks(east_mask).shr(length),
                .s => return self.shl(length),
                .e, .se => return self.masks(east_mask).shl(length),
                .sw => return self.masks(west_mask).shl(length),
            }
        }

        /// ボードの全てのビットを複数の方向に移動する。
        pub fn moveMultiple(self: Self, directions: []const Direction) Self {
            var result = init();

            for (directions) |direction| {
                result.setUnion(self.move(direction));
            }

            return result;
        }

        /// ボードの全てのビットを複数の方向に移動する。
        /// 右端→左端、左端→右端の移動を制御する。
        pub fn moveMaskedMultiple(self: Self, directions: []const Direction) Self {
            var result = init();

            for (directions) |direction| {
                result.setUnion(self.moveMasked(direction));
            }

            return result;
        }

        /// next()の返り値はビットのインデックス。
        /// `BitBoard.fromIndex`で復元できる。
        pub inline fn iterator(self: Self) Board.Iterator(.{}) {
            return self.board.iterator(.{});
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

        pub fn toCoordinate(self: Self) Coordinate {
            const index = self.toIndexInteger();
            return Coordinate.fromIndex(index);
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

        pub fn format(value: @This(), comptime fmt: []const u8, options: std.fmt.FormatOptions, writer: anytype) !void {
            _ = fmt;
            _ = options;

            return writer.print("{s}", .{value.toString('o', '.')});
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
