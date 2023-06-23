use crate::{
    piece::Piece,
    ply::Ply,
    position::Position,
    state::{board::Board, en_passant::EnPassant, mark::Mark},
};

pub fn get_pawn_ply(
    board: &Board,
    from: &Position,
    mark: &Mark,
    en_passant: &EnPassant,
) -> PawnPlyIterator {
    let mut plies = Vec::new();

    let mark_direction = mark.front_direction();

    if let Some(front_pos) = from.rel_new(mark_direction, 0) {
        if board.get_piece(&front_pos).mark().is_none() {
            // 眼の前のマスが駒がいない
            plies.push(Ply::new_move(*from, front_pos));

            if is_on_initial_rank(mark, from) {
                if let Some(front_pos) = from.rel_new(mark_direction * 2, 0) {
                    if board.get_piece(&front_pos).mark().is_none() {
                        // 駒がいない
                        plies.push(Ply::new_move(*from, front_pos));
                    }
                }
            }
        }
    }

    const LEFT_DIFFERENT: i8 = -1;
    const RIGHT_DIFFERENT: i8 = 1;

    for different in [LEFT_DIFFERENT, RIGHT_DIFFERENT] {
        if let Some(to) = from.rel_new(mark_direction, different) {
            if en_passant.is_there(&to) {
                let en_passant_capture = from.rel_new(0, different);
                if let Some(en_passant_capture) = en_passant_capture {
                    plies.push(Ply::new_en_passant(*from, to, en_passant_capture))
                }
            } else if board.is_other_mark(from, &to) {
                plies.push(Ply::new_move(*from, to))
            }
        }
    }

    PawnPlyIterator::new(plies.iter().flat_map(|ply| promotion(mark, ply)).collect())
}

fn promotion(mark: &Mark, ply: &Ply) -> Vec<Ply> {
    if is_on_promotion_rank(*mark, *ply) {
        const PROMOTION_TARGET_PIECES: [Piece; 4] =
            [Piece::Knight, Piece::Bishop, Piece::Rook, Piece::Queen];

        PROMOTION_TARGET_PIECES
            .iter()
            .map(|piece| ply.move_to_promotion(piece))
            .collect()
    } else {
        vec![*ply]
    }
}

fn is_on_initial_rank(mark: &Mark, position: &Position) -> bool {
    let initial_rank = match mark {
        Mark::Black => 1,
        Mark::White => 6,
    };

    position.x() == initial_rank
}

fn is_on_promotion_rank(mark: Mark, ply: Ply) -> bool {
    let pos = match ply {
        Ply::Move { to, .. } => to,
        _ => return false,
    };

    let other_end_rank = match mark {
        Mark::Black => 7,
        Mark::White => 0,
    };

    pos.x() == other_end_rank
}

pub struct PawnPlyIterator {
    vec: Vec<Ply>,

    count: usize,
}

impl PawnPlyIterator {
    fn new(vec: Vec<Ply>) -> Self {
        PawnPlyIterator { vec, count: 0 }
    }
}

impl Iterator for PawnPlyIterator {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        let ply = self.vec.get(self.count);
        self.count += 1;

        ply.copied()
    }
}

#[cfg(test)]
mod test {
    use crate::{
        piece::Piece,
        ply::Ply,
        position::Position,
        state::{board::Board, board_square::BoardSquare, en_passant::EnPassant, mark::Mark},
    };

    use super::get_pawn_ply;

    /// initialize board
    ///
    /// ## param
    ///
    /// ```rust
    /// macro set_board!((x: u8, y: u8) => (mark: Mark, piece: Piece), ...) -> Board
    /// ```
    ///
    /// ## usage
    ///
    /// ```rust
    /// let board = set_board!{
    ///     (1, 2) => (White, Rook),
    ///     (3, 4) => (Black, King),
    /// };
    /// ```
    macro_rules! set_board {
        { $( ( $x:expr , $y:expr ) => ( $mark:expr , $piece:expr ) ),* $(,)? } => {{
            #[allow(unused_imports)]
            use Mark::{Black, White};

            #[allow(unused_imports)]
            use Piece::{Pawn, Knight, Bishop, Rook, Queen, King};

            let mut board = Board::new();

            $(
                board.set_piece(&Position::new($x, $y), BoardSquare::new($mark, $piece));
            )*

            board
        }};
    }

