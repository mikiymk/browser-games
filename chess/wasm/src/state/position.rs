use std::fmt::{Debug, Display};

/// ```text
///   y |  0  1  2  3  4  5  6  7
/// x   |  a  b  c  d  e  f  g  h
/// - - +  -  -  -  -  -  -  -  -
/// 0 8 | a8 b8 c8 d8 e8 f8 g8 h8
/// 1 7 | a7 b7 c7 d7 e7 f7 g7 h7
/// 2 6 | a6 b6 c6 d6 e6 f6 g6 h6
/// 3 5 | a5 b5 c5 d5 e5 f5 g5 h5
/// 4 4 | a4 b4 c4 d4 e4 f4 g4 h4
/// 5 3 | a3 b3 c3 d3 e3 f3 g3 h3
/// 6 2 | a2 b2 c2 d2 e2 f2 g2 h2
/// 7 1 | a1 b1 c1 d1 e1 f1 g1 h1
/// ```
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Position(usize);

impl Position {
    /// Black Rook Queen side (a8 = 0, 0)
    pub const B_RQ: Position = Position::new(0, 0);
    pub const B_NQ: Position = Position::new(0, 1);
    pub const B_BQ: Position = Position::new(0, 2);
    pub const B_Q: Position = Position::new(0, 3);
    pub const B_K: Position = Position::new(0, 4);
    pub const B_BK: Position = Position::new(0, 5);
    pub const B_NK: Position = Position::new(0, 6);
    pub const B_RK: Position = Position::new(0, 7);
    pub const W_RQ: Position = Position::new(7, 0);
    pub const W_NQ: Position = Position::new(7, 1);
    pub const W_BQ: Position = Position::new(7, 2);
    pub const W_Q: Position = Position::new(7, 3);
    pub const W_K: Position = Position::new(7, 4);
    pub const W_BK: Position = Position::new(7, 5);
    pub const W_NK: Position = Position::new(7, 6);
    pub const W_RK: Position = Position::new(7, 7);

    pub const fn new_from_position(pos: usize) -> Position {
        Position(pos)
    }

    pub const fn new(x: u8, y: u8) -> Position {
        Position::new_from_position(Self::to_position_index(x, y))
    }

    pub fn try_new(x: u8, y: u8) -> Option<Position> {
        if 7 < x || 7 < y {
            None
        } else {
            Some(Position::new(x, y))
        }
    }

    pub fn try_from_u8(value: u8) -> Option<Self> {
        let x = value / 8;
        let y = value % 8;
        Position::try_new(x, y)
    }

    const fn to_position_index(x: u8, y: u8) -> usize {
        (x as usize) * 8 + (y as usize)
    }

    pub fn rel_new(&self, x: i8, y: i8) -> Option<Position> {
        // (x1 + x2) * 8 + (y1 + y2)
        // = (x1 * 8 + y1) + (x2 * 8 + y2)

        let x = self.x().wrapping_add_signed(x);
        let y = self.y().wrapping_add_signed(y);
        Position::try_new(x, y)
    }

    pub fn x(&self) -> u8 {
        (self.0 / 8) as u8
    }

    pub fn y(&self) -> u8 {
        (self.0 % 8) as u8
    }

    pub fn index(&self) -> usize {
        self.0
    }
}

impl Display for Position {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let file = match self.y() {
            0 => 'a',
            1 => 'b',
            2 => 'c',
            3 => 'd',
            4 => 'e',
            5 => 'f',
            6 => 'g',
            7 => 'h',
            _ => 'x',
        };

        let rank = 8 - self.x();

        write!(f, "{}{}", file, rank)
    }
}

impl TryFrom<u8> for Position {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        let x = value / 8;
        let y = value % 8;
        Position::try_new(x, y).ok_or(format!("{} {} is not position", x, y))
    }
}
