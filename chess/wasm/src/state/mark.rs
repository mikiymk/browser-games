use std::fmt::Display;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Mark {
    White,
    Black,
}

impl Mark {
    pub fn try_from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(Mark::White),
            1 => Some(Mark::Black),
            _ => None,
        }
    }

    pub fn invert(&self) -> Mark {
        use Mark::{Black, White};

        match self {
            White => Black,
            Black => White,
        }
    }

    pub fn front_direction(&self) -> i8 {
        match self {
            Mark::White => -1,
            Mark::Black => 1,
        }
    }
}

impl Display for Mark {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Mark::White => "White",
                Mark::Black => "Black",
            }
        )
    }
}

#[cfg(test)]
mod test {
    use super::Mark;

    #[test]
    fn test_white_to_black() {
        let mark = Mark::White;
        let result = mark.invert();
        let expected = Mark::Black;

        assert_eq!(result, expected)
    }

    #[test]
    fn test_black_to_white() {
        let mark = Mark::Black;
        let result = mark.invert();
        let expected = Mark::White;

        assert_eq!(result, expected)
    }
}
