const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nougut_and_cross = @import("main.zig");
const EnumFieldStruct = std.enums.EnumFieldStruct;

pub fn EnumBitBoard(height_arg: u16, width_arg: u16, ValueEnum: type, char_symbols: EnumFieldStruct(ValueEnum, u8, null)) type {
    return struct {
        pub const BitBoard = common.bit_board.BitBoard(height_arg, width_arg);
        const EnumArrayBitBoard = std.enums.EnumArray(ValueEnum, BitBoard);
        const char_symbols_array = std.enums.EnumArray(ValueEnum, u8).init(char_symbols);

        boards: EnumArrayBitBoard,

        pub fn init(comptime str: []const u8) @This() {
            var boards = EnumArrayBitBoard.initUndefined();
            var it = boards.iterator();
            while (it.next()) |field| {
                field.value.* = BitBoard.fromString(str, getChar(field.key));
            }

            return .{ .boards = boards };
        }

        fn getChar(key: ValueEnum) u8 {
            return char_symbols_array.get(key);
        }

        pub fn get(self: @This(), key: ValueEnum) BitBoard {
            return self.boards.get(key);
        }

        pub fn getPtr(self: *@This(), key: ValueEnum) *BitBoard {
            return self.boards.getPtr(key);
        }

        /// どの色の駒もない場所のボードを返す
        pub fn getEmpty(self: @This()) BitBoard {
            var board = BitBoard.init();
            var self_copy = self;
            var it = self_copy.boards.iterator();
            while (it.next()) |field| {
                board.setUnion(field.value.*);
            }
            return board.getInverted();
        }

        pub fn set(self: *@This(), key: ValueEnum, index: BitBoard.Index) void {
            self.boards.getPtr(key).set(index);
        }

        pub fn unset(self: *@This(), key: ValueEnum, index: BitBoard.Index) void {
            self.boards.getPtr(key).unset(index);
        }

        pub fn setExclusive(self: *@This(), key: ValueEnum, index: BitBoard.Index) void {
            var it = self.boards.iterator();
            while (it.next()) |field| {
                if (field.key == key) {
                    field.value.set(index);
                } else {
                    field.value.unset(index);
                }
            }
        }

        const string_size = BitBoard.size + BitBoard.height - 1;
        fn mergeString(left: [string_size]u8, right: [string_size]u8, empty_symbol: u8) [string_size]u8 {
            var str: [string_size]u8 = undefined;
            for (&str, left, right) |*s, l, r| {
                s.* = if (l != empty_symbol) l else r;
            }

            return str;
        }

        pub fn toString(self: @This()) [string_size]u8 {
            const empty_symbol: u8 = ' ';

            var str: [string_size]u8 = undefined;
            var self_copy = self;
            var it = self_copy.boards.iterator();
            while (it.next()) |field| {
                const field_str = field.value.toString(getChar(field.key), empty_symbol);
                str = mergeString(str, field_str, empty_symbol);
            }

            return str;
        }
    };
}
