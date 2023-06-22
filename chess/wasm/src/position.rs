use std::fmt::Debug;

/// ```text
///   y |  0  1  2  3  4  5  6  7
/// x   |
/// - - +  -  -  -  -  -  -  -  -
/// 0   | a8 b8 c8 d8 e8 f8 g8 h8
/// 1   | a7 b7 c7 d7 e7 f7 g7 h7
/// 2   | a6 b6 c6 d6 e6 f6 g6 h6
/// 3   | a5 b5 c5 d5 e5 f5 g5 h5
/// 4   | a4 b4 c4 d4 e4 f4 g4 h4
/// 5   | a3 b3 c3 d3 e3 f3 g3 h3
/// 6   | a2 b2 c2 d2 e2 f2 g2 h2
/// 7   | a1 b1 c1 d1 e1 f1 g1 h1
/// ```
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub struct Position {
    x: u8,
    y: u8,
}

impl Position {
    pub const BLACK_KING: Position = Position { x: 0, y: 4 };
    pub const BLACK_ROOK_KING_SIDE: Position = Position { x: 0, y: 7 };
    pub const BLACK_ROOK_QUEEN_SIDE: Position = Position { x: 0, y: 0 };
    pub const WHITE_KING: Position = Position { x: 7, y: 4 };
    pub const WHITE_ROOK_KING_SIDE: Position = Position { x: 7, y: 7 };
    pub const WHITE_ROOK_QUEEN_SIDE: Position = Position { x: 7, y: 0 };

    pub fn try_new(x: u8, y: u8) -> Option<Position> {
        if 7 < x || 7 < y {
            None
        } else {
            Some(Position { x, y })
        }
    }

    pub fn new(x: u8, y: u8) -> Position {
        Position { x, y }
    }

    pub fn rel_new(&self, x: i8, y: i8) -> Option<Position> {
        let x: u8 = self.x.wrapping_add_signed(x);
        let y: u8 = self.y.wrapping_add_signed(y);

        Position::try_new(x, y)
    }

    pub fn x(&self) -> u8 {
        self.x
    }

    pub fn y(&self) -> u8 {
        self.y
    }

    pub fn index(&self) -> usize {
        (self.x as usize) * 8 + (self.y as usize)
    }

    pub fn algebraic(&self) -> String {
        format!(
            "{}{}",
            match self.x {
                0 => 'a',
                1 => 'b',
                2 => 'c',
                3 => 'd',
                4 => 'e',
                5 => 'f',
                6 => 'g',
                7 => 'h',
                _ => ' ',
            },
            8 - self.y
        )
    }
}

impl Debug for Position {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
