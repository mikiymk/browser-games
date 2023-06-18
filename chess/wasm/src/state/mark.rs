#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Mark {
    White,
    Black,
}

impl Mark {
    pub fn invert(&self) -> Mark {
        use Mark::{Black, White};

        match self {
            White => Black,
            Black => White,
        }
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
