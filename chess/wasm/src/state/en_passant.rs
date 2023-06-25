use crate::{state::board::Board, state::piece::Piece, state::ply::Ply, state::position::Position};

use super::board_square::BoardSquare;

/// if pawn e6 -> e5 -> e4, notes en passant (e5)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct EnPassant(Option<Position>);

impl EnPassant {
    pub(crate) fn new(pos: Option<Position>) -> Self {
        Self(pos)
    }

    pub(crate) fn new_none() -> Self {
        Self(None)
    }

    pub(crate) fn new_position(pos: Position) -> Self {
        Self(Some(pos))
    }

    pub fn try_from_u8(value: Option<u8>) -> Option<Self> {
        match value {
            Some(i) => Some(Self::new_position(Position::try_from_u8(i)?)),
            None => Some(Self::new_none()),
        }
    }

    pub fn as_option(&self) -> Option<u8> {
        self.0.map(|pos| pos.index() as u8)
    }

    pub fn is_there(&self, position: &Position) -> bool {
        match self.0 {
            Some(en_passant_position) => *position == en_passant_position,
            None => false,
        }
    }

    pub fn next_turn_available(board: &Board, ply: &Ply) -> Self {
        match ply {
            Ply::Move { from, to } => match board.get_piece(from) {
                BoardSquare::Piece(_, Piece::Pawn) => {
                    let diff_x = from.x().abs_diff(to.x());

                    if diff_x == 2 && from.y() == to.y() {
                        let x = (from.x() + to.x()) / 2;
                        let y = from.y();

                        Self::new(Position::try_new(x, y))
                    } else {
                        Self::new_none()
                    }
                }
                _ => Self::new_none(),
            },
            _ => Self::new_none(),
        }
    }
}

#[cfg(test)]
mod test {
    use super::EnPassant;
    use crate::{
        state::piece::Piece,
        state::ply::Ply,
        state::position::Position,
        state::{board::Board, board_square::BoardSquare, mark::Mark},
    };

    #[test]
    fn test_enable() {
        let from = Position::new(1, 2);
        let to: Position = Position::new(3, 2);
        let expected = Position::new(2, 2);

        let mut board = Board::new();
        board.set_piece(&from, BoardSquare::new(Mark::Black, Piece::Pawn));

        let ply = Ply::new_move(from, to);

        let next_en_passant = EnPassant::next_turn_available(&board, &ply);

        assert_eq!(next_en_passant, EnPassant::new_position(expected))
    }

    #[test]
    fn test_disable() {
        let from = Position::new(1, 2);
        let to: Position = Position::new(2, 2);

        let mut board = Board::new();
        board.set_piece(&from, BoardSquare::new(Mark::Black, Piece::Pawn));

        let ply = Ply::new_move(from, to);

        let next_en_passant = EnPassant::next_turn_available(&board, &ply);

        assert_eq!(next_en_passant, EnPassant::new_none())
    }
}
