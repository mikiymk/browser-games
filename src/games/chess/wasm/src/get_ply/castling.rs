use crate::{
    game::finish::is_attacked_there,
    state::ply::Ply,
    state::position::Position,
    state::{
        board::Board,
        castling::{Castling, CastlingType},
        mark::Mark,
    },
};

pub fn get_castling_ply(mark: &Mark, board: &Board, castling: &Castling) -> Vec<Ply> {
    let mut ply_vec = Vec::new();
    match mark {
        Mark::White => {
            if castling.get(CastlingType::WhiteQueen)
                && board
                    .get_piece(&Position::WHITE_KNIGHT_QUEENSIDE)
                    .is_empty()
                && board.get_piece(&Position::W_BQ).is_empty()
                && board.get_piece(&Position::W_Q).is_empty()
                && !is_attacked_there(board, mark, &Position::W_BQ)
                && !is_attacked_there(board, mark, &Position::W_Q)
                && !is_attacked_there(board, mark, &Position::W_K)
            {
                ply_vec.push(Ply::new_castling(CastlingType::WhiteQueen))
            }

            if castling.get(CastlingType::WhiteKing)
                && board.get_piece(&Position::W_BK).is_empty()
                && board.get_piece(&Position::W_NK).is_empty()
                && !is_attacked_there(board, mark, &Position::W_K)
                && !is_attacked_there(board, mark, &Position::W_BK)
                && !is_attacked_there(board, mark, &Position::W_NK)
            {
                ply_vec.push(Ply::new_castling(CastlingType::WhiteKing))
            }
        }
        Mark::Black => {
            if castling.get(CastlingType::BlackQueen)
                && board.get_piece(&Position::B_NQ).is_empty()
                && board.get_piece(&Position::B_BQ).is_empty()
                && board.get_piece(&Position::B_Q).is_empty()
                && !is_attacked_there(board, mark, &Position::B_BQ)
                && !is_attacked_there(board, mark, &Position::B_Q)
                && !is_attacked_there(board, mark, &Position::B_K)
            {
                ply_vec.push(Ply::new_castling(CastlingType::BlackQueen))
            }

            if castling.get(CastlingType::BlackKing)
                && board.get_piece(&Position::B_BK).is_empty()
                && board.get_piece(&Position::B_NK).is_empty()
                && !is_attacked_there(board, mark, &Position::B_K)
                && !is_attacked_there(board, mark, &Position::B_BK)
                && !is_attacked_there(board, mark, &Position::B_NK)
            {
                ply_vec.push(Ply::new_castling(CastlingType::BlackKing))
            }
        }
    }

    ply_vec
}
