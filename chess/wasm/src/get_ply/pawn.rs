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
) -> Vec<Ply> {
    let mut plies = Vec::new();

    let mark_direction = match mark {
        Mark::White => -1,
        Mark::Black => 1,
    };

    if let Some(front_pos) = from.rel_new(mark_direction, 0) {
        if board.get_piece(&front_pos).mark().is_none() {
            // 眼の前のマスが駒がいない
            plies.push(Ply::new_move(*from, front_pos));

            if let Some(front_pos) = from.rel_new(mark_direction * 2, 0) {
                if board.get_piece(&front_pos).mark().is_none() {
                    // 駒がいない
                    plies.push(Ply::new_move(*from, front_pos));
                }
            }
        }
    }

    const LEFT_DIFFERENT: i8 = -1;
    const RIGHT_DIFFERENT: i8 = 1;

    for different in [LEFT_DIFFERENT, RIGHT_DIFFERENT] {
        if let Some(capture_pos) = from.rel_new(mark_direction, different) {
            if en_passant.is_there(&capture_pos) {
                let en_passant_capture = from.rel_new(0, different);
                if let Some(en_passant_capture) = en_passant_capture {
                    plies.push(Ply::new_en_passant(*from, capture_pos, en_passant_capture))
                }
            } else {
                plies.push(Ply::new_move(*from, capture_pos))
            }
        }
    }

    plies
        .iter()
        .map(|ply| promotion(mark, ply))
        .flatten()
        .collect()
}

fn promotion(mark: &Mark, ply: &Ply) -> Vec<Ply> {
    if is_promotion(*mark, *ply) {
        const PROMOTION_TARGET_PIECES: [Piece; 4] =
            [Piece::Knight, Piece::Bishop, Piece::Rook, Piece::King];

        PROMOTION_TARGET_PIECES
            .iter()
            .map(|piece| ply.move_to_promotion(piece))
            .collect()
    } else {
        vec![*ply]
    }
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
