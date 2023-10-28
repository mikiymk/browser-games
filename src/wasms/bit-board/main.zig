const BitBoard = @This();

bits: u64,

pub fn init(value: u64) BitBoard {
    return .{
        .bits = value,
    };
}
