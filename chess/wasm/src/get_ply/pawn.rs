use crate::{
    piece::Piece,
    ply::Ply,
    position::Position,
    state::{board::Board, en_passant::EnPassant, mark::Mark},
};

struct PawnPlyIterator {
    mark: Mark,
    moves: [Option<Ply>; 4],

    count: usize,
    promotion_count: usize,
}

impl PawnPlyIterator {
    fn new(board: &Board, from: &Position, mark: &Mark, en_passant: &EnPassant) -> Self {
        PawnPlyIterator {
            mark: *mark,
            moves: get_pawn_ply(board, from, mark, en_passant),

            count: 0,
            promotion_count: 0,
        }
    }
}

impl Iterator for PawnPlyIterator {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        let ply = loop {
            if self.moves.len() <= self.count {
                return None;
            }

            match self.moves[self.count] {
                Some(move_item) => break move_item,
                None => {
                    self.count += 1;
                    continue;
                }
            }
        };

        if is_promotion(self.mark, ply) {
            const PROMOTION_TARGET_PIECES: [Piece; 4] =
                [Piece::Knight, Piece::Bishop, Piece::Rook, Piece::King];

            let promotion_target = PROMOTION_TARGET_PIECES[self.promotion_count];
            self.promotion_count += 1;
            if self.promotion_count == 4 {
                self.count += 1;
                self.promotion_count = 0;
            }

            Some(ply.move_to_promotion(&promotion_target))
        } else {
            self.count += 1;

            Some(ply)
        }
    }
}

fn get_pawn_ply(
    board: &Board,
    from: &Position,
    mark: &Mark,
    en_passant: &EnPassant,
) -> [Option<Ply>; 4] {
    let mark_direction = match mark {
        Mark::White => -1,
        Mark::Black => 1,
    };

    let pawn_step_1 = {
        if let Some(front_pos) = from.rel_new(mark_direction, 0) {
            let square_front = board.get_piece(front_pos);
            if square_front.mark() == Some(*mark) {
                // 眼の前のマスが味方の駒がいる
                None
            } else {
                Some(Ply::new_move(*from, front_pos))
            }
        } else {
            None
        }
    };

    let pawn_step_2 = {
        if pawn_step_1.is_some() {
            if let Some(front_pos) = from.rel_new(mark_direction * 2, 0) {
                let square_front = board.get_piece(front_pos);
                if square_front.mark() == Some(*mark) {
                    // 味方の駒がいる
                    None
                } else {
                    Some(Ply::new_move(*from, front_pos))
                }
            } else {
                None
            }
        } else {
            None
        }
    };
    let pawn_capture_left = {
        const LEFT_DIFFERENT: i8 = -1;
        if let Some(capture_pos) = from.rel_new(mark_direction, LEFT_DIFFERENT) {
            if en_passant.is_there(&capture_pos) {
                let en_passant_capture = from.rel_new(0, LEFT_DIFFERENT);
                if let Some(en_passant_capture) = en_passant_capture {
                    Some(Ply::new_en_passant(*from, capture_pos, en_passant_capture))
                } else {
                    None
                }
            } else {
                Some(Ply::new_move(*from, capture_pos))
            }
        } else {
            None
        }
    };

    let pawn_capture_right = {
        const RIGHT_DIFFERENT: i8 = 1;

        if let Some(capture_pos) = from.rel_new(mark_direction, RIGHT_DIFFERENT) {
            if en_passant.is_there(&capture_pos) {
                let en_passant_capture = from.rel_new(0, RIGHT_DIFFERENT);
                if let Some(en_passant_capture) = en_passant_capture {
                    Some(Ply::new_en_passant(*from, capture_pos, en_passant_capture))
                } else {
                    None
                }
            } else {
                Some(Ply::new_move(*from, capture_pos))
            }
        } else {
            None
        }
    };

    [
        pawn_step_1,
        pawn_step_2,
        pawn_capture_left,
        pawn_capture_right,
    ]
}

fn is_promotion(mark: Mark, ply: Ply) -> bool {
    let pos = match ply {
        Ply::Move { to, .. } => to,
        _ => return false,
    };

    let other_end_rank = match mark {
        Mark::Black => 7,
        Mark::White => 0,
    };

    pos.x == other_end_rank
}
