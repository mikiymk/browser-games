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
                && board.get_piece(&Position::new(7, 1)).is_empty()
                && board.get_piece(&Position::new(7, 2)).is_empty()
                && board.get_piece(&Position::new(7, 3)).is_empty()
                && !is_attacked_there(board, mark, &Position::new(7, 2))
                && !is_attacked_there(board, mark, &Position::new(7, 3))
                && !is_attacked_there(board, mark, &Position::new(7, 4))
            {
                ply_vec.push(Ply::new_castling(CastlingType::WhiteQueen))
            }

            if castling.get(CastlingType::WhiteKing)
                && board.get_piece(&Position::new(7, 5)).is_empty()
                && board.get_piece(&Position::new(7, 6)).is_empty()
                && !is_attacked_there(board, mark, &Position::new(7, 4))
                && !is_attacked_there(board, mark, &Position::new(7, 5))
                && !is_attacked_there(board, mark, &Position::new(7, 6))
            {
                ply_vec.push(Ply::new_castling(CastlingType::WhiteKing))
            }
        }
        Mark::Black => {
            if castling.get(CastlingType::BlackQueen)
                && board.get_piece(&Position::new(0, 1)).is_empty()
                && board.get_piece(&Position::new(0, 2)).is_empty()
                && board.get_piece(&Position::new(0, 3)).is_empty()
                && !is_attacked_there(board, mark, &Position::new(0, 4))
                && !is_attacked_there(board, mark, &Position::new(0, 3))
                && !is_attacked_there(board, mark, &Position::new(0, 2))
            {
                ply_vec.push(Ply::new_castling(CastlingType::BlackQueen))
            }

            if castling.get(CastlingType::BlackKing)
                && board.get_piece(&Position::new(0, 5)).is_empty()
                && board.get_piece(&Position::new(0, 6)).is_empty()
                && !is_attacked_there(board, mark, &Position::new(0, 4))
                && !is_attacked_there(board, mark, &Position::new(0, 5))
                && !is_attacked_there(board, mark, &Position::new(0, 6))
            {
                ply_vec.push(Ply::new_castling(CastlingType::BlackKing))
            }
        }
    }

    ply_vec
}