    #[test]
    fn test_pawn_first_rank() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . . . . . .
        // 3 | . . . . . . . .
        // 4 | . . . * . . . .
        // 5 | . . r * n . . .
        // 6 | . . . P . . . .
        // 7 | . . . . . . . .

        let board = set_board! {
            (6, 3) => (White, Pawn),

            (5, 2) => (Black, Rook),
            (5, 4) => (Black, Knight),
        };

        let from = Position::new(6, 3);
        let mark = Mark::White;
        let en_passant = EnPassant::new();

        let mut iter = get_pawn_ply(&board, &from, &mark, &en_passant);

        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(5, 3))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(4, 3))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(5, 2))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(5, 4))));
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_pawn_moved() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . . . . . .
        // 3 | . . b * q . . .
        // 4 | . . . P . . . .
        // 5 | . . . . . . . .
        // 6 | . . . . . . . .
        // 7 | . . . . . . . .

        let board = set_board! {
            (4, 3) => (White, Pawn),

            (3, 2) => (Black, Bishop),
            (3, 4) => (Black, Queen),
        };

        let from = Position::new(4, 3);
        let mark = Mark::White;
        let en_passant = EnPassant::new();

        let mut iter = get_pawn_ply(&board, &from, &mark, &en_passant);

        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(3, 3))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(3, 2))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(3, 4))));
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_pawn_cannot_move() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . . . . . .
        // 3 | . . . . . . . .
        // 4 | . . . . . . . .
        // 5 | . . Q p K . . .
        // 6 | . . . P . . . .
        // 7 | . . . . . . . .

        let board = set_board! {
            (6, 3) => (White, Pawn),
            (5, 2) => (White, Queen),
            (5, 4) => (White, King),

            (5, 3) => (Black, Pawn),
        };

        let from = Position::new(6, 3);
        let mark = Mark::White;
        let en_passant = EnPassant::new();

        let mut iter = get_pawn_ply(&board, &from, &mark, &en_passant);

        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_pawn_en_passant() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . * * . . .
        // 3 | . . . P p . . .
        // 4 | . . . . . . . .
        // 5 | . . . . . . . .
        // 6 | . . . . . . . .
        // 7 | . . . . . . . .

        let board = set_board! {
            (3, 3) => (White, Pawn),

            (1, 4) => (Black, Pawn),
        };
        let en_passant = EnPassant::new();

        let ply = Ply::new_move(Position::new(1, 4), Position::new(3, 4));

        let en_passant = en_passant.next_turn_available(&board, &ply);
        let board = board.apply_ply(&ply);

        let from = Position::new(3, 3);
        let mark = Mark::White;

        let mut iter = get_pawn_ply(&board, &from, &mark, &en_passant);

        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(2, 3))));
        assert_eq!(
            iter.next(),
            Some(Ply::new_en_passant(
                from,
                Position::new(2, 4),
                Position::new(3, 4)
            ))
        );
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_pawn_promotion() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . * . . . .
        // 1 | . . . P . . . .
        // 2 | . . . . . . . .
        // 3 | . . . . . . . .
        // 4 | . . . . . . . .
        // 5 | . . . . . . . .
        // 6 | . . . . . . . .
        // 7 | . . . . . . . .

        let board = set_board! {
            (1, 3) => (White, Pawn),
        };

        let from = Position::new(1, 3);
        let mark = Mark::White;
        let en_passant = EnPassant::new();

        let mut iter = get_pawn_ply(&board, &from, &mark, &en_passant);

        assert_eq!(
            iter.next(),
            Some(Ply::new_promotion(from, Position::new(0, 3), Piece::Knight))
        );
        assert_eq!(
            iter.next(),
            Some(Ply::new_promotion(from, Position::new(0, 3), Piece::Bishop))
        );
        assert_eq!(
            iter.next(),
            Some(Ply::new_promotion(from, Position::new(0, 3), Piece::Rook))
        );
        assert_eq!(
            iter.next(),
            Some(Ply::new_promotion(from, Position::new(0, 3), Piece::Queen))
        );
        assert_eq!(iter.next(), None);
    }
}
